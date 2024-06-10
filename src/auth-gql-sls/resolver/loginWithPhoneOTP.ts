import bcrypt from "bcryptjs";
import { ApolloError, UserInputError } from "apollo-server-lambda";
import Session from "../models/Session";
import User from "../models/User";
import { validatePhoneNumber } from "../../utils/general";

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
    console.log("Otp sent", otp);
    // Send the OTP to the user's phone number using AWS SNS
    // ... (same as the previous example)

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

    if (!isMatch) {
      throw new ApolloError("Invalid OTP", "INVALID_OTP");
      //   throw new UserInputError("Invalid OTP", "INVALID_OTP");
    }

    // Find or create the user
    // ... (same as the previous example)

    // Remove the session from the database
    await Session.findByIdAndDelete(sessionId);

    return { success: true };
  } catch (error) {
    throw new ApolloError("Failed to verify phone auth", "PHONE_AUTH_FAILED");
  }
};
