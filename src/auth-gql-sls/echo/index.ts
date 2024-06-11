import { getMyData } from "./echo.handler";

export const echoResolver = {
  Query: {
    me: getMyData,
  },
};

export * from "./echo.schema";
