import { Schema, model, Types, models, Document } from "mongoose";

export enum Roles {
  User = "user",
  Admin = "admin",
}

export interface IUser extends Document {
  fullName: string;
  email: string;
  isEmailConfirmed: boolean;
  password: string;
  profilePicture: String;
  otpCode: { code: string, expiredDate: Date };
  otpSentNumber: number;
  role: Roles;
  phoneNumber: String;
  address: String;
}

const userSchema = new Schema(
  {
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    isEmailConfirmed: { type: Boolean, default: false },
    password: { type: String, required: true },
    profileImage: String,
    otpCode: { code: String, expireDate: Date },
    otpSentNumber: { code: String, expiredDate: Date },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    phoneNumber: String,
    address: String,
  },
  {
    timestamps: true,
  }
);

const userModel = models?.User || model<IUser>("User", userSchema);

export default userModel;
