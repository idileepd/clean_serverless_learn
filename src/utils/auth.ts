import jwt from "jsonwebtoken";
import { IUser } from "../models/User";

interface DecodedToken {
  id: string;
  iat: number;
  exp: number;
}

export const verifyAndDecodeToken = (token: string): DecodedToken => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET!) as DecodedToken;
  } catch (err) {
    throw new Error("Invalid or expired token");
  }
};

export const decodeToken = (token: string): DecodedToken => {
  try {
    return jwt.decode(token) as DecodedToken;
  } catch (err) {
    throw new Error("Invalid token");
  }
};

export const createToken = (user: IUser) => {
  return jwt.sign({ id: user._id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};
