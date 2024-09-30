import mongoose from "mongoose";

const homeInfoSchema = new mongoose.Schema(
  {
    address: {
      street: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      //   state: {
      //     type: String,
      //     required: true,
      //   },
      zipCode: {
        type: String,
        required: true,
      },
    },
    imagesOfHome: {
      type: [String],
      required: true,
      min: 1,
      max: 4,
    },
    numberOfRooms: {
      type: Number,
      required: true,
    },
    rentPerRoom: {
      type: Number,
      required: true,
    },
    availableRooms: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
    },
    contactInfo: {
      name: {
        type: String,
        required: true,
      },
      number: {
        type: Number,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const HomeInfoModel = mongoose.model("home_info", homeInfoSchema);
export default HomeInfoModel;
