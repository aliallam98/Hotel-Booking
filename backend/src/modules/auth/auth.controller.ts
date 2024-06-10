import { Request, Response, NextFunction } from "express";
import asyncHandler from "../../utils/asyncHandler";
import { isEmailExistsFn } from "../../utils/reuseFunctions";
import ErrorClass from "../../utils/ErrorClass";
import userModel from "../../DB/models/User.Model";
import { compare, hash } from "../../utils/hashAndCompare";
import { generateOTPWithExpireDate } from "../../utils/otpGenerator";

export const signup = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let {
      fullName,
      email,
      password,
    }: { fullName: string; email: string; password: string } = req.body;

    //check is email exists before or not
    const isEmailExists = await isEmailExistsFn(email);
    if (isEmailExists)
      return next(new ErrorClass("This Email Already In Use", 409));

    //hash password
    password = hash({ plaintext: password });

    //create
    const newUser = await userModel.create({ fullName, email, password });

    return res.status(201).json({
      success: true,
      message: "user has created successfully",
      results: newUser,
    });
  }
);
const login = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, password }: { email: string; password: string } = req.body;

    const isEmailExists = await isEmailExistsFn(email);

    if (!isEmailExists) {
      return next(new ErrorClass("Email Or Password Is Wrong", 401));
    }

    const isPasswordMatches = compare({
      plaintext: isEmailExists?.password,
      hashValue: password,
    });

    if (!isPasswordMatches) {
      return next(new ErrorClass("Email Or Password Is Wrong", 401));
    }

    const payload = {
      id: isEmailExists._id,
      fullName: isEmailExists.fullName,
      email: isEmailExists.email,
      profilePicture: isEmailExists.profilePicture,
      role: isEmailExists.role,
    };

    //Generate JWT
  }
);

export const logout = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie("App-Name");
    return res.status(200).json({ success: true, message: "logged out" });
  }
);

const checkEmailExistsAndSendOtp = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {}
);

export const checkIsOtpValid = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    const isEmailExists = await isEmailExistsFn(email);
    if (!isEmailExists) {
      return next(new ErrorClass("This email is not registered", 404));
    }

    const dataInMm = isEmailExists.otpCode.expiredDate.getTime();

    const isOtpValid =
      otp !== isEmailExists.otpCode.code && dataInMm < Date.now();

    const message = isOtpValid ? "Valid OTP Code" : "Invalid OTP Code";

    return res
      .status(200)
      .json({ success: isOtpValid, message, results: isOtpValid });
  }
);

export const confirmEmail = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email, otp } = req.body;

    //check email
    const isEmailExists = await isEmailExistsFn(email);
    if (!isEmailExists) {
      return next(new ErrorClass("This email is not registered", 404));
    }

    // check if confirmed before
    if (isEmailExists.isEmailConfirmed) {
      return next(new ErrorClass("Already confirmed", 409));
    }

    //check is otp matches
    if (isEmailExists?.otpCode?.code !== otp) {
      return next(new ErrorClass("Invalid otp", 400));
    }

    //update user data
    const userToUpdate = await userModel.findByIdAndUpdate(
      isEmailExists._id,
      { isEmailConfirmed: true },
      { new: true }
    );
    return res.status(200).json({
      success: true,
      message: "Email confirmed",
      results: userToUpdate,
    });
  }
);

export const changePassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    let { oldPassword, newPassword } = req.body;

    const isOldPasswordMatches = compare({
      plaintext: oldPassword,
      hashValue: req.user.password,
    });

    if (!isOldPasswordMatches) {
      return next(new ErrorClass("password is Wrong", 400));
    }

    if (oldPassword == newPassword) {
      return next(
        new ErrorClass("Cannot change new password to old password", 409)
      );
    }

    newPassword = hash({ plaintext: newPassword });
    await userModel.findByIdAndUpdate(req.user?._id, { password: newPassword });
    return res.status(200).json({ message: "Password Changed" });
  }
);

//ToDo send email
const forgetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;
    //check email
    const isEmailExists = await isEmailExistsFn(email);
    if (!isEmailExists) {
      return next(new ErrorClass("This email is not registered", 404));
    }

    //check is email confirmed
    if (!isEmailExists.isEmailConfirmed) {
      return next(
        new ErrorClass(
          "Email not confirmed check you mail to confirm email",
          400
        )
      );
    }

    // check otp number
    if (
      isEmailExists.otpSentNumber >=
      parseInt(process.env.MAX_OTP_NUMBER as string)
    ) {
      return next(new ErrorClass("Already sent check your mail", 403));
    }

    //generate otp
    const otp = generateOTPWithExpireDate(5);

    // send email

    //update otp and otp numbers
    await userModel.findByIdAndUpdate(isEmailExists._id, {
      $inc: { otpSendNumber: 1 },
      otpCode: otp,
    });
  }
);

const resetPassword = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    //check email
    const isEmailExists = await isEmailExistsFn(email);
    if (!isEmailExists) {
      return next(new ErrorClass("This email is not registered", 404));
    }

    //check is email confirmed
    if (!isEmailExists.isEmailConfirmed) {
      return next(
        new ErrorClass(
          "Email not confirmed check you mail to confirm email",
          400
        )
      );
    }

    // check otp number
    if (
      isEmailExists.otpSentNumber >=
      parseInt(process.env.MAX_OTP_NUMBER as string)
    ) {
      return next(new ErrorClass("Already sent check your mail", 403));
    }

    // send email

    //update otp and otp numbers
    const user;
  }
);
