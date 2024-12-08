import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { axiosInstance } from "@/lib/axios"
import { LoaderCircle, Plus, Upload } from "lucide-react"
import { useRef, useState } from "react"
import toast from "react-hot-toast"

interface NewAlbum {
    title: string
    artist: string
    releaseYear: number
}

const AddAlbumDialog = () => {
    const [albumDialogOpen, setAlbumDialogOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const imageInputRef = useRef<HTMLInputElement>(null)
    const [newAlbum, setNewAlbum] = useState<NewAlbum>({
        title: '',
        artist: '',
        releaseYear: new Date().getFullYear(),
    })
    const [imageFile, setImageFile] = useState<File | null>(null)

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setImageFile(file)
        }
    }

    const handleSubmit = async () => {
        setIsLoading(true)

        try {
            if (!imageFile) {
                return toast.error('Please upload an image')
            }

            const formData = new FormData()
            formData.append('title', newAlbum.title)
            formData.append('artist', newAlbum.artist)
            formData.append('releaseYear', newAlbum.releaseYear.toString())
            formData.append('imageFile', imageFile)

            await axiosInstance.post('/admin/albums', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                },
            })

            setNewAlbum({
                title: '',
                artist: '',
                releaseYear: new Date().getFullYear(),
            })
            setImageFile(null)
            setAlbumDialogOpen(false)

            toast.success('Album added successfully')
        } catch (error: any) {
            toast.error(`Error adding album: ${error.response.data.message}`)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <Dialog open={albumDialogOpen} onOpenChange={setAlbumDialogOpen}>
            <DialogTrigger asChild>
                <Button className='bg-violet-500 hover:bg-violet-600 text-black'>
                    <Plus className='mr-2 h-4 w-4' />
                    Add Album
                </Button>
            </DialogTrigger>
            <DialogContent className='bg-zinc-900 border-zinc-700 overflow-auto [&::-webkit-scrollbar]:w-1 [&::-webkit-scrollbar-track]:bg-zinc-800 [&::-webkit-scrollbar-thumb]:bg-zinc-700'>
                <DialogHeader>
                    <DialogTitle>Add New Album</DialogTitle>
                    <DialogDescription>Add a new album to your collection</DialogDescription>
                </DialogHeader>
                <div className='space-y-4 py-4'>
                    {/* Image Upload */}
                    <input
                        type='file'
                        ref={imageInputRef}
                        onChange={handleImageSelect}
                        accept='image/*'
                        hidden
                    />
                    <div
                        className='flex items-center justify-center p-6 border-2 border-dashed border-zinc-700 rounded-lg cursor-pointer'
                        onClick={() => imageInputRef.current?.click()}
                    >
                        <div className='text-center'>
                            <div className='text-sm text-zinc-400 mb-2'>
                                {imageFile ? (
                                    <div className="space-y-2">
                                        <img src={URL.createObjectURL(imageFile)} alt="Preview" className="size-20 object-contain mx-auto" />
                                        <div className="text-sm text-zinc-400">
                                            {imageFile.name.slice(0, 20)}
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
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Title */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Album Title</label>
                        <Input
                            value={newAlbum.title}
                            onChange={(e) => setNewAlbum({ ...newAlbum, title: e.target.value })}
                            className='bg-zinc-800 border-zinc-700'
                        />
                    </div>

                    {/* Artist */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Artist Name</label>
                        <Input
                            value={newAlbum.artist}
                            onChange={(e) => setNewAlbum({ ...newAlbum, artist: e.target.value })}
                            className='bg-zinc-800 border-zinc-700'
                        />
                    </div>

                    {/* Release Year */}
                    <div className='space-y-2'>
                        <label className='text-sm font-medium'>Release Year</label>
                        <Input
                            type='number'
                            value={newAlbum.releaseYear}
                            onChange={(e) => setNewAlbum({ ...newAlbum, releaseYear: parseInt(e.target.value) })}
                            className='bg-zinc-800 border-zinc-700'
                            placeholder='Enter release year'
                            min={1900}
                            max={new Date().getFullYear()}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button variant='outline' onClick={() => setAlbumDialogOpen(false)} disabled={isLoading}>
                        Cancel
                    </Button>
                    <Button
                        onClick={handleSubmit}
                        className='bg-violet-500 hover:bg-violet-600'
                        disabled={isLoading || !imageFile || !newAlbum.title || !newAlbum.artist}
                    >
                        {isLoading ? <LoaderCircle className="mx-4 animate-spin" /> : "Add Album"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AddAlbumDialog