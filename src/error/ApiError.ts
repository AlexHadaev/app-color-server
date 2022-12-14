export class ApiError{
    constructor(
        public status: number,
        public message: string
    ){}

    static badRequest(message: string){
        return new ApiError(404, message)
    }
    static noResult(){
        return new ApiError(200,  'no result')
    }
    static internal(message: string){
        return new ApiError(500, message)
    }
    static forbidden(message: string){
        return new ApiError(403, message)
    }
}

