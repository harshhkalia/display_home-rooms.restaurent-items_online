import RestaurentOwnerNotification from "../models/RestaurentOwner.js";

export const getRestaurentNotifications = async (req, res) => {
  const { restaurentOwnerId, restName } = req.query;
  try {
    const notifications = await RestaurentOwnerNotification.find({
      restOwnerId: restaurentOwnerId,
      restaurentName: restName,
    });
    if (notifications) {
      res.status(200).json({
        success: true,
        message: "Notifications fetched successfully",
        notifications: notifications,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No notifications found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching notifications",
      error: error,
    });
  }
};

export const deleteRestaurentNotification = async (req, res) => {
  const { notificationId } = req.query;
  try {
    const notification = await RestaurentOwnerNotification.findByIdAndDelete(
      notificationId
    );
    if (notification) {
      res.status(200).json({
        success: true,
        message: "The selected notification has been deleted successfully!",
      });
    } else {
      res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting notification",
      error: error,
    });
  }
};
