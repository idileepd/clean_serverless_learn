import { gql } from "apollo-server-lambda";

const typeDefs = gql`
  type Todo {
    _id: ID!
    title: String!
    completed: Boolean!
  }

  type Query {
    getTodos: [Todo]
  }

  type Mutation {
    createTodo(title: String!): Todo
    deleteTodo(_id: ID!): Todo
  }
`;

export default typeDefs;
