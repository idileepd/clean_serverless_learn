import bcrypt from "bcryptjs";
import crypto from "crypto";
import { createToken } from "../../../utils/auth";
import { UserInputError } from "apollo-server-lambda";
import User from "../../../models/User";

export const forgotPassword = async (_: any, { email }: { email: string }) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new UserInputError("There is no user with that email address.");
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });

  // TODO:: Send the reset token to the user's email
  // You'll need to implement your email sending logic here

  return {
    message: "Token sent to email!,",
    note: "[Note] I am just sending resetToken this to you, remove this later and implement to email",
    resetToken,
  };
};

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
