import { IResponse } from "../interface/success.interface"


export const successResponse = ({res, message = "Done", status = 200, data}:IResponse)=>{
    res.status(status).json({message, data})
}