import bcrypt from "bcryptjs";
import { ApolloError, UserInputError } from "apollo-server-lambda";
import Session from "../../../models/Session";
import User from "../../../models/User";
import { validatePhoneNumber } from "../../../utils/general";

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

export const initiatePhoneAuth = async (
  _parent: any,
  {
    phoneNumber,
    phoneCountryCode,
  }: { phoneNumber: string; phoneCountryCode: string }
) => {
  try {
    const isNumberValid = validatePhoneNumber(phoneNumber, phoneCountryCode);
    if (!isNumberValid) {
      throw new UserInputError("Incorrect phoneNumber");
    }

    // Check if user exist with that user
    const user = await User.findOne({ phoneNumber });
    if (!user) {
      throw new UserInputError("Incorrect phoneNumber");
    }

    // Generate a random 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Send the OTP to the user's phone number using AWS SNS
    // ... (same as the previous example)
    // await sendPhoneOTP(phoneNumber, otp);

    // Create a session and store it in the database
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes from now
    const hashedValue = `${phoneNumber}:${otp}`; // Combine phone number and OTP
    const session = new Session({ hashedValue, expiresAt });
    await session.save();

    return { sessionId: session._id.toString(), otp };
  } catch (error) {
    throw new ApolloError("Failed to initiate phone auth", "PHONE_AUTH_FAILED");
  }
};

export const verifyPhoneAuth = async (
  _parent: any,
  {
    sessionId,
    otp,
    phoneNumber,
  }: { sessionId: string; otp: string; phoneNumber: string }
) => {
  try {
    // Find the session in the database
    const session = await Session.findById(sessionId);

    if (!session) {
      throw new ApolloError("Invalid session", "INVALID_SESSION");
    }

    // Construct the expected hashed value
    const expectedHashedValue = `${phoneNumber}:${otp}`;

    // Compare the provided OTP with the hashed OTP
    const isMatch = await bcrypt.compare(
      expectedHashedValue,
      session.hashedValue
    );

    // Remove the session from the database
    await Session.findByIdAndDelete(sessionId);

    if (!isMatch) {
      throw new ApolloError("Invalid OTP", "INVALID_OTP");
      //   throw new UserInputError("Invalid OTP", "INVALID_OTP");
    }

    return { success: true };
  } catch (error) {
    throw new ApolloError("Failed to verify phone auth", "PHONE_AUTH_FAILED");
  }
};
