import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import scanRoutes from '../routes/scan.js'
import authRoutes from '../routes/auth.js'
import reportRoutes from '../routes/report.js'

dotenv.config()

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:3000' }))
app.use(express.json({ limit: '50mb' }))
app.use(express.urlencoded({ limit: '50mb', extended: true }))

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ai-scam-shield')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err.message))

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/scan', scanRoutes)
app.use('/api/report', reportRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'AI Scam Shield Backend is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err.message)
    res.status(err.status || 500).json({ error: err.message || 'Internal Server Error' })
})

// 404
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' })
})

app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`)
    console.log(`📍 Health check: http://localhost:${PORT}/api/health`)
})
