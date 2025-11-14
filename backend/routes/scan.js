import express from 'express'
import { verifyAuth } from '../middleware/authMiddleware.js'
import {
    scanMessage,
    scanUrl,
    scanScreenshot,
    getReportHistory
} from '../controllers/scanController.js'

const router = express.Router()

// All scan routes require authentication
router.use(verifyAuth)

// POST /api/scan/message
router.post('/message', scanMessage)

// POST /api/scan/url
router.post('/url', scanUrl)

// POST /api/scan/screenshot
router.post('/screenshot', scanScreenshot)

// GET /api/scan/history
router.get('/history', getReportHistory)

export default router
