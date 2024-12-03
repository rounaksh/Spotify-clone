import { Router } from "express";
import { protectRoute, requireAdmin } from "../middleware/auth.middleware.js";
import { checkAdmin, createAlbum, createSong, deleteAlbum, deleteSong } from "../controller/admin.controller.js";

const router = Router()

router.use(protectRoute, requireAdmin)

router.get('/check', checkAdmin)

router.post('/song', createSong)
router.delete('/songs/:id', deleteSong)

router.post('/albums', createAlbum)
router.delete('/albums/:id', deleteAlbum)

export default router