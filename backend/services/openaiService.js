import OpenAI from 'openai'

let client = null

function getClient() {
    if (!client) {
        if (!process.env.OPENAI_API_KEY) {
            throw new Error('OPENAI_API_KEY environment variable is not set')
        }
        client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })
    }
    return client
}

export async function classifyMessage(text) {
    try {
        const openai = getClient()
        const prompt = `You are a fraud-detection assistant. Classify the following message as one of: "scam", "suspicious", "safe". Provide a numeric confidence score 0-100 and a short reason.

Message:
"${text}"

Return ONLY valid JSON with keys: category, score, reason. Example: {"category": "scam", "score": 85, "reason": "Contains typical phishing patterns"}`

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 200
        })

        const textContent = response.choices[0].message.content
        const result = JSON.parse(textContent)
        return result
    } catch (err) {
        console.error('OpenAI error:', err.message)
        throw new Error('Failed to classify message: ' + err.message)
    }
}

export async function summarizeRisk(details) {
    try {
        const openai = getClient()
        const prompt = `Summarize the following threat intelligence data and provide a brief risk assessment:

${JSON.stringify(details, null, 2)}

Return JSON with: summary, overallRisk (0-100), recommendation.`

        const response = await openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
                {
                    role: 'user',
                    content: prompt
                }
            ],
            temperature: 0.7,
            max_tokens: 300
        })

        const textContent = response.choices[0].message.content
        const result = JSON.parse(textContent)
        return result
    } catch (err) {
        console.error('OpenAI error:', err.message)
        throw new Error('Failed to summarize risk: ' + err.message)
    }
}
