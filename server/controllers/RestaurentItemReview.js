import userModel from "../models/Auth.js";
import reviewModel from "../models/RestaurentItemReviews.js";
import resItemModel from "../models/RestaurentItems.js";
import orderModal from "../models/RestaurentOrders.js";
import RestaurentCustNotification from "../models/RestaurentCust.js";

export const fetchOrderData = async (req, res) => {
  const { orderId } = req.query;
  try {
    const orderFound = await orderModal.findById(orderId);
    if (!orderFound) {
      return res.status(404).json({ message: "Failed to find order details." });
    }
    return res
      .status(200)
      .json({ message: "This order's data is ", orderData: orderFound });
  } catch (error) {
    console.error("Failed to find data of this order due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to find data of this order." });
  }
};

export const addMyReview = async (req, res) => {
  const { orderId } = req.query;
  const { customerId, customerOpinion, restaurentName } = req.body;

  try {
    if (!customerOpinion) {
      return res.status(404).json({
        message:
          "You have to add some text in input box to post a review about item successfully! ",
      });
    }

    const order = await orderModal.findById(orderId);
    const orderItemName = order.itemname;
    const orderItemId = order.itemId;
    const orderItemImages = order.itemimages;
    const orderItemDescription = order.itemdescription;

    const customer = await userModel.findById(customerId);
    const customername = customer.fullname;

    const checkCustomer = await reviewModel.find({
      orderId: orderId,
      customerId: customerId,
    });

    if (checkCustomer.length > 0) {
      return res.status(400).json({
        message: "You already added one review, can not add another one.",
      });
    }

    const newReview = new reviewModel({
      orderId: orderId,
      orderItemId: orderItemId,
      orderItemName: orderItemName,
      orderItemImages: orderItemImages,
      orderItemDes: orderItemDescription,
      orderItemRes: restaurentName,
      reviewText: customerOpinion,
      customerId: customerId,
      customerName: customername,
    });

    const saveReview = await newReview.save();

    const newCustNotification = new RestaurentCustNotification({
      customerId: customerId,
      customerName: customername,
      restaurentId: order.restaurentId,
      resturentName: restaurentName,
      type: "comment_added",
      message: `You recently added a review for ${orderItemName}.`,
    });

    await newCustNotification.save();

    if (saveReview) {
      return res.status(200).json({
        message: "Your review has been added successfully!",
        yourReview: newReview,
      });
    } else {
      return res
        .status(404)
        .json({ message: "Something went wrong while saving the review." });
    }
  } catch (error) {
    console.error("Failed to save your review due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to save your review, please try again" });
  }
};

export const checkMyReview = async (req, res) => {
  const { orderId } = req.query;
  const { customerId } = req.body;
  try {
    const findUser = await reviewModel.find({
      orderId: orderId,
      customerId: customerId,
    });
    if (findUser.length > 0) {
      return res
        .status(200)
        .json({ message: "This user had added one review." });
    } else {
      return res
        .status(404)
        .json({ message: "This user does not have any review." });
    }
  } catch (error) {
    console.error("Failed to check review of this person due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to find review of this person." });
  }
};

export const fetchOUReviews = async (req, res) => {
  const { userId } = req.query;
  const { itemId } = req.body;
  try {
    const reviewsAvailable = await reviewModel.find({
      customerId: { $ne: userId },
      orderItemId: itemId,
    });
    if (reviewsAvailable.length > 0) {
      return res.status(200).json({
        message: "The reviews of all user instead yours has been found.",
        allReviews: reviewsAvailable,
      });
    } else {
      return res
        .status(400)
        .json({ message: "No review founded for this item." });
    }
  } catch (error) {
    console.error("Failed to fetch other users reviews due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch other users reviews." });
  }
};

export const likeAReview = async (req, res) => {
  const { reviewId } = req.query;
  const { userId } = req.body;
  try {
    const review = await reviewModel.findById(reviewId);

    if (!review) {
      return res.status(404).json({ message: "Failed to find the review." });
    }

    if (typeof review.likes !== "number" || isNaN(review.likes)) {
      review.likes = 0;
    }

    if (review.likeperId.includes(userId)) {
      return res.status(400).json({
        message:
          "You already liked this review, can not add multiple likes to one review.",
      });
    }

    review.likeperId.push(userId);
    review.likes += 1;

    const saveMyLike = await review.save();

    const user = await userModel.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "Failed to find the user." });
    }

    const newCustNotification = new RestaurentCustNotification({
      customerId: review.customerId,
      customerName: review.customerName,
      restaurentId: review.restaurentId,
      resturentName: review.resturentName,
      type: "comment_liked",
      message: `${user.fullname} recently liked your review for ${review.orderItemName}.`,
    });

    await newCustNotification.save();

    if (saveMyLike) {
      return res.status(200).json({
        message: "The like has been successfully added!",
        review: saveMyLike,
      });
    } else {
      return res.status(404).json({ message: "Failed to save your like." });
    }
  } catch (error) {
    console.error("Failed to add like to a review due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to add like to a review, please try again." });
  }
};

export const getMyReview = async (req, res) => {
  const { itemId } = req.query;
  const { userId } = req.body;
  try {
    const review = await reviewModel.find({
      orderItemId: itemId,
      customerId: userId,
    });
    if (review.length > 0) {
      return res.status(200).json({
        message: "Your review has been fetched successfully!",
        urReview: review,
      });
    } else {
      return res
        .status(400)
        .json({ message: "You don't have any review for this item." });
    }
  } catch (error) {
    console.error(
      "Failed to fetch your review for selected item due to : ",
      error
    );
    return res
      .status(500)
      .json({ message: "Failed to fetch your review for selected item!" });
  }
};

export const editMyReview = async (req, res) => {
  const { itemId } = req.query;
  const { userId, newTxt } = req.body;
  try {
    const review = await reviewModel.findOne({
      orderItemId: itemId,
      customerId: userId,
    });
    if (!review) {
      return res.status(404).json({ message: "Failed to find your review." });
    }
    review.reviewText = newTxt;
    const saveReview = await review.save();

    const newCustNotification = new RestaurentCustNotification({
      customerId: review.customerId,
      customerName: review.customerName,
      restaurentId: review.restaurentId,
      resturentName: review.resturentName,
      type: "comment_updated",
      message: `You recently updated your review for ${review.orderItemName}.`,
    });

    await newCustNotification.save();

    if (saveReview) {
      return res.status(200).json({
        message: "Your review has been updated successfully!",
        updatedReview: saveReview,
      });
    } else {
      return res.status(404).json({ message: "Failed to update your review." });
    }
  } catch (error) {
    console.error("Failed to edit your review due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to edit your review, please try again." });
  }
};

export const deleteMyReview = async (req, res) => {
  const { itemId, userId } = req.body;
  if (!itemId || !userId) {
    return res
      .status(400)
      .json({ message: "Item ID and User ID are required." });
  }

  try {
    const review = await reviewModel.findOne({
      orderItemId: itemId,
      customerId: userId,
    });
    if (!review) {
      return res
        .status(404)
        .json({ message: "The review you are deleting not found." });
    }
    const deleteReview = await reviewModel.findByIdAndDelete(review._id);

    const newCustNotification = new RestaurentCustNotification({
      customerId: review.customerId,
      customerName: review.customerName,
      restaurentId: review.restaurentId,
      resturentName: review.resturentName,
      type: "comment_removed",
      message: `You recently deleted your review for ${review.orderItemName}.`,
    });

    await newCustNotification.save();

    if (deleteReview) {
      return res
        .status(200)
        .json({ message: "The review has been deleted successfully!" });
    } else {
      return res.status(404).json({ message: "Failed to delete the review." });
    }
  } catch (error) {
    console.error("Failed to delete your review due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to delete your review, please try again." });
  }
};

export const getReviewsNE2ItemAndUser = async (req, res) => {
  const { itemId } = req.query;
  const { userId } = req.body;
  try {
    const item = await resItemModel.findOne({ "items.subItems._id": itemId });
    if (!item) {
      return res.status(404).json({ message: "Item not found!" });
    }

    const reviews = await reviewModel.find({
      orderItemId: { $ne: itemId },
      customerId: { $ne: userId },
    });
    if (reviews.length > 0) {
      const randomeReview = reviews[Math.floor(Math.random() * reviews.length)];
      return res.status(200).json({
        message:
          "The reviews of items that are not yours and not this item has been found.",
        newReview: randomeReview,
      });
    } else {
      return res.status(400).json({
        message:
          "No review founded for items that are not yours and not this item.",
      });
    }
  } catch (error) {
    console.error(
      "Failed to fetch reviews of items that are not yours and not this item due to : ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to fetch reviews of items that are not yours and not this item.",
    });
  }
};

export const fetchAllItemReviews = async (req, res) => {
  const { itemId } = req.query;
  try {
    const reviews = await reviewModel.find({ orderItemId: itemId });
    if (reviews.length > 0) {
      return res.status(200).json({
        message: "The reviews of this item has been fetched successfully!",
        allReviews: reviews,
      });
    } else {
      return res.status(404).json({
        message: "No reviews found for this item.",
      });
    }
  } catch (error) {
    console.error("Failed to fetch reviews of this item due to : ", error);
    return res.status(500).json({
      message: "Failed to fetch reviews of this item.",
    });
  }
};
