import { gql } from "apollo-server-lambda";

export const typeDefs = gql`
  scalar JSON

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

  input CreateAdminInput {
    firstName: String!
    lastName: String!
    email: String!
    phoneNumber: String!
    phoneCountryCode: String!
    password: String!
    permissions: [String!]!
  }

  type AuthPayload {
    token: String
    user: User
  }

  type Mutation {
    createAdmin(input: CreateAdminInput!): GeneralResponse!
    loginWithPassword(email: String!, password: String!): AuthPayload!
    forgotPassword(email: String!): Message!
    resetPassword(token: String!, password: String!): AuthPayload!
  }

  type GeneralResponse {
    success: Boolean
    error: String
    data: JSON
    message: String
  }

  type Message {
    message: String!
  }
  type Query {
    me: User!
  }

  # type User {
  #   id: ID!
  #   firstName: String!
  #   lastName: String!
  #   email: String!
  #   phoneNumber: PhoneNumber!
  #   userType: String!
  #   permissions: [String!]!
  #   active: Boolean!
  # }

  # type PhoneNumber {
  #   countryCode: String!
  #   fullPhoneNumber: String!
  # }

  # type Mutation {
  #   createAdmin(
  #     firstName: String!
  #     lastName: String!
  #     email: String!
  #     phoneNumber: PhoneNumberInput!
  #     password: String!
  #   ): User!
  #   loginWithPassword(email: String!, password: String!): AuthPayload!
  #   forgotPassword(email: String!): String!
  #   resetPassword(token: String!, password: String!): AuthPayload!
  # }

  # input PhoneNumberInput {
  #   countryCode: String!
  #   fullPhoneNumber: String!
  # }
`;
