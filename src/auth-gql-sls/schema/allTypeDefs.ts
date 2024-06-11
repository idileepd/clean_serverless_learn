import { gql } from "apollo-server-lambda";

export const allTypeDefs = gql`
  scalar JSON
  scalar ID
  scalar PhoneNumber

  type User {
    _id: ID!
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    phoneCountryCode: String!
    userType: String!
    permissions: [String!]! #todo add permissions required here if needed
    active: Boolean!
  }

  # input CreateAdminInput {
  #   firstName: String!
  #   lastName: String!
  #   email: String!
  #   phoneNumber: String!
  #   phoneCountryCode: String!
  #   password: String!
  #   permissions: [String!]!
  # }

  type AuthPayload {
    token: String
    user: User
  }

  type Message {
    message: String!
  }

  # Queries and Mutations
  # type Query {
  #   me: User!
  # }
  type Mutation {
    # createAdmin(input: CreateAdminInput!): GeneralResponse!
    loginWithPassword(email: String!, password: String!): AuthPayload!
    forgotPassword(email: String!): Message!
    resetPassword(token: String!, password: String!): AuthPayload!
  }
`;
