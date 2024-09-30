import mongoose from "mongoose";

const RestaurentOwnerNotificationSchema = new mongoose.Schema(
  {
    restOwnerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
      required: true,
    },
    restaurentName: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
    },
    customerName: {
      type: String,
    },
    type: {
      type: String,
      enum: [
        "new_item_added",
        "item_removed",
        "item_updated",
        "accepted_order",
        "restaurent_details_updated",
        "category_item_added",
        "category_item_removed",
      ],
    },
    message: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const RestaurentOwnerNotification = mongoose.model(
  "rest_owner_notifications",
  RestaurentOwnerNotificationSchema
);

export default RestaurentOwnerNotification;
