import express from 'express'
import { register, login, verifyToken } from '../controllers/authController.js'

const router = express.Router()

router.post('/register', register)
router.post('/login', login)
router.post('/verify', verifyToken, (req, res) => {
    res.json({ ok: true, userId: req.userId })
})

export default router
