import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { axiosInstance } from "@/lib/axios"
import { useMusicStore } from "@/stores/useMusicStore"
import { LoaderCircle, Plus, Upload } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

interface NewSong {
    title: string
    artist: string
    album: string
    duration: string
}

const AddSongDailog = () => {
    const { albums } = useMusicStore()
    const [songDailongOpen, setSongDailongOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [newSong, setNewSong] = useState<NewSong>({
        title: '',
        artist: '',
        album: '',
        duration: '0',
    })
    const [files, setFiles] = useState<{ audio: File | null, image: File | null }>({
        audio: null,
        image: null,
    })
    const audioInputRef = useRef<HTMLInputElement>(null)
    const imageInputRef = useRef<HTMLInputElement>(null)

    const handleSubmit = async () => {
        setIsLoading(true)

        try {
            if (!files.audio || !files.image) {
                return toast.error('Please upload all files')
            }

            const formData = new FormData()
            formData.append('title', newSong.title)
            formData.append('artist', newSong.artist)
            formData.append('duration', newSong.duration)
            if (newSong.album && newSong.album !== 'none') {
                formData.append('albumId', newSong.album)
            }

            formData.append('audioFile', files.audio)
            formData.append('imageFile', files.image)

            await axiosInstance.post('/admin/song', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            })

            setNewSong({
                title: '',
                artist: '',
                album: '',
                duration: '0,'
            })
            setFiles({
                audio: null,
                image: null,
            })

            toast.success('Song added successfully')
        } catch (error: any) {
            console.log(error.response.data.message)
            toast.error(`Failed to add song: ${error.response.data.message}`)
        } finally {
            setIsLoading(false)
        }
    }


    return (
        <Dialog open={songDailongOpen} onOpenChange={setSongDailongOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-500 hover:bg-emerald-600 text-black">
                    <Plus className="mr-2 w-4 h-4" />
                    Add Song
                </Button>
            </DialogTrigger>

            <DialogContent className="bg-zinc-900 border-zinc-700 max-h-[80vh] overflow-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:bg-zinc-700">
                <DialogHeader>
                    <DialogTitle>Add Song</DialogTitle>
                    <DialogDescription>
                        Add a new song to your library
                    </DialogDescription>
                </DialogHeader>

                <div className="space-y-4 py-4">
                    <input
                        type="file"
                        accept="audio/*"
                        ref={audioInputRef}
                        hidden
                        onChange={(e) => {
                            setFiles(prev => ({ ...prev, audio: e.target.files![0] }))
                        }}
                    />

                    <input
                        type="file"
                        accept="image/*"
                        ref={imageInputRef}
                        hidden
                        onChange={(e) => {
                            setFiles(prev => ({ ...prev, image: e.target.files![0] }))
                        }}
                    />

                    {/* Image Upload */}
                    <div className="flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer" onClick={() => imageInputRef.current?.click()}>
                        <div className="text-center">
                            {files.image ? (
                                <div className="space-y-2">
                                    {/* <div className="text-sm text-emerald-500">
                                        Image selected:
                                    </div> */}
                                    <img src={URL.createObjectURL(files.image)} alt="Preview" className="size-20 object-contain mx-auto" />
                                    <div className="text-sm text-zinc-400">
                                        {files.image.name.slice(0, 20)}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <div className="p-3 bg-zinc-800 rounded-full mb-2 inline-block">
                                        <Upload className="w-6 h-6 text-zinc-400" />
                                    </div>
                                    <div className="text-sm text-zinc-400 mb-2">
                                        Upload Artwork
                                    </div>
                                    {/* <Button variant="outline" size={'sm'} className="text-xs">Upload</Button> */}
                                </>
                            )}
                        </div>
                    </div>

                    {/* Audio Upload */}
                    <div className="space-y-2">
                        <div className="text-sm font-medium">
                            Audio File
                        </div>
                        <div className="flex items-center gap-2">
                            <Button variant={'outline'} onClick={() => audioInputRef.current?.click()} className="w-full">
                                {files.audio ? files.audio.name.slice(0, 20) : 'Upload Audio File'}
                            </Button>
                        </div>
                    </div>

                    {/* Title */}
                    <div className="space-y-2">
                        <label htmlFor="title" className="text-sm font-medium">
                            Title
                        </label>
                        <Input
                            value={newSong.title}
                            onChange={(e) => setNewSong({ ...newSong, title: e.target.value })}
                            className='bg-zinc-800 border-zinc-700'
                        />
                    </div>

                    {/* Artist */}
                    <div className="space-y-2">
                        <label htmlFor="artist" className="text-sm font-medium">
                            Artist
                        </label>
                        <Input
                            value={newSong.artist}
                            onChange={(e) => setNewSong({ ...newSong, artist: e.target.value })}
                            className='bg-zinc-800 border-zinc-700'
                        />
                    </div>

                    {/* Duration */}
                    <div className="space-y-2">
                        <label htmlFor="album" className="text-sm font-medium">
                            Duration (seconds)
                        </label>
                        <Input
                            type="number"
                            min={0}
                            value={newSong.duration}
                            onChange={(e) => setNewSong({ ...newSong, duration: e.target.value || '0' })}
                            className='bg-zinc-800 border-zinc-700'
                        />
                    </div>

                    {/* Album */}
                    <div className="space-y-2">
                        <label htmlFor="album" className="text-sm font-medium">
                            Album (optional)
                        </label>
                        <Select
                            defaultValue="none"
                            value={newSong.album}
                            onValueChange={(value) => setNewSong({ ...newSong, album: value })}>
                            <SelectTrigger className='bg-zinc-800 border-zinc-700'>
                                <SelectValue placeholder="Select Album" defaultValue={"none"} />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="none">No Album</SelectItem>
                                {albums.map((album) => (
                                    <SelectItem key={album._id} value={album._id}>
                                        {album.title}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <DialogFooter>
                    <Button variant={'outline'} onClick={() => setSongDailongOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button onClick={handleSubmit} disabled={isLoading || !files.image || !files.audio || !newSong.title || !newSong.artist || !newSong.duration}>
                        {isLoading ? <LoaderCircle className="mx-4 animate-spin" /> : 'Upload'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddSongDailog