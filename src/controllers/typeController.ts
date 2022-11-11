import {Type} from "../models/models";
import {Request, Response} from "express";
import {ApiError} from "../error/ApiError";

class TypeController{
    async create(req: Request, res: Response, next: any){
        const {name} = req.body
        console.log(name);
        try{
            const type = await Type.create({name})
            return res.json(type)
        } catch (e: any) {
            next(ApiError.internal(e.message))
        }

    }
    async getAll(req: Request, res: Response, next: any){
        try{
            const types = await Type.findAll()
            return res.json(types)
        } catch (e: any) {
            next(ApiError.badRequest(e.message))
        }

    }

    async delete(req: Request, res: Response){
        const {id} = req.params
        const type = await Type.destroy({where: {id}})
        return res.json(type)
    }
}
export const typeController = new TypeController()
