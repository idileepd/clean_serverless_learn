import mongoose, { Schema, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface ISession extends Document {
  _id: string;
  hashedValue: string;
  expiresAt: Date;
}

const expiryInSeconds = 5 * 60; //5 Minutes
const sessionSchema = new Schema<ISession>({
  hashedValue: { type: String, required: true, unique: true }, // Combination of phoneNumber:otp
  expiresAt: { type: Date, required: true, expires: expiryInSeconds }, //Default: Expire session after 5 minutes
});

// Pre-save hook to hash the phone number and OTP
sessionSchema.pre("save", async function (next) {
  if (this.isModified("hashedValue")) {
    this.hashedValue = await bcrypt.hash(this.hashedValue, 10);
  }
  next();
});

const Session = mongoose.model<ISession>("Session", sessionSchema);

export default Session;
