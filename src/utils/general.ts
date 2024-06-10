import { AuthenticationError, UserInputError } from "apollo-server-lambda";
import { PhoneNumberUtil } from "google-libphonenumber";
import { GraphQLError, GraphQLFormattedError } from "graphql";

const phoneUtil = PhoneNumberUtil.getInstance();

export const validatePhoneNumber = (
  phoneNumber: string,
  phoneCountryCode: string
) => {
  try {
    const number = phoneUtil.parse(phoneNumber, phoneCountryCode);
    return phoneUtil.isValidNumber(number);
  } catch (error) {
    return false;
  }
};
