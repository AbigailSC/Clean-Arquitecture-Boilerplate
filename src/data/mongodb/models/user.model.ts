import mongoose, { Schema, model } from "mongoose";

const userSchema = new Schema({
  name: {
    type: String,
    required: [true, "Name is required"],
  },
  email: {
    type: String,
    unique: true,
    required: [true, "Email is required"],
  },
  password: {
    type: String,
    required: [true, "Password is required"],
  },
  img: {
    type: String,
  },
  roles: {
    type: [
      {
        type: String,
      },
    ],
    default: ["user"],
    enum: ["admin", "user"],
  },
});

export const UserModel = model("User", userSchema);
