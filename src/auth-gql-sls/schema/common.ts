import { gql } from "apollo-server-lambda";

export const CommonTypeDefs = gql`
  scalar JSON

  type GeneralResponse {
    success: Boolean
    error: String
    data: JSON
    message: String
  }
`;
