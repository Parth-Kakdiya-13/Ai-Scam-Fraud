import mongoose from 'mongoose'
import bcryptjs from 'bcryptjs'

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
})

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('passwordHash')) return next()
    try {
        const salt = await bcryptjs.genSalt(10)
        this.passwordHash = await bcryptjs.hash(this.passwordHash, salt)
        next()
    } catch (err) {
        next(err)
    }
})

// Method to compare password
userSchema.methods.comparePassword = async function (password) {
    return bcryptjs.compare(password, this.passwordHash)
}

const User = mongoose.model('User', userSchema)
export default User
