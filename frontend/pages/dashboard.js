import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import { withAuth } from '../components/withAuth'
import { logout, authenticatedFetch } from '../lib/auth'
import { api } from '../api/api'

function Dashboard() {
    const router = useRouter()
    const [user, setUser] = useState(null)
    const [reports, setReports] = useState([])
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({ total: 0, threats: 0 })
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    useEffect(() => {
        // Load user from localStorage
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            setUser(JSON.parse(storedUser))
        }

        // Fetch scan history
        fetchReportHistory()
    }, [])

    async function fetchReportHistory() {
        try {
            const res = await authenticatedFetch(`${api}/api/scan/history?limit=20`)
            if (!res.ok) throw new Error('Failed to fetch history')
            const data = await res.json()

            if (data.ok && data.reports) {
                setReports(data.reports)

                // Calculate stats
                const threatCount = data.reports.filter(r =>
                    r.result?.isFraud || r.result?.riskLevel === 'high' || r.result?.riskLevel === 'medium'
                ).length
                setStats({ total: data.reports.length, threats: threatCount })
            }
        } catch (err) {
            console.error('Error fetching history:', err)
        } finally {
            setLoading(false)
        }
    }

    function handleLogout() {
        logout()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <p>Loading...</p>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Navigation */}
            <Navbar />

            {/* Header */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-6 py-6">
                    <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
                </div>
            </header>

            <main className="container mx-auto px-6 py-12">
                {/* User Info Card */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                    <h2 className="text-xl font-bold mb-4">Account Information</h2>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-gray-600">Name</p>
                            <p className="text-lg font-semibold">{user?.name}</p>
                        </div>
                        <div>
                            <p className="text-sm text-gray-600">Email</p>
                            <p className="text-lg font-semibold">{user?.email}</p>
                        </div>
                    </div>
                </div>

                {/* Statistics */}
                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Statistics</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-blue-50 p-4 rounded">
                                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                                <div className="text-sm text-gray-600">Total Scans</div>
                            </div>
                            <div className="bg-red-50 p-4 rounded">
                                <div className="text-2xl font-bold text-red-600">{stats.threats}</div>
                                <div className="text-sm text-gray-600">Threats Found</div>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">Quick Actions</h2>
                        <div className="space-y-2">
                            <button
                                onClick={() => router.push('/#scan-message')}
                                className="w-full px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                            >
                                Scan Message
                            </button>
                            <button
                                onClick={() => router.push('/#scan-url')}
                                className="w-full px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
                            >
                                Scan URL
                            </button>
                        </div>
                    </div>
                </div>

                {/* Recent Scans */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-bold mb-4">Recent Scans</h2>
                    {reports.length === 0 ? (
                        <p className="text-gray-500">No scans yet. Start scanning from the home page.</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-2 px-4">Type</th>
                                        <th className="text-left py-2 px-4">Original</th>
                                        <th className="text-left py-2 px-4">Risk Level</th>
                                        <th className="text-left py-2 px-4">Date</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {reports.map((report) => (
                                        <tr key={report._id} className="border-b hover:bg-gray-50">
                                            <td className="py-2 px-4 capitalize">{report.type}</td>
                                            <td className="py-2 px-4 truncate text-sm">
                                                {report.original.substring(0, 50)}...
                                            </td>
                                            <td className="py-2 px-4">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-semibold ${report.result?.riskLevel === 'high'
                                                        ? 'bg-red-100 text-red-800'
                                                        : report.result?.riskLevel === 'medium'
                                                            ? 'bg-yellow-100 text-yellow-800'
                                                            : 'bg-green-100 text-green-800'
                                                        }`}
                                                >
                                                    {report.result?.riskLevel || 'Unknown'}
                                                </span>
                                            </td>
                                            <td className="py-2 px-4 text-sm">
                                                {new Date(report.createdAt).toLocaleDateString()}
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </main>
        </div>
    )
}

export default withAuth(Dashboard)
