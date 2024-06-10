import { Request, Response, NextFunction } from "express";

import userModel, { IUser } from "../DB/models/User.model";
import ErrorClass from "./ErrorClass";
import asyncHandler from "./asyncHandler";

export const isEmailExistsFn = async (email: string) => {
  const isExists : IUser | null = await userModel.findOne({ email });
  return isExists;
};

