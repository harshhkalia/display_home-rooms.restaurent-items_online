import mongoose from "mongoose";

const QueriesSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
      required: true,
    },
    userFullName: {
      type: String,
    },
    userNumber: {
      type: Number,
    },
    userEmail: {
      type: String,
    },
    selectedHomeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "home_info",
      required: true,
    },
    selectedHomeOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
    },
    selectedHomeOwnerName: {
      type: String,
    },
    selectedHomeOwnerNumber: {
      type: Number,
    },
    selectedHomeOwnerEmail: {
      type: String,
    },
    userQuery: {
      type: String,
      required: true,
    },
    homeOwnerReplyToQuery: {
      type: String,
    },
    queryStatus: {
      type: String,
      enum: ["pending", "resolved"],
      default: "pending",
    },
  },
  { timestamps: true }
);

const QueriesModel = mongoose.model("user_queries", QueriesSchema);
export default QueriesModel;
