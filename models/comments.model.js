import { Schema, Types, model } from "mongoose";

const commentSchema = new Schema({
  comment: {
    type: String,
    required: true
  },

  v_id: {
    type: Types.ObjectId,
    ref: "Video",
    required: true
  },

  parent_comment: {
    type: Types.ObjectId,
    ref: "Comment",
    default: null
  },

  replies: [{
    type: Types.ObjectId,
    ref: "Comment"
  }],

  likes: {
    type: Number,
    default: 0
  },

  dislikes: {
    type: Number,
    default: 0
  },

  user: {
    type: Types.ObjectId,
    ref: "User",
    required: true
  }

}, { timestamps: true });

const Comment = model("Comment", commentSchema);
export default Comment;
