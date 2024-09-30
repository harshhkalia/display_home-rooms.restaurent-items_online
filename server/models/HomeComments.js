import mongoose from "mongoose";

const HomeCommentsSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
      required: true,
    },
    homeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "home_info",
      required: true,
    },
    userName: {
      type: String,
      required: true,
    },
    commentContent: {
      type: String,
      required: true,
    },
    replies: {
      type: [String],
    },
    replyBy: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user_data",
    },
    replyByUser: {
      type: [String],
    },
    replyTo: {
      type: [mongoose.Schema.Types.ObjectId],
      ref: "user_data",
    },
    replyTextToUser: {
      type: [String],
    },
    replyRecieverUsername: {
      type: [String],
    },
    linksByUser: {
      type: [String],
    },
    commentedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CommentModel = mongoose.model("home_comments", HomeCommentsSchema);
export default CommentModel;
