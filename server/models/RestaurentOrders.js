import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
  {
    customername: {
      type: String,
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
      required: true,
    },
    customernumber: {
      type: Number,
      required: true,
    },
    deliveryaddress: {
      type: String,
      required: true,
    },
    restaurentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurents",
      required: true,
    },
    restaurentname: { type: String, required: true },
    orderedDate: {
      type: Date,
      default: Date.now,
    },
    orderStatus: {
      type: String,
      enum: ["pending", "accepted", "completed", "cancelled"],
      required: true,
      default: "pending",
    },
    itemId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurent_items",
      required: true,
    },
    itemname: {
      type: String,
      required: true,
    },
    itemprice: {
      type: Number,
      required: true,
    },
    itemquantity: {
      type: Number,
      required: true,
    },
    itemdescription: {
      type: String,
      required: true,
    },
    itemimages: {
      type: [String],
      required: true,
    },
    delieverydate: {
      type: Date,
    },
  },
  { timestamps: true }
);

orderSchema.pre("save", function (next) {
  const deliveryDays = 3;
  const orderPlaced = this.orderedDate || new Date();
  this.delieverydate = new Date(
    orderPlaced.getTime() + deliveryDays * 24 * 60 * 60 * 1000
  );
  next();
});

const orderModal = mongoose.model("resItem_orders", orderSchema);
export default orderModal;
