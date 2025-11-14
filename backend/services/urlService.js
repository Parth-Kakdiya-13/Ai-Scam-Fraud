import axios from 'axios'

const VIRUSTOTAL_API_KEY = process.env.VIRUSTOTAL_API_KEY
const VT_BASE_URL = 'https://www.virustotal.com/api/v3'

// Quick heuristics for URL analysis
export function analyzeUrlHeuristics(url) {
    try {
        const urlObj = new URL(url)
        const domain = urlObj.hostname
        let score = 0

        // Check for suspicious patterns
        if (domain.length > 50) score += 10 // Unusually long domain
        if (/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/.test(domain)) score += 30 // IP instead of domain
        if (domain.match(/[àáâãäåèéêëìíîïòóôõöùúûüýÿ]/)) score += 20 // Unicode characters (homograph attack)
        if (url.includes('bit.ly') || url.includes('tinyurl') || url.includes('short.link')) score += 15 // URL shortener
        if (!url.startsWith('https')) score += 10 // Not HTTPS

        return {
            heuristicScore: Math.min(score, 100),
            domain,
            protocol: urlObj.protocol,
            hasHttps: url.startsWith('https')
        }
    } catch (err) {
        return { error: 'Invalid URL', heuristicScore: 0 }
    }
}

// Query VirusTotal for URL reputation
export async function queryVirusTotal(url) {
    if (!VIRUSTOTAL_API_KEY) {
        return { error: 'VirusTotal API key not configured', vtScore: null }
    }

    try {
        // Encode URL for VirusTotal
        const encodedUrl = Buffer.from(url).toString('base64').replace(/=/g, '')

        const response = await axios.get(`${VT_BASE_URL}/urls/${encodedUrl}`, {
            headers: {
                'x-apikey': VIRUSTOTAL_API_KEY
            }
        })

        const data = response.data.data.attributes
        const stats = data.last_analysis_stats

        // Calculate score based on detections
        const totalEngines = stats.malicious + stats.suspicious + stats.undetected + stats.harmless
        const vtScore = (stats.malicious * 100 + stats.suspicious * 50) / totalEngines

        return {
            vtScore: Math.round(vtScore),
            malicious: stats.malicious,
            suspicious: stats.suspicious,
            harmless: stats.harmless,
            lastAnalysis: data.last_analysis_date
        }
    } catch (err) {
        console.error('VirusTotal error:', err.message)
        return { error: 'VirusTotal query failed', vtScore: null }
    }
}

// Estimate domain age (simple check)
export async function estimateDomainAge(domain) {
    try {
        // This is a placeholder - you'd integrate with WHOIS API
        // For MVP, return a conservative estimate
        return {
            estimated: true,
            ageScore: 30, // Days old estimate (0-100 scale)
            note: 'Placeholder - integrate WHOIS API for production'
        }
    } catch (err) {
        return { error: 'Domain age lookup failed', ageScore: 0 }
    }
}

// Combine all URL checks
export async function scanUrl(url) {
    const heuristics = analyzeUrlHeuristics(url)
    const vtResults = await queryVirusTotal(url)
    const ageData = await estimateDomainAge(heuristics.domain)

    // Weighted scoring
    let finalScore = 0
    let details = {}

    if (heuristics.heuristicScore) {
        finalScore += heuristics.heuristicScore * 0.2
        details.heuristics = heuristics.heuristicScore
    }

    if (vtResults.vtScore !== null && vtResults.vtScore !== undefined) {
        finalScore += vtResults.vtScore * 0.6
        details.virustotal = vtResults
    }

    if (ageData.ageScore) {
        finalScore += ageData.ageScore * 0.2
        details.domainAge = ageData
    }

    const category =
        finalScore > 70 ? 'malicious' : finalScore > 40 ? 'suspicious' : 'safe'

    return {
        category,
        score: Math.round(finalScore),
        url,
        details,
        reason: `Combined analysis: heuristics=${details.heuristics || 0}, VT=${vtResults.malicious || 0} malicious engines`
    }
}
