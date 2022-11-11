import {Color, Type} from "../models/models";
import {Request, Response} from "express";
import {ApiError} from "../error/ApiError";
import {sequelize} from "../db";
import {Op} from "sequelize";

function addItem(items: Array<{}>, typeColor: number, r: number, g: number, b: number, alpha: number, shadow:boolean) {
    let j = 5
    let count = shadow? 9 : 5
    if(typeColor === 9){
        j = count - 1
    }
    while (j <= count) {
        j++;
        let sh: number = shadow? j / 10 : alpha;
        let outParts: Array<string> = [
            r.toString(16),
            g.toString(16),
            b.toString(16),
            Math.round(sh * 255).toString(16).substring(0, 2)
        ];

        // Pad single-digit output values
        outParts.forEach(function (part, i) {
            if (part.length === 1) {
                outParts[i] = '0' + part;
            }
        })
        items.push({
            color: r + ', ' + g + ', ' + b + ', ' + sh,
            typeId: typeColor,
            shadow: r + ', ' + g + ', ' + b,
            colorHEXA: '#' + outParts.join('').toUpperCase()
        })
    }
    return items
}

class ColorController {
    async bulkCreate(req: Request, res: Response, next: any) {
        try {
            let {count, shadow} = req.body //generate = count color
            let colors: string[] = [];
            let i: number = 1;
            let length: number = parseInt(count);

            do {
                const red: number = Math.floor((Math.random()) * 256 / 2);
                const green: number = Math.floor((Math.random()) * 256 / 2);
                const blue: number = Math.floor((Math.random()) * 256 / 2);
                const a: number = (Math.floor(Math.random() * 10) + 1) / 10

                let color: string = red + ', ' + green + ', ' + blue + ',' + a;

                colors.push(color);
                colors = [...new Set(colors)];
                length = length + colors.length - i
                i++;
            }
            while (i <= length);


            const items: Array<{}> = [];

            enum typeColor {
                red = 1, green = 2,
                blue = 3, yellow = 4,
                orange = 5, grey = 6,
                purple = 7, brown = 8,
                dark = 9, light = 10
            }

            for (let i = 1; i <= 10; i++){
                await Type.findOrCreate({
                    where: {
                        name: typeColor[i]
                    },
                    defaults: {
                        name: typeColor[i]
                    }
                });
            }

            colors.forEach((item, index) => {

                let rgb = item.split(',')
                let r = parseInt(rgb[0]);
                let g = parseInt(rgb[1]);
                let b = parseInt(rgb[2]);
                let alpha = parseFloat(rgb[3]);

                if ( r > 140 && r >= (g + 30) && g > (b + 30)) {
                    addItem(items, typeColor.orange, r, g, b, alpha, shadow)
                } else if (r >= (g - 40) && g > (b + 40)) {
                    addItem(items, typeColor.yellow, r, g, b, alpha, shadow)
                } else if ((r <= g + 10 || r <= g - 10) && (g <= b + 10 || g <= b - 10) && (b <= r + 10 || b <= r - 10)) {
                    addItem(items, typeColor.grey, r, g, b, alpha, shadow)
                } else if (r > 205 && g > 205 && b > 205) {
                    addItem(items, typeColor.light, r, g, b, alpha, shadow)
                } else if (r < 50 && g < 50 && b < 50) {
                    addItem(items, typeColor.dark, r, g, b, alpha, shadow)
                } else if (r > g && g > b) {
                    addItem(items, typeColor.brown, r, g, b, alpha, shadow)
                } else if (r > (g + 10) && b > (g + 10)) {
                    addItem(items, typeColor.purple, r, g, b, alpha, shadow)
                } else if (r > b && r > g) {
                    addItem(items, typeColor.red, r, g, b, alpha, shadow)
                } else if (g > b && g > r) {
                    addItem(items, typeColor.green, r, g, b, alpha, shadow)
                } else if (b > r && b > g) {
                    addItem(items, typeColor.blue, r, g, b, alpha, shadow)
                }

            })
            const colorsGenerate = await Color.bulkCreate(items)

            return res.json(colorsGenerate)
        } catch (e: any) {
            next(ApiError.badRequest(e.message))
        }


    }

    async create(req: Request, res: Response, next: any) {
        try {
            let {color, shadow, typeId, colorHEXA} = req.body

            const colors = await Color.create({color, shadow, typeId, colorHEXA})

            return res.json(colors)
        } catch (e: any) {
            next(ApiError.badRequest(e.message))
        }


    }

    async getAll(req: Request, res: Response, next: any) {
        try {
            let typeId: any, limit: any, page: any, random: any, query: any;
            ({typeId, limit, page, random, query} = req.query);
            page = page || 1
            limit = limit || 12

            let offset: number = page * limit - limit
            let colors;

            if (random) {
                limit = parseInt(random) || 12
                colors = await Color.findAndCountAll({limit, offset, order: sequelize.random()})
            }
            if (!random && !typeId && !query) {
                colors = await Color.findAndCountAll({limit, offset})
            }
            if (!random && typeId) {
                colors = await Color.findAndCountAll({where: {typeId}, limit, offset})
            }
            if (random && typeId) {
                limit = parseInt(random) || 12
                colors = await Color.findAndCountAll({where: {typeId}, limit, offset, order: sequelize.random()})
            }
            if (!random && !typeId && query) {
                colors = await Color.findAndCountAll({
                    where: {
                        colorHEXA: {
                            [Op.like]: '%' + query + '%'
                        }
                    }, limit, offset
                })
            }
            if (!random && typeId && query) {
                colors = await Color.findAndCountAll({
                    where: {
                        typeId: typeId,
                        colorHEXA: {
                            [Op.like]: '%' + query + '%'
                        }
                    }, limit, offset
                })
            }

            return res.json(colors)
        } catch (e: any) {
            next(ApiError.badRequest(e.message))
        }

    }

    async getOne(req: Request, res: Response, next: any) {
        try {
            const {id} = req.params
            const {shadows} = req.query
            let color;
            if (!shadows) {
                color = await Color.findOne(
                    {
                        where: {id}
                    }
                )
            }
            if(shadows) {
                color = await Color.findOne(
                    {
                        where: {id}
                    }
                ).then((item: any) => {
                    return Color.findAndCountAll({
                        where: {shadow: item.shadow},
                        order: [['colorHEXA', 'DESC']],
                        limit: Number(shadows),

                        // order: sequelize.random()
                    })
                })
            }

            return res.json(color)
        } catch (e: any) {
            next(ApiError.badRequest(e.message))
        }

    }

    async delete(req: Request, res: Response, next: any) {
        try {
            const {id} = req.params

            const color: number = await Color.destroy({where: {id}})
            return res.json(color)
        } catch (e: any) {
            next(ApiError.badRequest(e.message))
        }

    }

}

export const colorController = new ColorController()