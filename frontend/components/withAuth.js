import { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { isAuthenticated } from '../lib/auth'

export function withAuth(Component) {
    return function AuthenticatedComponent(props) {
        const router = useRouter()
        const [loading, setLoading] = useState(true)

        useEffect(() => {
            if (!isAuthenticated()) {
                router.push('/signin')
            } else {
                setLoading(false)
            }
        }, [router])

        if (loading) {
            return (
                <div className="flex items-center justify-center min-h-screen">
                    <p>Loading...</p>
                </div>
            )
        }

        return <Component {...props} />
    }
}
