import { usePlayerStore } from "@/stores/usePlayerStore"
import { useEffect, useRef } from "react"

const AudioPlayer = () => {
    const audioRef = useRef<HTMLAudioElement | null>(null)
    const prevSongRef = useRef<string | null>(null)

    const { currentSong, playNext, isPlaying } = usePlayerStore()

    // Pause / Play login
    useEffect(() => {
        if (isPlaying) audioRef.current?.play()
        else audioRef.current?.pause()
    }, [isPlaying])

    // Auto Play next song
    useEffect(() => {
        const audio = audioRef.current

        const handleEnded = () => playNext()

        audio?.addEventListener('ended', handleEnded)

        return () => audio?.removeEventListener('ended', handleEnded)
    }, [playNext])

    // handle song changes
    useEffect(() => {
        if (!audioRef.current || !currentSong) return

        const audio = audioRef.current

        // check if new song start from beginning else resume
        const isSongChanged = prevSongRef.current !== currentSong?.audioUrl
        if (isSongChanged) {
            audio.src = currentSong?.audioUrl
            // reset playback
            audio.currentTime = 0
            prevSongRef.current = currentSong?.audioUrl

            if (isPlaying) audio.play()
        }
    }, [currentSong, isPlaying])

    return <audio ref={audioRef} />
}

export default AudioPlayer