"user client"
import { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import Link from 'next/link'
import { api } from '../api/api'

export default function Signup() {
    const router = useRouter()
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState(null)
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    async function handleSubmit(e) {
        e.preventDefault()
        setError(null)
        setLoading(true)
        try {
            const res = await fetch(`${api}/api/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })
            const data = await res.json()
            if (!res.ok) throw new Error(data.message || 'Registration failed')
            // registration success -> redirect to sign in
            router.push('/signin')
        } catch (err) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <Navbar />

            <div className="min-h-screen flex items-center justify-center bg-gray-50 pt-20">
                <div className="max-w-md w-full bg-white p-8 rounded shadow">
                    <h1 className="text-2xl font-semibold mb-6">Create account</h1>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium">Name</label>
                            <input
                                className="mt-1 block w-full px-3 py-2 border rounded"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Email</label>
                            <input
                                type="email"
                                className="mt-1 block w-full px-3 py-2 border rounded"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium">Password</label>
                            <input
                                type="password"
                                className="mt-1 block w-full px-3 py-2 border rounded"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        {error && <div className="text-red-600 text-sm">{error}</div>}

                        <div>
                            <button
                                type="submit"
                                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-60"
                                disabled={loading}
                            >
                                {loading ? 'Creating...' : 'Create account'}
                            </button>
                        </div>
                    </form>

                    <p className="mt-4 text-sm text-gray-600">
                        Already have an account?{' '}
                        <Link href="/signin" className="text-blue-600 hover:underline">
                            Sign in
                        </Link>
                    </p>
                </div>
            </div>
        </div>
    )
}
