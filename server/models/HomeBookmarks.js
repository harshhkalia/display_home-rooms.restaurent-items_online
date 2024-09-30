import mongoose from "mongoose";

const BookMarkSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user_data",
      required: true,
    },
    userFullName: {
      type: String,
      required: true,
    },
    homeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "home_info",
      required: true,
    },
    bookmarkedAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

const HomeBookmarkModel = mongoose.model("bookmarked_homes", BookMarkSchema);
export default HomeBookmarkModel;
