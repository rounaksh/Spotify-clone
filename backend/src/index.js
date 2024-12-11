import express from 'express'
import dotenv from 'dotenv'
import { clerkMiddleware } from '@clerk/express'
import fileUpload from 'express-fileupload'
import path from 'path'
import cors from 'cors'
import { createServer } from 'http'
import cron from 'node-cron'
import fs from 'fs'

import { initializeSocket } from './lib/socket.js'

import { connectDB } from './lib/db.js'
import userRoutes from './routes/user.route.js'
import adminRoutes from './routes/admin.route.js'
import authRoutes from './routes/auth.route.js'
import songsRoutes from './routes/song.route.js'
import albumsRoutes from './routes/album.route.js'
import statsRoutes from './routes/stats.route.js'

dotenv.config()

const __dirname = path.resolve()
const app = express()
const PORT = process.env.PORT

const httpServer = createServer(app)
initializeSocket(httpServer)

app.use(
    cors({
        origin: 'http://localhost:3000',
        credentials: true,
    })
)
app.use(express.json())
app.use(clerkMiddleware())
app.use(
    fileUpload({
        useTempFiles: true,
        tempFileDir: path.join(__dirname, 'tmp'),
        createParentPath: true,
        limits: {
            fileSize: 10 * 1024 * 1024 // 10MB max file size
        },
    })
)

// cron jobs to clear temp files after every 1 hour
const tempDir = path.join(process.cwd(), 'tmp')
cron.schedule('0 * * * *', () => {
    if (fs.existsSync(tempDir)) {
        fs.readdir(tempDir, (err, files) => {
            if (err) {
                console.error('Error: ', err)
                return
            }
            for (const file of files) {
                fs.unlink(path.join(tempDir, file), (err) => {
                    if (err) {
                        console.error('Error: ', err)
                        return
                    }
                })
            }
        })
    }
})

app.use('/api/users', userRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/songs', songsRoutes)
app.use('/api/albums', albumsRoutes)
app.use('/api/stats', statsRoutes)

if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, '../frontend/dist')))
    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, '../frontend', 'dist', 'index.html'))
    })
}

// error handler
app.use((err, req, res, next) => {
    res.status(500).json({ message: process.env.NODE_ENV === 'production' ? "Internal server error" : err.message })
})

httpServer.listen(PORT, () => {
    console.log("Server is running on port " + PORT)
    connectDB()
})

