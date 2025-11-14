import React, { useState } from 'react'
import { authenticatedFetch } from '../lib/auth'
import { api } from '../api/api'

export default function ScanForm({ onResult }) {
    const [input, setInput] = useState('')
    const [type, setType] = useState('message')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const endpoint =
                type === 'message' ? '/api/scan/message' : type === 'url' ? '/api/scan/url' : null

            if (!endpoint) {
                setError('Invalid scan type')
                return
            }

            // Use authenticatedFetch to include JWT token
            const response = await authenticatedFetch(
                `${api}${endpoint}`,
                {
                    method: 'POST',
                    body: JSON.stringify({
                        [type === 'message' ? 'text' : 'url']: input
                    })
                }
            )

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || `Scan failed with status ${response.status}`)
            }

            const data = await response.json()
            onResult(data.result)
            setInput('')
        } catch (err) {
            setError(err.message || 'An error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Select Type
                </label>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                    <option value="message">Text Message</option>
                    <option value="url">URL Link</option>
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    {type === 'message' ? 'Paste Message' : 'Enter URL'}
                </label>
                <textarea
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    placeholder={type === 'message' ? 'Paste suspicious message...' : 'https://example.com'}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-32"
                />
            </div>

            {error && <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">{error}</div>}

            <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-full bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
                {loading ? 'Scanning...' : 'Scan Now'}
            </button>
        </form>
    )
}
