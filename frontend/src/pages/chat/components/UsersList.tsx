import UsersListSkeleton from "@/components/skeletons/UsersListSkeletons"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { useChatStore } from "@/stores/useChatStore"
import { AvatarFallback, AvatarImage } from "@radix-ui/react-avatar"

const UsersList = () => {
    const { users, selectedUser, isLoading, setSelectedUser, onlineUsers } = useChatStore()
    console.log(users)

    return (
        <div className="border-r border-zinc-800">
            <div className="flex flex-col h-full">
                <ScrollArea className="h-[calc(100vh-280px)]">
                    <div className="spce-y-2 p-4">
                        {isLoading ? (
                            <UsersListSkeleton />
                        ) : (
                            users.map((user) => (
                                <div
                                    key={user._id}
                                    onClick={
                                        () => setSelectedUser(user)
                                    }
                                    className={`flex items-center justify-center lg:justify-start gap-3 p-3 rounded-lg cursor-pointer transition-colors ${selectedUser?.clerkId === user.clerkId ? 'bg-zinc-800' : 'hover:bg-zinc-800/50'}`}
                                >
                                    <div className="relative">
                                        <Avatar className="size-8 md:size-12 ">
                                            <AvatarImage src={user.imageUrl} alt={user.fullName} />
                                            <AvatarFallback>{user.fullName[0]}</AvatarFallback>
                                        </Avatar>
                                        {/* Online Indicator */}
                                        <div className={`absolute bottom-0 right-0 w-3 h-3 rounded-full ring-2 ring-zinc-900 ${onlineUsers.has(user.clerkId) ? 'bg-green-500' : 'bg-zinc-400'}`} />
                                    </div>

                                    <div className="flex-1 min-w-0 lg:block hidden">
                                        <span className="font-medium truncate">
                                            {user.fullName}
                                        </span>
                                        {onlineUsers.has(user.clerkId) ? (
                                            <p className="mt-1 text-xs text-zinc-400">Online</p>
                                        ) : (
                                            <p className="mt-1 text-xs text-zinc-400">Offline</p>
                                        )}
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </ScrollArea>
            </div>
        </div>
    )
}

export default UsersList