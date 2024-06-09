import { ITodo } from "./Todo";

export interface ResolverContext {
  // You can add any context data you need here
}

export interface QueryResolvers {
  getTodos: () => Promise<ITodo[]>;
}

export interface MutationResolvers {
  createTodo: (
    parent: any,
    args: { title: string },
    context: ResolverContext
  ) => Promise<ITodo>;
  deleteTodo: (
    parent: any,
    args: { _id: string },
    context: ResolverContext
  ) => Promise<ITodo | null>;
}

export type Resolvers = {
  Query: QueryResolvers;
  Mutation: MutationResolvers;
};
