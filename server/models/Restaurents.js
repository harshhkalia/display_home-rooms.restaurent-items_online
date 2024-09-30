import mongoose from "mongoose";

const RestaurentSchema = new mongoose.Schema(
  {
    restaurentname: {
      type: String,
      required: true,
    },
    restaurentlocation: {
      type: String,
      required: true,
    },
    restaurentpfp: {
      type: String,
      required: true,
    },
    restaurentowner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
      required: true,
    },
  },
  { timestamps: true }
);

const restaurentModel = mongoose.model("restaurents", RestaurentSchema);
export default restaurentModel;
