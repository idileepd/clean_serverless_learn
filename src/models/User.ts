import mongoose, { Document, Schema } from "mongoose";
import validator from "validator";
import { PhoneNumberUtil } from "google-libphonenumber";
import bcrypt from "bcryptjs";
import crypto from "crypto";

const phoneUtil = PhoneNumberUtil.getInstance();

export enum UserType {
  DRIVER = "DRIVER",
  ADMIN = "ADMIN",
  SUPER_ADMIN = "SUPER_ADMIN",
}

export enum Permission {
  NOTIFICATION_ALL = "notification.all",
  COMMAND_ALL = "command.all",
  USER_ALL = "user.all",
  ASSET_ALL = "asset.all",
  NOTIFICATION_LIST = "notifications.list",
  ASSET_LIST = "asset.list",
  ASSET_VIEW = "asset.view",
  ALARM_VIEW = "alarm.view",
  ALARM_LIST = "alarm.list",
  COMMAND_LIST = "command.list",
  COMMAND_EXECUTE = "command.execute",
  USER_VIEW_DRIVER = "user.viewDriver",
  USER_VIEW_ADMIN = "user.viewAdmin",
  USER_VIEW_ALL = "user.viewALL",
  USER_CREATE_DRIVER = "user.createDriver",
  USER_CREATE_ADMIN = "user.createAdmin",
}

export interface IUser extends Document {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber: string;
  phoneCountryCode: string;
  userType: UserType;
  permissions: Permission[];
  password: string;
  active: boolean;
  passwordChangedAt?: Date;
  passwordResetToken?: string;
  passwordResetTokenExpires?: Date;
  correctPassword(
    candidatePassword: string,
    userPassword: string
  ): Promise<boolean>;
  changedPasswordAfter(JWTTimestamp: number): boolean;
  createPasswordResetToken(): string;
}

const userSchema = new Schema<IUser>({
  firstName: {
    type: String,
    required: [true, "First name is required"],
  },
  lastName: {
    type: String,
    required: [true, "Last name is required"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
    index: true,
  },
  phoneNumber: {
    type: String,
    required: [true, "Phone number is required"],
    unique: true,
    index: true,
    validate: {
      validator: function (this: IUser, v: string) {
        try {
          const number = phoneUtil.parse(v, this.phoneCountryCode);
          return phoneUtil.isValidNumber(number);
        } catch (e) {
          return false;
        }
      },
      message: "Please provide a valid phone number",
    },
  },
  phoneCountryCode: {
    type: String,
    required: [true, "Country code is required"],
  },
  userType: {
    type: String,
    enum: Object.values(UserType),
    required: [true, "User type is required"],
  },
  permissions: {
    type: [String],
    enum: Object.values(Permission),
    default: [],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  active: {
    type: Boolean,
    default: true,
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetTokenExpires: Date,
});

// Pre-save middleware to hash the password if it's modified
userSchema.pre("save", async function (this: IUser, next: Function) {
  if (!this.isModified("password")) {
    return next();
  }
  this.password = await bcrypt.hash(this.password, 12);
  console.log("password Hashed in hook !!!", this.password);
  next();
});

// Pre-save middleware to set passwordChangedAt if the password is modified
userSchema.pre("save", function (this: IUser, next: Function) {
  if (!this.isModified("password") || this.isNew) return next();
  this.passwordChangedAt = new Date(Date.now() - 1000);
  next();
});

// Pre-query middleware to filter out inactive users
userSchema.pre(
  /^find/,
  function (this: mongoose.Query<any, any>, next: Function) {
    this.find({ active: { $ne: false } });
    next();
  }
);

// Instance method to check if the provided password is correct
userSchema.methods.correctPassword = async function (
  candidatePassword: string,
  userPassword: string
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// Instance method to check if the password was changed after the JWT was issued
userSchema.methods.changedPasswordAfter = function (
  this: IUser,
  JWTTimestamp: number
) {
  if (this.passwordChangedAt) {
    const changedTimestamp = Math.floor(
      this.passwordChangedAt.getTime() / 1000
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

// Instance method to create a password reset token
userSchema.methods.createPasswordResetToken = function (this: IUser) {
  const resetToken = crypto.randomBytes(32).toString("hex");
  this.passwordResetToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");
  const expireInMinutes = 5;
  this.passwordResetTokenExpires = new Date(
    Date.now() + expireInMinutes * 60 * 1000
  );
  return resetToken;
};

export default mongoose.model<IUser>("User", userSchema, "users");
