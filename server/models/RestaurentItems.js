import mongoose from "mongoose";

const subItemSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    default: "Not added yet",
  },
  quantity: {
    type: Number,
    required: true,
  },
  subitemImages: {
    type: [String],
    min: 1,
    max: 5,
  },
});

const itemsSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    restaurentId: {
      type: String,
      required: true,
    },
    subItems: [subItemSchema],
  },
  { timestamps: true }
);

const RestaurentItemSchema = new mongoose.Schema(
  {
    restaurentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "restaurents",
      required: true,
    },
    items: [itemsSchema],
  },
  { timestamps: true }
);

const resItemModel = mongoose.model("restaurent_items", RestaurentItemSchema);
export default resItemModel;
