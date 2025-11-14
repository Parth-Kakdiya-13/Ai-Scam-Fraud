import FraudEntity from '../models/FraudEntity.js'

export async function createReport(req, res) {
    try {
        const { kind, identifier, note, userId } = req.body

        if (!kind || !identifier) {
            return res.status(400).json({ error: 'Kind and identifier are required' })
        }

        if (!['phone', 'upi', 'domain'].includes(kind)) {
            return res.status(400).json({ error: 'Invalid kind (must be phone, upi, or domain)' })
        }

        // Find or create fraud entity
        let entity = await FraudEntity.findOne({ kind, identifier })

        if (!entity) {
            entity = await FraudEntity.create({
                kind,
                identifier,
                reports: [{ userId, note }],
                riskScore: 50
            })
        } else {
            // Add report to existing entity
            entity.reports.push({ userId, note })
            // Update risk score based on report count
            entity.riskScore = Math.min(100, 50 + entity.reports.length * 5)
            await entity.save()
        }

        return res.status(201).json({
            ok: true,
            entity: {
                id: entity._id,
                kind: entity.kind,
                identifier: entity.identifier,
                reportCount: entity.reports.length,
                riskScore: entity.riskScore
            }
        })
    } catch (err) {
        console.error('Create report error:', err)
        return res.status(500).json({ error: err.message })
    }
}

export async function getFraudEntity(req, res) {
    try {
        const { kind, identifier } = req.params

        if (!['phone', 'upi', 'domain'].includes(kind)) {
            return res.status(400).json({ error: 'Invalid kind' })
        }

        const entity = await FraudEntity.findOne({ kind, identifier })

        if (!entity) {
            return res.status(404).json({ error: 'No reports found for this entity' })
        }

        return res.json({
            ok: true,
            entity: {
                id: entity._id,
                kind: entity.kind,
                identifier: entity.identifier,
                reportCount: entity.reports.length,
                riskScore: entity.riskScore,
                reportsCount: entity.reports.length,
                createdAt: entity.createdAt
            }
        })
    } catch (err) {
        console.error('Get fraud entity error:', err)
        return res.status(500).json({ error: err.message })
    }
}

export async function listFraudEntities(req, res) {
    try {
        const { kind, limit = 50 } = req.query

        const query = kind ? { kind } : {}
        const entities = await FraudEntity.find(query)
            .sort({ riskScore: -1, createdAt: -1 })
            .limit(parseInt(limit))

        return res.json({
            ok: true,
            count: entities.length,
            entities: entities.map(e => ({
                id: e._id,
                kind: e.kind,
                identifier: e.identifier,
                reportCount: e.reports.length,
                riskScore: e.riskScore
            }))
        })
    } catch (err) {
        console.error('List fraud entities error:', err)
        return res.status(500).json({ error: err.message })
    }
}
