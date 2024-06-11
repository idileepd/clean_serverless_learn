import { mergeResolvers, mergeTypeDefs } from "@graphql-tools/merge";
import { makeExecutableSchema } from "@graphql-tools/schema";

import { createUserResolver, createUserTypeDef } from "./createUser";
import { echoResolver, echoTypeDef } from "./echo";
import { otpLoginTypeDef, otpLoginResolver } from "./otpLogin";
import { passwordLoginResolver, passwordLoginTypeDef } from "./passwordLogin";
import { recoveryResolver, recoveryTypeDef } from "./recovery";
import { commonTypeDef } from "./common.schema";
import { merge } from "lodash";

export const getSchema = () => {
  // NOTE: when ever any gql created must be added here
  const allResolvers = [
    echoResolver,
    createUserResolver,
    otpLoginResolver,
    passwordLoginResolver,
    recoveryResolver,
  ];

  const allTypeDefs = [
    commonTypeDef, // Common schema types
    echoTypeDef,
    createUserTypeDef,
    otpLoginTypeDef,
    passwordLoginTypeDef,
    recoveryTypeDef,
  ];

  const resolvers = allResolvers.reduce(
    (acc, resolver) => merge(acc, resolver),
    {}
  );
  const typeDefs = allTypeDefs;

  // const schema = makeExecutableSchema({
  //   typeDefs,
  //   resolvers,
  // });

  return {
    typeDefs,
    resolvers,
  };
};
