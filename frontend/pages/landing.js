import Link from 'next/link'
import Navbar from '../components/Navbar'

export default function Landing() {
    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
            {/* Navigation */}
            <Navbar />

            {/* Header */}
            <header className="bg-white shadow">
                <div className="container mx-auto px-6 py-6">
                    <h1 className="text-4xl font-bold text-gray-900">🛡️ AI Scam Shield</h1>
                    <p className="text-gray-600 mt-2">Protect yourself from fraud with AI-powered analysis</p>
                </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-6 py-12">
                <div className="grid lg:grid-cols-2 gap-12 items-center mb-12">
                    {/* Left Side - Info */}
                    <div>
                        <h2 className="text-3xl font-bold text-gray-900 mb-6">Advanced Scam Detection</h2>
                        <p className="text-gray-700 mb-4 text-lg">
                            Stay safe online with our AI-powered scam detection system. Analyze messages, URLs, and screenshots to identify potential threats.
                        </p>

                        {/* Features */}
                        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                            <h3 className="text-xl font-bold mb-4">✨ Features</h3>
                            <ul className="space-y-3 text-gray-700">
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span> Message Classification
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span> URL Risk Detection
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span> Screenshot OCR Analysis
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span> Community Reports
                                </li>
                                <li className="flex items-center gap-2">
                                    <span className="text-green-600">✓</span> Real-time Threat Intelligence
                                </li>
                            </ul>
                        </div>

                        {/* CTA Buttons */}
                        <div className="flex gap-4">
                            <Link href="/signin" className="px-6 py-3 bg-blue-600 text-white rounded-lg font-bold hover:bg-blue-700 transition">
                                Sign In
                            </Link>
                            <Link href="/signup" className="px-6 py-3 bg-green-600 text-white rounded-lg font-bold hover:bg-green-700 transition">
                                Create Account
                            </Link>
                        </div>
                    </div>

                    {/* Right Side - Visual */}
                    <div className="bg-white rounded-lg shadow-lg p-8">
                        <div className="text-center">
                            <div className="text-6xl mb-4">🔍</div>
                            <h3 className="text-2xl font-bold text-gray-900 mb-4">Real-Time Detection</h3>
                            <p className="text-gray-600 mb-6">
                                Get instant analysis and risk assessments for any message, URL, or image. Our AI-powered system identifies potential scams in seconds.
                            </p>
                            <div className="space-y-2 text-gray-700">
                                <p className="font-semibold">Powered by:</p>
                                <p>🤖 OpenAI GPT-4</p>
                                <p>🔗 VirusTotal Intelligence</p>
                                <p>📊 Community Reports</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Stats/Benefits */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-blue-600 mb-2">1000+</div>
                        <p className="text-gray-700 font-semibold">Threats Detected</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-green-600 mb-2">24/7</div>
                        <p className="text-gray-700 font-semibold">Protection Available</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-4xl font-bold text-purple-600 mb-2">100%</div>
                        <p className="text-gray-700 font-semibold">Free to Use</p>
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
