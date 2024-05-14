import { Schema, model, models } from "mongoose";

const UserSchema = new Schema({
  name: { type: String },
  email: {
    type: String,
    unique: [true, "Email already exists!"],
    required: [true, "Email is required!"],
  },
  password: {
    type: String,
    required: true,
  },
  image: {
    type: String,
  },
});

const User = models?.User || model("User", UserSchema);

export default User;
