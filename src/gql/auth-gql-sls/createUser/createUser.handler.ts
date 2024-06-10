import User from "../../../models/User";

export const createAdmin = async (_: any, { input }: { input: any }) => {
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
};
