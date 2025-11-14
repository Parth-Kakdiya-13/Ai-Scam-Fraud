import React from 'react'

export default function ResultCard({ result }) {
    if (!result) return null

    const getCategoryColor = (category) => {
        switch (category?.toLowerCase()) {
            case 'scam':
            case 'malicious':
                return 'red'
            case 'suspicious':
                return 'yellow'
            case 'safe':
                return 'green'
            default:
                return 'gray'
        }
    }

    const color = getCategoryColor(result.category)
    const colorMap = {
        red: 'bg-red-100 border-red-300 text-red-900',
        yellow: 'bg-yellow-100 border-yellow-300 text-yellow-900',
        green: 'bg-green-100 border-green-300 text-green-900',
        gray: 'bg-gray-100 border-gray-300 text-gray-900'
    }

    return (
        <div className={`border-l-4 rounded-lg p-6 ${colorMap[color]}`}>
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-2xl font-bold">
                    {result.category?.toUpperCase() || 'Unknown'}
                </h3>
                <div className="text-4xl font-bold opacity-75">{result.score || 0}%</div>
            </div>

            <div className="mb-4">
                <div className="bg-black bg-opacity-10 rounded-full h-4 overflow-hidden">
                    <div
                        className={`bg-${color}-500 h-full transition-all duration-500`}
                        style={{ width: `${result.score || 0}%` }}
                    />
                </div>
            </div>

            <p className="text-lg mb-4">{result.reason || 'Analysis complete'}</p>

            {result.details && (
                <details className="cursor-pointer">
                    <summary className="font-semibold hover:opacity-75">View Details</summary>
                    <pre className="mt-2 p-3 bg-black bg-opacity-10 rounded text-sm overflow-auto">
                        {JSON.stringify(result.details, null, 2)}
                    </pre>
                </details>
            )}
        </div>
    )
}
