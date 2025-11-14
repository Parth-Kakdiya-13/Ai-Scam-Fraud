import mongoose from 'mongoose'

const fraudEntitySchema = new mongoose.Schema({
    kind: {
        type: String,
        enum: ['phone', 'upi', 'domain'],
        required: true
    },
    identifier: {
        type: String,
        required: true,
        index: true
    },
    reports: [
        {
            userId: mongoose.Schema.Types.ObjectId,
            note: String,
            createdAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    riskScore: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    createdAt: {
        type: Date,
        default: Date.now,
        index: true
    }
})

const FraudEntity = mongoose.model('FraudEntity', fraudEntitySchema)
export default FraudEntity
