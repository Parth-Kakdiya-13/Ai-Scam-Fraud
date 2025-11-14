import User from '../models/User.js'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export async function register(req, res) {
    try {
        const { name, email, password } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'Name, email, and password are required' })
        }

        // Check if user exists
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            return res.status(400).json({ error: 'Email already in use' })
        }

        // Create user
        const user = await User.create({
            name,
            email,
            passwordHash: password,
            role: 'user'
        })

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })

        return res.status(201).json({
            ok: true,
            user: { id: user._id, name: user.name, email: user.email },
            token
        })
    } catch (err) {
        console.error('Register error:', err)
        return res.status(500).json({ error: err.message })
    }
}

export async function login(req, res) {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' })
        }

        // Find user
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        // Compare password
        const isValid = await user.comparePassword(password)
        if (!isValid) {
            return res.status(401).json({ error: 'Invalid email or password' })
        }

        const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: '7d' })

        return res.json({
            ok: true,
            user: { id: user._id, name: user.name, email: user.email },
            token
        })
    } catch (err) {
        console.error('Login error:', err)
        return res.status(500).json({ error: err.message })
    }
}

export function verifyToken(req, res, next) {
    try {
        const token = req.headers.authorization?.split(' ')[1]
        if (!token) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const decoded = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.userId
        next()
    } catch (err) {
        return res.status(401).json({ error: 'Invalid token' })
    }
}
