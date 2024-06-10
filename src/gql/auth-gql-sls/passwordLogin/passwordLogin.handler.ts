import { UserInputError } from "apollo-server-lambda";
import User from "../../../models/User";
import { createToken } from "../../../utils/auth";

export const loginWithPassword = async (
  _: any,
  { email, password }: { email: string; password: string }
) => {
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    throw new UserInputError("Incorrect email or password");
  }

  const token = createToken(user);

  return {
    token,
    user,
  };
};
