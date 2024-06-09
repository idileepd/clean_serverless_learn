import User, { IUser } from "./models/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { UserInputError, AuthenticationError } from "apollo-server-errors";
import { createToken } from "./utils/auth";

export const resolvers = {
  Query: {
    me: async (_parent: any, _args: any, context: any) => {
      if (!context.user) {
        throw new AuthenticationError("You are not authenticated!");
      }
      return context.user;
    },
  },
  Mutation: {
    createAdmin: async (_: any, { input }: { input: any }) => {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        phoneCountryCode,
        password,
        permissions,
      } = input;

      // const hashedPassword = await bcrypt.hash(password, 12);

      const user = await User.create({
        firstName,
        lastName,
        email,
        phoneNumber,
        phoneCountryCode,
        userType: "ADMIN",
        permissions,
        password,
      });

      // const token = createToken(user);

      return {
        // token,
        success: true,
        error: null,
        data: user,
        message: "Admin Created Successfully !",
      };
    },

    loginWithPassword: async (
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
    },

    forgotPassword: async (_: any, { email }: { email: string }) => {
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
    },

    resetPassword: async (
      _parent: any,
      { password }: { password: string },
      { token }: { token: string }
    ) => {
      const hashedToken = crypto
        .createHash("sha256")
        .update(token)
        .digest("hex");

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
    },
  },
};
