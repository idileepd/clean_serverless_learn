import { gql } from "apollo-server-lambda";

export const commonTypeDef = gql`
  scalar ID
  scalar PhoneNumber
  scalar JSON

  type AuthPayload {
    token: String
    user: User
  }
`;
