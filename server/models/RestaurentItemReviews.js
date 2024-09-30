import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    orderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "resItem_orders",
      required: true,
    },
    orderItemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurent_items",
      required: true,
    },
    orderItemName: {
      type: String,
      required: true,
    },
    orderItemImages: {
      type: [String],
      required: true,
    },
    orderItemDes: {
      type: String,
      required: true,
    },
    orderItemRes: {
      type: String,
      required: true,
    },
    reviewText: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    customerName: {
      type: String,
      required: true,
    },
    likeperId: {
      type: [mongoose.Schema.Types.ObjectId],
    },
    likes: {
      type: Number,
    },
  },
  { timestamps: true }
);

const reviewModel = mongoose.model("customer_review", reviewSchema);
export default reviewModel;
