import {Router} from "express"
import {colorController} from "../controllers/colorController"
const router = Router()

router.post('/', colorController.create)
router.post('/generate', colorController.bulkCreate)
router.get('/', colorController.getAll)
router.get('/random', colorController.getRandom)
router.get('/:id', colorController.getOne)
router.delete('/:id', colorController.delete)

export default router