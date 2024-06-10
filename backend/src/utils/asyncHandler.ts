import { Request, Response, NextFunction } from "express";

import ErrorClass from "./ErrorClass";

const asyncHandler = (fn) => {
  return (req: Request, res: Response, next: NextFunction) => {
    return fn(req, res, next).catch((error) => {
      return next(new ErrorClass(error.message, error.status || 500));
    });
  };
};

export default asyncHandler;
