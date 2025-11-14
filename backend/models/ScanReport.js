import mongoose from 'mongoose'

const scanReportSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    type: {
        type: String,
        enum: ['message', 'url', 'screenshot'],
        required: true
    },
    original: {
        type: String,
        required: true
    },
    result: {
        category: String,
        score: Number,
        reason: String,
        details: mongoose.Schema.Types.Mixed
    },
    provider: {
        type: String,
        enum: ['openai', 'virusTotal', 'custom'],
        default: 'openai'
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
})

const ScanReport = mongoose.model('ScanReport', scanReportSchema)
export default ScanReport
