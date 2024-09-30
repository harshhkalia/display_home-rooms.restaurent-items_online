import mongoose from "mongoose";

const RestItemATC = mongoose.Schema({
  itemId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurent_items",
    required: true,
  },
  restaurentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "restaurents",
    required: true,
  },
  customerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "user_data",
    required: true,
  },
  customerName: {
    type: String,
    required: true,
  },
  restaurentName: {
    type: String,
    required: true,
  },
  itemName: {
    type: String,
    required: true,
  },
  itemPrice: {
    type: Number,
    required: true,
  },
  itemQuantity: {
    type: Number,
    required: true,
  },
  itemImages: {
    type: [String],
    required: true,
  },
  itemDescription: {
    type: String,
    required: true,
  },
});

const restItemATCModel = mongoose.model("rest_item_atc", RestItemATC);
export default restItemATCModel;
