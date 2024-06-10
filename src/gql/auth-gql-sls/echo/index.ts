import { me } from "./echo.handler";

export const echoResolver = {
  Query: {
    me,
  },
};

export * from "./echo.schema";
