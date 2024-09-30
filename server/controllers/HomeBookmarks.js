import CustomerNotificationModel from "../models/CustomerNotificationsForHome.js";
import HomeBookmarkModel from "../models/HomeBookmarks.js";

export const placeHomeInBookmark = async (req, res) => {
  const { userId } = req.query;
  const { userFullName, homeId } = req.body;
  try {
    const checkDoubleBookmarks = await HomeBookmarkModel.find({
      userId: userId,
      homeId: homeId,
    });

    if (checkDoubleBookmarks.length > 0) {
      return res
        .status(400)
        .json({ message: "The home is already added in bookmarks!" });
    }

    const newBookmark = new HomeBookmarkModel({
      userId: userId,
      userFullName: userFullName,
      homeId: homeId,
    });
    const savedBookmark = await newBookmark.save();

    const CustomerNotification = new CustomerNotificationModel({
      userId: userId,
      message: `You added a new location in your bookmarks.`,
      type: "bookmark_added",
    });

    if (savedBookmark) {
      await CustomerNotification.save();
      return res.status(200).json({
        message: "The home has been added to bookmark successfully!",
        home: savedBookmark,
      });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to add home into your bookmark!" });
    }
  } catch (error) {
    console.error("Failed to add home into your bookmarks due to : ", error);
    return res.status(500).json({
      message: "Failed to add home into your bookmarks, please try again!",
    });
  }
};

export const removeHomeFromBookmark = async (req, res) => {
  const { userId, homeId } = req.query;
  try {
    const deleteBookmark = await HomeBookmarkModel.findOneAndDelete({
      userId: userId,
      homeId: homeId,
    });

    const CustomerNotification = new CustomerNotificationModel({
      userId: userId,
      message: "You removed a location from your bookmarks.",
      type: "bookmark_removed",
    });

    if (deleteBookmark) {
      await CustomerNotification.save();
      return res.status(200).json({
        message: "The home has been removed from bookmark successfully!",
      });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to remove home from your bookmark!" });
    }
  } catch (error) {
    console.error("Failed to remove home from your bookmarks due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to remove home from bookmark!" });
  }
};

export const checkforbookmarkedhome = async (req, res) => {
  const { userId, homeId } = req.query;
  try {
    const isBookmarked = await HomeBookmarkModel.find({
      userId: userId,
      homeId: homeId,
    });
    if (isBookmarked.length > 0) {
      return res.status(200).json({ isBookmarked: true });
    } else {
      return res.status(200).json({ isBookmarked: false });
    }
  } catch (error) {
    console.error("Failed to check for your bookmarks due to : ", error);
    return res.status(500).json({
      message: "Failed to check for your bookmarks due to an unexpected error!",
    });
  }
};

export const totalNoOfBookmarks = async (req, res) => {
  const { userId } = req.query;
  try {
    const noOfBookmarks = await HomeBookmarkModel.find({
      userId: userId,
    }).populate({
      path: "homeId",
      model: "home_info",
      select:
        "address imagesOfHome numberOfRooms rentPerRoom availableRooms description contactInfo",
    });
    if (noOfBookmarks.length > 0) {
      return res.status(200).json({ yourBookmarks: noOfBookmarks });
    } else {
      return res
        .status(400)
        .json({ message: "No bookmark has been founded on your account." });
    }
  } catch (error) {
    console.error(
      "Failed to get total number of bookmarks to your account due to : ",
      error
    );
    return res.status(500).json({
      message: "Failed to get total number of bookmarks to your account!!",
    });
  }
};
