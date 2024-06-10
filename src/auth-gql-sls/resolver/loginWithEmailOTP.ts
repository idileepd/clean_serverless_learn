import bcrypt from "bcryptjs";
import { UserInputError } from "apollo-server-lambda";
import User from "../models/User";
import Session from "../models/Session";

export const initiateEmailAuth = async (
  _parent: any,
  { email }: { email: string }
) => {
  // Check if user exists with the provided email
  const user = await User.findOne({ email });
  if (!user) {
    throw new UserInputError("Invalid credentials");
  }

  // Generate a random 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString();

  // Send the OTP to the user's email
  // await sendEmailOTP(email, otp);

  // Create a session and store it in the database
  const hashedValue = `${email}:${otp}`; // Combine email and OTP
  const session = new Session({ hashedValue });
  await session.save();

  return { sessionId: session._id.toString(), otp };
};

// resolvers/emailAuth.ts
export const verifyEmailAuth = async (
  _parent: any,
  { sessionId, otp, email }: { sessionId: string; otp: string; email: string }
) => {
  // Find the session in the database and compare the provided OTP
  const session = await Session.findById(sessionId);

  if (!session) {
    throw new UserInputError("Invalid session or OTP");
  }

  // Construct the expected hashed value
  const expectedHashedValue = `${email}:${otp}`;

  // Compare the provided OTP with the hashed OTP
  const isMatch = await bcrypt.compare(
    expectedHashedValue,
    session.hashedValue
  );

  // Remove the session from the database anyways
  await Session.findByIdAndDelete(sessionId);

  if (!isMatch) {
    throw new UserInputError("Invalid OTP");
  }

  return { success: true };
};
