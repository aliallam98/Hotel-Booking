import {Request,Response,NextFunction} from "express"
import { IErrorClass } from "./ErrorClass";





const globalErrorHandling = (error:IErrorClass, req:Request, res:Response, next:NextFunction) => {
  return res
    .status(error.status || 400)
    .json({ success: false, message: error.message, stack: error.stack });
};

export default globalErrorHandling;
