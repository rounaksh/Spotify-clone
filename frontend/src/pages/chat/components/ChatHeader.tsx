import { Avatar, AvatarImage } from "@/components/ui/avatar"
import { useChatStore } from "@/stores/useChatStore"
import { AvatarFallback } from "@radix-ui/react-avatar"

const ChatHeader = () => {
    const { selectedUser, onlineUsers } = useChatStore()

    if (!selectedUser) return null

    return (
        <div className="p-4 border-b border-zinc-800">
            <div className="flex item-center gap-3">
                <Avatar>
                    <AvatarImage src={selectedUser.imageUrl} />
                    <AvatarFallback>{selectedUser.fullName[0]}</AvatarFallback>
                </Avatar>
                <div>
                    <h2 className="font-medium">
                        {selectedUser?.fullName}
                    </h2>
                    <p className="text-sm text-zinc-400">
                        {onlineUsers.has(selectedUser.clerkId) ? 'Online' : 'Offline'}
                    </p>
                </div>
            </div>
        </div>
    )
}

export default ChatHeader