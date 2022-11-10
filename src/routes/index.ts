import {Router} from "express";
import colorRouter from "./colorRouter";
import typeRouter from "./typeRouter";

const router = Router()

router.use('/color', colorRouter)
router.use('/type', typeRouter)

export default router;