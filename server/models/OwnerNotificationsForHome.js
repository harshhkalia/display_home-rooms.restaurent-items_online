import mongoose from "mongoose";

const OwnerNotificationSchema = new mongoose.Schema(
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
      enum: ["query_answered"],
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const OwnerNotificationModel = mongoose.model(
  "owner_notification_home",
  OwnerNotificationSchema
);
export default OwnerNotificationModel;
