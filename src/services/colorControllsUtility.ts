import {IColorScheme} from "./colorScheme"
import {Type} from "../models/models"

function convertRgbToHex(rgb: string) {
    const rgbArr: Array<string> = rgb.split(',')
    const r: number = parseFloat(rgbArr[0]),
        g: number = parseFloat(rgbArr[1]),
        b: number = parseFloat(rgbArr[2])
    const outParts = [
        r.toString(16),
        g.toString(16),
        b.toString(16),
    ]

    outParts.forEach(function (part, i) {
        if (part.length === 1) {
            outParts[i] = '0' + part
        }
    })

    return ('#' + outParts.join(''))
}

function getGenerateLevelColor(min: number, max: number) {
    return Math.floor((Math.random()) * (max - min + 1) + min)
}

function getGenerateColor(color: number[][]) {
    const red = getGenerateLevelColor(color[0][0], color[0][1])
    const green = getGenerateLevelColor(color[1][0], color[1][1])
    const blue = getGenerateLevelColor(color[2][0], color[2][1])
    return red + ', ' + green + ', ' + blue
}

export function getRandomGroupColors(colorScheme: IColorScheme, types: Type[], count: number) {
    const countColors = count - 1
    const colors = []
    let i: number = 0
    let j: number = 0

    do {
        const typeColor = colorScheme[j].typeColor
        const rgb = getGenerateColor(colorScheme[j].rgb)

        let checkUniqueColor = true
        colors.forEach((objectGroupColor) => {
            if (objectGroupColor.rgb === rgb) checkUniqueColor = false
        })

        if (checkUniqueColor) {
            let typeId: number | undefined
            types.forEach((type) => {
                if (type.name === typeColor) {
                    typeId = type.id
                }
            })

            const objectGroupColors = {
                typeId: typeId,
                rgb: rgb,
                hex: convertRgbToHex(rgb)
            }
            colors.push(objectGroupColors)
            i++
            j++
            if (i % 8 === 0) j = 0
        }

    }
    while (i <= countColors)
    return colors
}