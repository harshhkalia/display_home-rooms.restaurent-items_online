import userModel from "../models/Auth.js";
import CustomerNotificationModel from "../models/CustomerNotificationsForHome.js";
import CommentModel from "../models/HomeComments.js";

export const placeComment = async (req, res) => {
  const { userId, selectedHomeId } = req.query;
  const { userName, commentText, addedLinks } = req.body;
  if (!commentText) {
    return res
      .status(400)
      .json({ message: "Please add some text to add the comment!!" });
  }
  if (addedLinks.length > 3) {
    return res
      .status(400)
      .json({ message: "You can't add more then 3 links for one comment!!" });
  }
  try {
    const newComment = new CommentModel({
      userId: userId,
      homeId: selectedHomeId,
      userName: userName,
      commentContent: commentText,
      linksByUser: addedLinks,
    });
    const saveComment = await newComment.save();

    const CustomerNotification = new CustomerNotificationModel({
      userId: userId,
      message: `Your recently added a comment.`,
      type: "comment_added",
    });

    if (saveComment) {
      await CustomerNotification.save();
      return res.status(201).json({
        message: "The comment has been added successfully!",
        comment: saveComment,
      });
    }
  } catch (error) {
    console.error("Failed to add the comment due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to add the comment, please try again!!" });
  }
};

export const fetchHomeComments = async (req, res) => {
  const { homeId } = req.query;
  try {
    const comments = await CommentModel.find({ homeId: homeId });
    if (comments.length > 0) {
      return res.status(200).json({ comments: comments });
    } else {
      return res.status(400).json({ message: "No comments found!" });
    }
  } catch (error) {
    console.error("Failed to find comments for home due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to find comments for homes!!" });
  }
};

export const deleteUserComment = async (req, res) => {
  const { commentId } = req.query;
  try {
    const comment = await CommentModel.findByIdAndDelete(commentId);

    const CustomerNotification = new CustomerNotificationModel({
      userId: comment.userId,
      message: `You removed one of your comments recently`,
      type: "comment_deleted",
    });

    if (comment) {
      await CustomerNotification.save();
      return res
        .status(200)
        .json({ message: "Your comment has been deleted successfully!" });
    } else {
      return res
        .status(400)
        .json({ message: "Failed to delete your comment, please try again!!" });
    }
  } catch (error) {
    console.error("Failed to delete comment due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to delete your comment, please try again!!" });
  }
};

export const editUserComment = async (req, res) => {
  const { commentId } = req.query;
  const { userId, selectedHomeId, userName, commentText, addedLinks } =
    req.body;
  if (!commentText) {
    return res.status(400).json({ message: "Comment text can not be empty!!" });
  }
  if (addedLinks.length > 3) {
    return res
      .status(400)
      .json({ message: "You can't add more then 3 links for one comment!!" });
  }
  try {
    const comment = await CommentModel.findById(commentId);

    const CustomerNotification = new CustomerNotificationModel({
      userId: userId,
      message: `You updated a comment with some new content.`,
      type: "comment_edited",
    });

    if (comment) {
      comment.userId = userId;
      comment.homeId = selectedHomeId;
      comment.userName = userName;
      comment.commentContent = commentText;
      comment.linksByUser = addedLinks;
      const updatedComment = await comment.save();
      if (updatedComment) {
        await CustomerNotification.save();
        return res.status(200).json({
          message: "Your comment has been updated successfully!",
          comment: updatedComment,
        });
      } else {
        return res.status(400).json({
          message: "Failed to update your comment, please try again!!",
        });
      }
    } else {
      return res
        .status(400)
        .json({ message: "Failed to update your comment, please try again!!" });
    }
  } catch (error) {
    console.error("Failed to edit the comment due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to edit the comment, please try again!!" });
  }
};

export const addReplyToComment = async (req, res) => {
  const { commentId } = req.query;
  const { replierId, replyText } = req.body;
  if (!replyText) {
    return res
      .status(400)
      .json({ message: "Please type something in box to send reply." });
  }
  try {
    const comment = await CommentModel.findById(commentId);

    const CustomerNotification = new CustomerNotificationModel({
      userId: replierId,
      message: `You replied to the comment of ${comment.userName}.`,
      type: "reply_to_comment",
    });

    if (comment) {
      comment.replyBy.push(replierId);
      comment.replies.push(replyText);
    }
    const updatedComment = await comment.save();
    if (updatedComment) {
      await CustomerNotification.save();
      return res.status(200).json({
        message: "Your reply has been added to this comment successfully!!",
        comment: updatedComment,
      });
    }
  } catch (error) {
    console.error("Failed to add reply to this comment due to : ", error);
    return res.status(500).json({
      message: "Failed to add reply to this comment, please try again!!",
    });
  }
};

export const fetchCommentForReplies = async (req, res) => {
  const { commentId } = req.query;
  try {
    const comment = await CommentModel.findById(commentId);
    if (comment) {
      return res.status(200).json({ comments: comment });
    }
  } catch (error) {
    console.error(
      "Failed to fetch comments that have replies due to : ",
      error
    );
    return res
      .status(500)
      .json({ message: "Failed to fetch comments that have replies !!" });
  }
};

export const fetchUserNameForComments = async (req, res) => {
  const userIds = req.query.userIds.split(",");

  try {
    const users = await userModel.find({ _id: { $in: userIds } });
    const usernames = users.reduce((acc, user) => {
      acc[user._id] = user.username;
      return acc;
    }, {});
    res.status(200).json({ usernames });
  } catch (error) {
    console.error("Failed to fetch user names due to : ", error);
    return res.status(500).json({ message: "Failed to fetch user names !!" });
  }
};

export const deleteMyReply = async (req, res) => {
  const { commentId, userId } = req.query;

  try {
    const comment = await CommentModel.findById(commentId);

    if (!comment) {
      return res.status(404).json({ message: "Comment not found" });
    }

    const index = comment.replyBy.indexOf(userId);

    const CustomerNotification = new CustomerNotificationModel({
      userId: userId,
      message: `Your reply from a comment has removed.`,
      type: "delete_a_reply",
    });

    if (index !== -1) {
      comment.replyBy.splice(index, 1);

      comment.replies.splice(index, 1);

      const updatedComment = await comment.save();

      await CustomerNotification.save();

      return res.status(200).json({
        message:
          "Your reply has been deleted successfully, if you have other replies on this comment then they will visible shortly!",
        comment: updatedComment,
      });
    } else {
      return res.status(400).json({
        message: "UserId not found in replyBy array",
      });
    }
  } catch (error) {
    console.error("Failed to delete your reply from comment due to : ", error);
    return res.status(500).json({
      message: "Failed to delete your reply from comment, please try again!!",
    });
  }
};

export const replyToQuery = async (req, res) => {
  const { commentId } = req.query;
  const { replyToUserId, replyToText, replyToUserUN } = req.body;
  try {
    const comment = await CommentModel.findById(commentId);
    if (comment) {
      if (comment.replyTo.includes(replyToUserId)) {
        return res.status(400).json({
          message: `You can not send more then 1 reply to ${replyToUserUN}`,
        });
      }

      comment.replyTo.push(replyToUserId);
      comment.replyTextToUser.push(replyToText);
      comment.replyRecieverUsername.push(replyToUserUN);

      const pushSaves = await comment.save();

      const CustomerNotification = new CustomerNotificationModel({
        userId: comment.userId,
        message: `Your replied ${replyToUserUN} from your comment`,
        type: "reply_to_reply",
      });

      if (pushSaves) {
        await CustomerNotification.save();
        return res.status(200).json({
          message: `The reply has been sended to ${replyToUserUN}`,
          comment: pushSaves,
        });
      } else {
        return res
          .status(400)
          .json({ message: "Failed to send the reply of your comment!!" });
      }
    }
  } catch (error) {
    console.error(
      "Failed to send reply of your comment to user due to : ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to send reply of your comment to user, please try again!!",
    });
  }
};

export const fetchMultipleRepliesToUser = async (req, res) => {
  const { myId } = req.query;

  try {
    const replies = await CommentModel.find({ replyTo: { $in: [myId] } });

    if (replies.length > 0) {
      return res.status(200).json({ replies });
    } else {
      return res.status(400).json({
        message: "No replies found for your comments!",
      });
    }
  } catch (error) {
    console.error("Failed to get replies for your comments due to: ", error);
    return res.status(500).json({
      message: "Failed to get replies for your comments, please try again!",
    });
  }
};

export const deleteSelectedCommentFromMyHome = async (req, res) => {
  const { commentId } = req.query;
  try {
    const comment = await CommentModel.findByIdAndDelete(commentId);
    if (comment) {
      return res.status(200).json({
        message:
          "The selected comment has removed from your home page successfully!!",
      });
    } else {
      return res.status(400).json({
        message: "Failed to remove selected comment from your home page.",
      });
    }
  } catch (error) {
    console.error(
      "Failed to remove selected comment from your home page due to : ",
      error
    );
    return res.status(500).json({
      message: "Failed to delete selected comment, please try again!!",
    });
  }
};
