import mongoose from "mongoose";

const CustomerNotificationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
      required: true,
    },
    message: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: [
        "bookmark_added",
        "bookmark_removed",
        "query_added",
        "query_owner_respond",
        "query_removed",
        "comment_added",
        "comment_edited",
        "comment_deleted",
        "reply_to_comment",
        "reply_to_reply",
        "delete_a_reply",
        "profile_changed",
      ],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const CustomerNotificationModel = mongoose.model(
  "customer_home_notifications",
  CustomerNotificationSchema
);
export default CustomerNotificationModel;
