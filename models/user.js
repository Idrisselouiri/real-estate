import { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
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
      default:
        "https://www.google.com/url?sa=i&url=https%3A%2F%2Fpixabay.com%2Fvectors%2Fblank-profile-picture-mystery-man-973460%2F&psig=AOvVaw1OXnvpfHVKEt2QD_aftrvC&ust=1716645764575000&source=images&cd=vfe&opi=89978449&ved=0CBIQjRxqFwoTCLiFhfy5poYDFQAAAAAdAAAAABAE",
    },
  },
  { timestamps: true }
);

const User = models?.User || model("User", UserSchema);

export default User;
