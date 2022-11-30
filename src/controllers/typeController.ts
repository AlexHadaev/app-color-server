import {Type} from "../models/models"
import {Request, Response} from "express"
import {ApiError} from "../error/ApiError"

class TypeController {
    async create(req: Request, res: Response, next: any) {
        const {name} = req.body
        try {
            const type = await Type.create({name})
            return res.json(type)
        } catch (e: any) {
            next(res.json(ApiError.internal(e.message)))
        }

    }

    async getAll(req: Request, res: Response, next: any) {
        try {
            const types = await Type.findAll()
            const result = types ? types : ApiError.noResult()
            return res.json(result)
        } catch (e: any) {
            next(res.json(ApiError.badRequest(e.message)))
        }

    }

    async delete(req: Request, res: Response, next: any) {
        try {
            const {id} = req.params
            const type = await Type.destroy({where: {id}})
            return res.json(type)
        } catch (e: any) {
            next(res.json(ApiError.badRequest(e.message)))
        }
    }
}

export const typeController = new TypeController()
