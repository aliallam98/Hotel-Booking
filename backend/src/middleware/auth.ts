import { NextFunction, Request, Response } from "express";
import userModel, { IUser } from "../DB/models/User.Model.js";

import ErrorClass from "../utils/ErrorClass.js";


declare global {
  namespace Express {
    interface Request {
      user:IUser
    }
  }
}

const auth = (roles = []) => {
  return async (req:Request, res:Response, next:NextFunction) => {
    try {
      const token = req.cookies["hotel-jwt"];

      if (!token) {
        return next(new ErrorClass("Authorization Is Required", 401));
      }

      const decoded = verifyToken({ token });

      if (!decoded?.id) {
        return next(new ErrorClass("Invalid Payload Data", 401));
      }

      const user = await userModel.findById(decoded.id);

      if (!user) {
        return next(new ErrorClass("Not Registered Account", 404));
      }

      if (roles.length && !roles.includes(user.roles)) {
        return next(new ErrorClass("You are Unauthorized", 401));
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(400).json({
        success: false,
        message: "Catch Error",
        error: error?.message,
      });
    }
  };
};


export default auth