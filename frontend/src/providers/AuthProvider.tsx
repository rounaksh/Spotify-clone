import { axiosInstance } from "@/lib/axios";
import { useAuthStore } from "@/stores/useAuthStore";
import { useChatStore } from "@/stores/useChatStore";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "lucide-react";
import { useEffect, useState } from "react";

const updateApiToken = (token: string | null) => {
    if (token) axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${token}`
    else delete axiosInstance.defaults.headers.common['Authorization']
}
const AuthProvider = ({ children }: { children: React.ReactNode }) => {
    const { getToken, userId } = useAuth();
    const [loading, setLoading] = useState(true)
    const { checkAdminStatus } = useAuthStore()
    const { initializeSocket, disconnectSocket } = useChatStore()

    useEffect(() => {
        const initAuth = async () => {
            try {
                const token = await getToken()
                updateApiToken(token)
                if (token) {
                    await checkAdminStatus()

                    if (userId) initializeSocket(userId)
                }
            } catch (error) {
                updateApiToken(null)
                console.log('Error in AuthProvider', error)
            } finally {
                setLoading(false)
            }
        }

        initAuth()

        return () => disconnectSocket()
    }, [getToken, userId, checkAdminStatus, initializeSocket, disconnectSocket])

    if (loading) return (
        <div className="h-screen w-full flex items-center justify-center">
            <Loader className="animate-spin size-8 text-emerald-500" />
        </div>
    )

    return <>{children}</>
}

export default AuthProvider
