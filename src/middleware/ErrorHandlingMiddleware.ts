import {ApiError} from "../error/ApiError"
import {Request, Response} from "express"

export default function (err: any, req: Request, res: Response){
    if(err instanceof ApiError){
        return res.status(err.status).json({message: err.message})
    }
    return err.status
    // return res.status(500).json({message: 'Unexpected error'})

}