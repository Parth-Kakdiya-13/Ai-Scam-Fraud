import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key'

export function verifyAuth(req, res, next) {
    try {
        const authHeader = req.headers.authorization
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ error: 'No token provided' })
        }

        const token = authHeader.slice(7) // Remove "Bearer " prefix
        const decoded = jwt.verify(token, JWT_SECRET)
        req.userId = decoded.userId
        console.log(req.userId)
        next()
    } catch (err) {
        console.error('Auth error:', err.message)
        return res.status(401).json({ error: 'Invalid or expired token' })
    }
}

export default verifyAuth
