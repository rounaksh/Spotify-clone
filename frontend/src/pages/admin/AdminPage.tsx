import { useAuthStore } from "@/stores/useAuthStore"
import DashboardStats from "./components/DashboardStats"
import Header from "./components/Header"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Library, Music } from "lucide-react"
import SongsTabContent from "./components/SongsTabContent"
import AlbumsTabContent from "./components/AlbumsTabContent"
import { useEffect } from "react"
import { useMusicStore } from "@/stores/useMusicStore"

const AdminPage = () => {
    const { isAdmin, isLoading } = useAuthStore()
    const { fetchAlbums, fetchSongs, fetchStats } = useMusicStore()

    useEffect(() => {
        fetchAlbums()
        fetchSongs()
        fetchStats()
    }, [fetchAlbums, fetchSongs, fetchStats])

    if (!isAdmin && !isLoading) return <div>Unauthorized</div>

    return (
        <div className="min-h-screen bg-gradient-to-b from-zinc-900 via-zinc-900 to-black text-zinc-100 p-8">
            <Header />

            <DashboardStats />

            <Tabs defaultValue="songs" className="space-y-6">
                <TabsList className="p-1 bg-zinc-800/50">
                    <TabsTrigger value="songs" className="data=[state=active]:bg-zinc-700">
                        <Music className="mr-2 size-4" />
                        Songs
                    </TabsTrigger>
                    <TabsTrigger value="Albums" className="data=[state=active]:bg-zinc-700">
                        <Library className="mr-2 size-4" />
                        Albums
                    </TabsTrigger>
                </TabsList>

                <TabsContent value="songs">
                    <SongsTabContent />
                </TabsContent>
                <TabsContent value="Albums">
                    <AlbumsTabContent />
                </TabsContent>
            </Tabs>
        </div>
    )
}

export default AdminPage