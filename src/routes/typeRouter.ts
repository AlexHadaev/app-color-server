import {Router} from "express";
import {typeController} from "../controllers/typeController"
const router = Router()

router.post('/', typeController.create)
router.get('/', typeController.getAll)
router.delete('/:id', typeController.delete)


export default router;