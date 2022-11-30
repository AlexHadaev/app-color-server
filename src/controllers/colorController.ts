import {Color, Type} from "../models/models"
import {Request, Response} from "express"
import {ApiError} from "../error/ApiError"
import {sequelize} from "../db"
import {Op, Order} from "sequelize"
import {getRandomGroupColors} from "../services/colorControllsUtility"
import {colorScheme} from "../services/colorScheme"

class ColorController {
    async bulkCreate(req: Request, res: Response, next: any) {
        try {
            const {count} = req.body

            for (let i = 0; i <= colorScheme.length - 1; i++) {
                await Type.findOrCreate({
                    where: {
                        name: colorScheme[i].typeColor
                    },
                    defaults: {
                        name: colorScheme[i].typeColor
                    }
                })
            }

            const types: Type[] = await Type.findAll()

            const randomGroupColors: Array<{}> = getRandomGroupColors(colorScheme, types, count)

            const colors = await Color.bulkCreate(randomGroupColors)

            return res.json(colors)
        } catch (e: any) {
            next(res.json(ApiError.internal(e.message)))
        }


    }

    async create(req: Request, res: Response, next: any) {
        try {
            const {color, shadow, typeId, colorHEXA} = req.body

            const colors = await Color.create({color, shadow, typeId, colorHEXA})

            return res.json(colors)
        } catch (e: any) {
            next(res.json(ApiError.internal(e.message)))
        }
    }

    async getAll(req: Request, res: Response, next: any) {
        try {
            const {typeId, limit, page, query} = req.query

            const pageColors: number = Number(page) || 1
            const limitColors: number = Number(limit) || 12
            const offset: number = pageColors * limitColors - limitColors
            const order: Order | undefined = [['updatedAt', 'DESC']]

            let whereOption: {} = {}
            if (typeId && query) whereOption = {typeId: typeId, hex: {[Op.like]: '%' + query + '%'}}
            else if (query) whereOption = {hex: {[Op.like]: '%' + query + '%'}}
            else if (typeId) whereOption = {typeId}

            const options = whereOption ?
                {where: whereOption, limit: limitColors, offset: offset, order: order} :
                {limit: limitColors, offset: offset, order: order}

            const colors = await Color.findAndCountAll(options)

            const result = colors.count ? colors : ApiError.noResult()

            return res.json(result)
        } catch (e: any) {
            next(res.json(ApiError.badRequest(e.message)))
        }

    }

    async getOne(req: Request, res: Response, next: any) {
        try {
            const {id} = req.params

            const {dataValues}: any = await Color.findOne({where: {id}})
            const {rows} = await Color.findAndCountAll({
                where: {typeId: dataValues.typeId, id: {[Op.ne]: id}},
                order: [['rgb', 'DESC']],
                limit: 5,
            })

            return res.json({...{dataColor: dataValues}, ...{rows: rows}})
        } catch (e: any) {
            next(res.json(ApiError.badRequest(e.message)))
        }

    }

    async getRandom(req: Request, res: Response, next: any) {
        try {
            const {typeId} = req.params

            const options = typeId ?
                {where: {typeId: typeId}, order: sequelize.random(), limit: 1} :
                {order: sequelize.random(), limit: 1}

            const colorId = await Color.findAll(options)

            return res.json(colorId)
        } catch (e: any) {
            next(res.json(ApiError.badRequest(e.message)))
        }

    }

    async delete(req: Request, res: Response, next: any) {
        try {
            const {id} = req.params

            const color: number = await Color.destroy({where: {id}})
            return res.json(color)
        } catch (e: any) {
            next(res.json(ApiError.badRequest(e.message)))
        }
    }
}

export const colorController = new ColorController()