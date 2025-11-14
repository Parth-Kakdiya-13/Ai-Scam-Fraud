import React, { useState } from 'react'
import { useRouter } from 'next/router'
import Navbar from '../components/Navbar'
import ScanForm from '../components/ScanForm'
import ResultCard from '../components/ResultCard'
import { withAuth } from '../components/withAuth'

function Home() {
    const router = useRouter()
    const [result, setResult] = useState(null)

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation */}
            <Navbar />

            {/* Header */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-6 py-6">
                    <h1 className="text-4xl font-bold text-gray-900">🛡️ Scan & Protect</h1>
                    <p className="text-gray-600 mt-2">Analyze messages, URLs, and screenshots for potential threats</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-3 gap-8 mb-12">
                    <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-xl font-bold mb-4">✨ Services</h2>
                        <ul className="space-y-2 text-sm text-gray-700">
                            <li>✓ Message Classification</li>
                            <li>✓ URL Risk Detection</li>
                            <li>✓ Screenshot OCR Analysis</li>
                            <li>✓ Community Reports</li>
                            <li>✓ Real-time Threat Intelligence</li>
                        </ul>
                    </div>

                    <div className="lg:col-span-2">
                        <ScanForm onResult={setResult} />

                        {result && (
                            <div>
                                <h2 className="text-2xl font-bold mb-4">Analysis Result</h2>
                                <ResultCard result={result} />
                            </div>
                        )}

                        {!result && (
                            <div className="bg-white rounded-lg shadow-md p-8 text-center text-gray-500">
                                <p className="text-lg">👈 Start by pasting a message or URL above</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-gray-900 text-gray-300 py-8 mt-12">
                <div className="container mx-auto px-6 text-center">
                    <p className="mb-2">
                        ⚠️ Disclaimer: This tool provides risk assessments and is not legal advice.
                    </p>
                    <p className="text-sm">© 2024 AI Scam Shield. All rights reserved.</p>
                </div>
            </footer>
        </div>
    )
}

// Protect this page - only authenticated users can access
export default withAuth(Home)
