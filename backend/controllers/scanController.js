import ScanReport from '../models/ScanReport.js'
import FraudEntity from '../models/FraudEntity.js'
import { classifyMessage } from '../services/openaiService.js'
import { scanUrl as performUrlScan } from '../services/urlService.js'
import { extractTextFromImage, extractEntities } from '../services/ocrService.js'

export async function scanMessage(req, res) {
    try {
        const { text } = req.body
        const userId = req.userId // From auth middleware

        if (!text || text.trim().length === 0) {
            return res.status(400).json({ error: 'Text is required' })
        }

        // Call LLM for classification
        const result = await classifyMessage(text)

        // Save to DB with userId
        const report = await ScanReport.create({
            userId,
            type: 'message',
            original: text,
            result,
            provider: 'openai'
        })

        return res.json({
            ok: true,
            reportId: report._id,
            result
        })
    } catch (err) {
        console.error('Scan message error:', err)
        return res.status(500).json({ error: err.message })
    }
}

export async function scanUrl(req, res) {
    try {
        const { url } = req.body
        const userId = req.userId // From auth middleware

        if (!url || url.trim().length === 0) {
            return res.status(400).json({ error: 'URL is required' })
        }

        // Call URL scanning service
        const result = await performUrlScan(url)

        // Save to DB with userId
        const report = await ScanReport.create({
            userId,
            type: 'url',
            original: url,
            result,
            provider: 'virusTotal'
        })

        return res.json({
            ok: true,
            reportId: report._id,
            result
        })
    } catch (err) {
        console.error('Scan URL error:', err)
        return res.status(500).json({ error: err.message })
    }
}

export async function scanScreenshot(req, res) {
    try {
        const userId = req.userId // From auth middleware

        if (!req.file) {
            return res.status(400).json({ error: 'Screenshot file is required' })
        }

        // Extract text from image
        const ocrResult = await extractTextFromImage(
            req.file.buffer,
            req.file.mimetype
        )

        // Extract entities from OCR'd text
        const entities = extractEntities(ocrResult.text)

        // Classify the extracted text
        const classificationResult = await classifyMessage(ocrResult.text)

        // Save to DB with userId
        const report = await ScanReport.create({
            userId,
            type: 'screenshot',
            original: `[Screenshot uploaded - ${req.file.originalname}]`,
            result: {
                ...classificationResult,
                ocrText: ocrResult.text,
                extractedEntities: entities
            },
            provider: 'openai'
        })

        return res.json({
            ok: true,
            reportId: report._id,
            ocrText: ocrResult.text,
            entities,
            classification: classificationResult
        })
    } catch (err) {
        console.error('Scan screenshot error:', err)
        return res.status(500).json({ error: err.message })
    }
}

export async function getReportHistory(req, res) {
    try {
        const userId = req.userId // From auth middleware
        const limit = parseInt(req.query.limit) || 10

        const reports = await ScanReport.find({ userId })
            .sort({ createdAt: -1 })
            .limit(limit)

        return res.json({
            ok: true,
            count: reports.length,
            reports
        })
    } catch (err) {
        console.error('Get history error:', err)
        return res.status(500).json({ error: err.message })
    }
}
