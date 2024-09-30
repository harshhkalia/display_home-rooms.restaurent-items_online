import mongoose from "mongoose";

const RestaurentCustNotificationSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    restaurentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurents",
    },
    resturentName: {
      type: String,
    },
    type: {
      type: String,
      enum: [
        "placed_order",
        "completed_order",
        "cancelled_order",
        "updated_order_address",
        "added_to_cart",
        "cart_order_confirmed",
        "removed_from_cart",
        "comment_added",
        "comment_removed",
        "comment_updated",
        "comment_liked",
        "profile_updated",
      ],
    },
    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

const RestaurentCustNotification = mongoose.model(
  "restaurent_cust_notifications",
  RestaurentCustNotificationSchema
);

export default RestaurentCustNotification;
