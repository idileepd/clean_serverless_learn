import { gql } from "apollo-server-lambda";

export const echoSchema = gql`
  type Query {
    me: User!
  }
`;
