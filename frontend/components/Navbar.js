import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Link from 'next/link'
import { isAuthenticated, logout } from '../lib/auth'

export default function Navbar() {
    const router = useRouter()
    const [authenticated, setAuthenticated] = useState(false)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const checkAuth = () => {
            setAuthenticated(isAuthenticated())
            if (isAuthenticated()) {
                const storedUser = localStorage.getItem('user')
                if (storedUser) {
                    setUser(JSON.parse(storedUser))
                }
            }
        }

        checkAuth()
        // Re-check on route change
        router.events?.on('routeChangeComplete', checkAuth)
        return () => router.events?.off('routeChangeComplete', checkAuth)
    }, [router])

    const handleLogout = () => {
        logout()
    }

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-6 py-4 flex justify-between items-center">
                {/* Logo */}
                <Link href="/" className="flex items-center gap-2 text-2xl font-bold text-blue-600 hover:text-blue-700">
                    🛡️ AI Scam Shield
                </Link>

                {/* Navigation Links */}
                <div className="flex items-center gap-6">
                    {authenticated ? (
                        <>
                            <Link href="/dashboard" className="text-gray-700 hover:text-blue-600 font-medium">
                                Dashboard
                            </Link>
                            <Link href="/" className="text-gray-700 hover:text-blue-600 font-medium">
                                Scan Services
                            </Link>
                            <div className="flex items-center gap-4 pl-6 border-l">
                                <span className="text-gray-700">{user?.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </>
                    ) : (
                        <>
                            <Link href="/signin" className="text-gray-700 hover:text-blue-600 font-medium">
                                Sign In
                            </Link>
                            <Link href="/signup" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition font-medium">
                                Sign Up
                            </Link>
                        </>
                    )}
                </div>
            </div>
        </nav>
    )
}
