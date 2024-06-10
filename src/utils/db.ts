import mongoose from "mongoose";

// TODO: make it cached
export const connectToDatabase = async () => {
  if (mongoose.connection.readyState === 1) return;

  await mongoose.connect(process.env.MONGODB_URI!, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  });
};
