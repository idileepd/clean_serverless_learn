import bcrypt from "bcryptjs";
import crypto from "crypto";
import User from "../models/User";
import { UserInputError } from "apollo-server-lambda";
import { createToken } from "../../utils/auth";

export const resetPassword = async (
  _parent: any,
  { password }: { password: string },
  { token }: { token: string }
) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new UserInputError("Token is invalid or has expired");
  }

  user.password = await bcrypt.hash(password, 12);
  user.passwordResetToken = undefined;
  user.passwordResetTokenExpires = undefined;
  await user.save();

  const newToken = createToken(user);

  return {
    token: newToken,
    user,
  };
};
