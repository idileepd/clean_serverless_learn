import { UserInputError } from "apollo-server-lambda";
import User from "../models/User";

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
