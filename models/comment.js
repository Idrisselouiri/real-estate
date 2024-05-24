import { Schema, model, models } from "mongoose";

const commentSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    listingId: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    likes: {
      type: Array,
      default: [],
    },
    numberOfLikes: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

const Comment = models?.Comment || model("Comment", commentSchema);

export default Comment;
