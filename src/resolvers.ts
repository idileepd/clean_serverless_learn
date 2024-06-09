import mongoose from "mongoose";
import Todo, { ITodo } from "./Todo";
import { Resolvers, ResolverContext } from "./types";

const db =
  "mongodb+srv://dileep:qwvW9YKn9DxzIKkr@lme-serverless-db.jyxp4ak.mongodb.net/db";

mongoose.connect(db, {
  // useNewUrlParser: true,
  // useUnifiedTopology: true,
});

const resolvers: Resolvers = {
  Query: {
    getTodos: async (): Promise<ITodo[]> => {
      return await Todo.find({});
    },
  },
  Mutation: {
    createTodo: async (
      _: any,
      args: { title: string },
      context: ResolverContext
    ): Promise<ITodo> => {
      const todo = new Todo({ title: args.title, completed: false });
      return await todo.save();
    },
    deleteTodo: async (
      _: any,
      args: { _id: string },
      context: ResolverContext
    ): Promise<ITodo | null> => {
      const deletedTodo = await Todo.findByIdAndDelete(args._id);
      return deletedTodo;
    },
  },
};

export default resolvers;
