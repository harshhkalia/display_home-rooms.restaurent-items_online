import React, { useState, useEffect } from "react";
import CusHomePageNav from "../navbarsAndFooters/CusHomePageNav";
import CusHomePageSB from "../resOwnPageEl/CusHomePageSB";
import { json, useNavigate } from "react-router-dom";
import "./CusHomePageforHome.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faComment,
  faCopy,
  faEnvelope,
  faMinus,
  faEye,
  faPaperPlane,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function CusHomePageForHomes() {
  const [selectedHomeData, setSelectedHomeData] = useState({});
  const [publicComments, setPublicComments] = useState([]);
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [userData, setUserData] = useState({});
  const [uploadQueriesModal, setUploadQueriesModal] = useState(false);
  const [queryUserFullName, setQueryUserFullName] = useState("");
  const [queryUserNumber, setQueryUserNumber] = useState("");
  const [queryUserEmail, setQueryUserEmail] = useState("");
  const [queryUserText, setQueryUserText] = useState("");
  const [existingQuery, setExistingQuery] = useState(false);
  const [specificQuery, setSpecificQuery] = useState({});
  const [showQuery, setShowQuery] = useState(false);
  const [PCmodal, setPCmodal] = useState(false);
  const [linksArray, setlinksArray] = useState("");
  const [commentText, setCommentText] = useState("");
  const [commentLM, setCommentLM] = useState(false);
  const [commentLinks, setCommentLinks] = useState({});
  const [ECmodal, setECmodal] = useState(false);
  const [selectedCommentTE, setSelectedCommentTE] = useState({});
  const [newCommentText, setNewCommentText] = useState("");
  const [newCommentLinks, setNewCommentLinks] = useState("");
  const [RCmodal, setRCmodal] = useState(false);
  const [SCTEdata, setSCTEdata] = useState({});
  const [mentionedCommentText, setMentionedCommentText] = useState("");
  const [nonUserCLmodal, setNonUserCLmodal] = useState(false);
  const [nonUserCommentLinks, setNonUserCommentLinks] = useState("");
  const [SCARmodal, setSCARmodal] = useState(false);
  const [selectedCommentForSCAR, setSelectedCommentForSCAR] = useState(null);
  const [SCARdata, setSCARdata] = useState({});
  const [replyTexts, setReplyTexts] = useState({});
  const [commentRepliesModal, setCommentRepliesModal] = useState(false);
  const [commentReplies, setCommentReplies] = useState([]);
  const [homeBookmarksModal, setHomeBookmarksModal] = useState(false);
  const [fetchedBookmarks, setFetchedBookmarks] = useState([]);
  const [editUserProfileModal, setEditUserProfileModal] = useState(false);
  const [EUPuserFullname, setEUPuserFullname] = useState("");
  const [EUPuserUsername, setEUPuserUsername] = useState("");
  const [EUPuserPassword, setEUPuserPassword] = useState("");
  const [userQueriesModal, setUserQueriesModal] = useState(false);
  const [userQueries, setUserQueries] = useState([]);
  const [notifcationModal, setNotificationModal] = useState(false);
  const [userNotifications, setUserNofications] = useState([]);

  const navigate = useNavigate();

  const handleCommentRepliesModal = () => {
    setCommentRepliesModal(true);
    handleFetchCommentReplies();
  };

  const handleFBmodal = () => {
    setHomeBookmarksModal(true);
    handleFetchBookmarks();
  };

  const handleEUPmodal = () => {
    setEditUserProfileModal(true);
    fetchUserData();
  };

  const handlePreviousPageNav = () => {
    navigate("/viewallvillas");
    localStorage.removeItem("selectedHomeData");
  };

  const handleShowRestSelPage = () => {
    navigate("/viewallrestaurents");
    localStorage.removeItem("selectedHomeData");
  };

  useEffect(() => {
    const fetchHomeData = () => {
      const homeDetails = JSON.parse(localStorage.getItem("selectedHomeData"));
      if (homeDetails) {
        setSelectedHomeData(homeDetails);
      }
    };
    fetchHomeData();
  }, []);

  const fetchUserData = () => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserData(user);
      setEUPuserFullname(user.fullname);
      setEUPuserUsername(user.username);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

  const handleCopyMobileNumber = () => {
    navigator.clipboard.writeText(selectedHomeData.contactInfo?.number);
    window.alert(
      "The number " +
        selectedHomeData.contactInfo?.number +
        " has been copied to clipboard!"
    );
  };

  const handleEmailThisUser = () => {
    const receiverEmail = `${selectedHomeData.contactInfo?.email}`;
    const subject = "Enter subject";
    const body = `What you want to mail to ${selectedHomeData.contactInfo?.name} ?`;

    const mailToLink = `mailto:${receiverEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${body}`;

    window.open(mailToLink, "_blank");
  };

  const check4HBs = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}checkingbookmarks?userId=${userData?._id}&homeId=${selectedHomeData?._id}`
      );
      if (response.status === 200) {
        setIsBookmarked(response.data.isBookmarked);
      } else {
        setIsBookmarked(false);
      }
    } catch (error) {
      console.error("Failed to check for your bookmarks due to: ", error);
      setIsBookmarked(false);
    }
  };

  useEffect(() => {
    check4HBs();
  }, [selectedHomeData]);

  const handleRemoveBookmarkedHome = async () => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}removebookmark?userId=${userData?._id}&homeId=${selectedHomeData?._id}`
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setIsBookmarked(false);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error(
          "Failed to remove this home from bookmark due to : ",
          error
        );
        window.alert(
          "Failed to remove this home from bookmark, please try again!!"
        );
      }
    }
  };

  const handleDeleteBookmarkFromBMContainer = async (bookmarkHomeId) => {
    const confirmation = window.confirm(
      "Do you want to remove this bookmark from your account ?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}removebookmark?userId=${userData?._id}&homeId=${bookmarkHomeId}`
        );
        if (response.status === 200) {
          window.alert(response.data.message);
          setFetchedBookmarks((prevBookmarks) =>
            prevBookmarks.filter(
              (bookmark) => bookmark.homeId._id !== bookmarkHomeId
            )
          );
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          window.alert(error.response.data.message);
        } else {
          console.error(
            "Failed to remove this bookmark from your account due to : ",
            error
          );
          window.alert(
            "Failed to remove this bookmark from your account, please try again!!"
          );
        }
      }
    }
  };

  const handleAddToBookmark = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}placemybookmark?userId=${userData?._id}`,
        {
          userFullName: userData.fullname,
          homeId: selectedHomeData?._id,
        }
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setIsBookmarked(true);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to add this home into bookmark due to : ", error);
        window.alert(
          "Failed to add this home into bookmark, please try again!!"
        );
      }
    }
  };

  const handleShowQueriesUploadModal = () => {
    setUploadQueriesModal(true);
  };

  const handleCloseQueriesModal = () => {
    setUploadQueriesModal(false);
    setQueryUserText("");
    setQueryUserEmail("");
    setQueryUserFullName("");
    setQueryUserNumber("");
  };

  useEffect(() => {
    const checkEQ = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}checkingqueries?userId=${userData?._id}&selectedHomeId=${selectedHomeData?._id}`
        );
        if (response.status === 200) {
          setExistingQuery(response.data.existingQuery);
        } else {
          setExistingQuery(false);
        }
      } catch (error) {
        console.error(
          "Failed to fetch details for your existing queries due to : ",
          error
        );
      }
    };
    checkEQ();
  }, [selectedHomeData]);

  const handleSendMyQuery = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}sendmyquery?selectedHomeId=${selectedHomeData?._id}`,
        {
          userId: userData?._id,
          userFullName: queryUserFullName,
          userNumber: queryUserNumber,
          userEmail: queryUserEmail,
          userQueryText: queryUserText,
        }
      );
      if (response.status === 201) {
        setExistingQuery(true);
        setQueryUserText("");
        setQueryUserEmail("");
        setQueryUserFullName("");
        setQueryUserNumber("");
        setUploadQueriesModal(false);
        window.alert(response.data.message);
        setSpecificQuery((prevState) => ({
          ...prevState,
          createdAt: new Date().toISOString(),
          userQuery: queryUserText,
          userFullName: queryUserFullName,
          userNumber: queryUserNumber,
          userEmail: queryUserEmail,
        }));
      }
    } catch (error) {
      console.error("Failed to send your query due to : ", error);
      window.alert(
        "Failed to send query due to something went wrong, please try again!"
      );
    }
  };

  useEffect(() => {
    const fetchSC = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchspecificquery?userId=${userData?._id}&selectedHomeId=${selectedHomeData?._id}`
        );
        if (response.status === 200) {
          setSpecificQuery(response.data.query[0]);
          // console.log("Specific query data is ", response.data.query);
        } else {
          setSpecificQuery({});
        }
      } catch (error) {
        console.error(
          "Failed to fetch query uploaded by you to this home due to : ",
          error
        );
      }
    };
    fetchSC();
  }, [selectedHomeData, existingQuery]);

  const handleShowMyQuery = () => {
    setShowQuery(true);
  };

  // if (specificQuery) {
  //   console.log("Specific query data is ", specificQuery);
  // }

  const handleCloseSQModal = () => {
    setShowQuery(false);
  };

  const handleDeleteMyQuery = async (selectedQueryId) => {
    const confirmation = window.confirm(
      "Do you want to remove this query permanently ?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}deletemyquery?selectedQueryId=${selectedQueryId}`
        );
        if (response.status === 200) {
          setSpecificQuery({});
          window.alert(response.data.message);
          setShowQuery(false);
          setExistingQuery(false);
        }
      } catch (error) {
        console.error("Failed to delete query due to : ", error);
        window.alert("Failed to delete this query, please try again!!");
      }
    }
  };

  const handleShowCommentsModal = () => {
    setPCmodal(true);
  };

  const handleCloseCommentsModal = () => {
    setPCmodal(false);
    setCommentText("");
    setlinksArray("");
  };

  const handlePlaceMyComment = async () => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}placecomment?userId=${userData?._id}&selectedHomeId=${selectedHomeData?._id}`,
        {
          userName: userData?.username,
          commentText: commentText,
          addedLinks: linksArray,
        }
      );
      if (response.status === 201) {
        window.alert(response.data.message);
        setPCmodal(false);
        setCommentText("");
        setlinksArray("");

        const newComment = response.data.comment;
        setPublicComments((prevComments) => [newComment, ...prevComments]);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to place your comment due to : ", error);
        window.alert("Failed to place your comment, please try again!!");
      }
    }
  };

  const fetchHomeComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchhomecomments?homeId=${selectedHomeData?._id}`
      );
      if (response.status === 200) {
        setPublicComments(response.data.comments);
      }
    } catch (error) {
      console.error("Failed to get comments for this home due to : ", error);
    }
  };

  useEffect(() => {
    fetchHomeComments();
  }, [selectedHomeData]);

  const handleShowCommentLinks = (comment) => {
    setCommentLM(true);
    setCommentLinks(comment.linksByUser);
  };

  const handleCloseCommentsLink = () => {
    setCommentLM(false);
    setCommentLinks({});
  };

  const handleDeleteMyComment = async (commentId) => {
    const confirmation = window.confirm(
      "Do you want to remove this comment permanently ?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}deletecomment?commentId=${commentId}`
        );
        if (response.status === 200) {
          window.alert(response.data.message);
          fetchHomeComments();
        }
      } catch (error) {
        if (
          error.response &&
          error.response.data &&
          error.response.data.message
        ) {
          window.alert(error.response.data.message);
        } else {
          console.error("Failed to delete your comment due to : ", error);
          window.alert("Failed to delete your comment, please try again!!");
        }
      }
    }
  };

  const handleShowEditingCommentModal = (comment) => {
    setECmodal(true);
    setSelectedCommentTE(comment);
  };

  const handleCloseEditingCommentModal = () => {
    setECmodal(false);
    setSelectedCommentTE({});
    setNewCommentLinks("");
    setNewCommentText("");
  };

  const handleUpdateUserComment = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}updatecomment?commentId=${selectedCommentTE._id}`,
        {
          userId: userData?._id,
          selectedHomeId: selectedHomeData?._id,
          userName: userData?.username,
          commentText: newCommentText,
          addedLinks: newCommentLinks,
        }
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        fetchHomeComments();
        handleCloseEditingCommentModal();
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to edit your comment due to : ", error);
        window.alert("Failed to edit your comment, please try again!!");
      }
    }
  };

  const handleShowRCModal = (comment) => {
    setRCmodal(true);
    setSCTEdata(comment);
    setMentionedCommentText(`@${comment.userName} `);
  };

  const handleTextChange = (e) => {
    setMentionedCommentText(e.target.value);
  };

  const handleShowNUCLM = (comment) => {
    setNonUserCLmodal(true);
    setNonUserCommentLinks(comment.linksByUser);
  };

  const handleCloseNUCLM = () => {
    setNonUserCLmodal(false);
    setNonUserCommentLinks("");
  };

  const handleAddaReplyToComment = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}addreplytocomment?commentId=${SCTEdata?._id}`,
        {
          replierId: userData?._id,
          replyText: mentionedCommentText,
        }
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setRCmodal(false);
        fetchHomeComments();
        setSCTEdata({});
        setMentionedCommentText("");
        fetchReplies();
      }
    } catch (error) {
      console.error("Failed to add reply to this comment due to : ", error);
      window.alert("Failed to add reply to this comment, please try again!!");
    }
  };

  const handleCloseRCmodal = () => {
    setRCmodal(false);
    setSCTEdata({});
    setMentionedCommentText("");
  };

  const handleShowSCARmodal = (comment) => {
    setSCARmodal(true);
    setSelectedCommentForSCAR(comment);
  };

  // if (selectedCommentForSCAR) {
  //   console.log("Comment selected data is ", selectedCommentForSCAR);
  // }

  const fetchReplies = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchrepliesofcomments?commentId=${selectedCommentForSCAR?._id}`
      );

      if (response.status === 200) {
        let comments = response.data.comments;

        if (!Array.isArray(comments)) {
          comments = [comments];
        }

        const replyByUserIds = comments.flatMap((comment) => comment.replyBy);

        if (replyByUserIds.length > 0) {
          const usernamesResponse = await axios.get(
            `${
              process.env.REACT_APP_API_URL
            }fetchusernameforcomments?userIds=${replyByUserIds.join(",")}`
          );

          if (usernamesResponse.status === 200) {
            const usernames = usernamesResponse.data.usernames;

            const enrichedComments = comments.map((comment) => {
              comment.replyByUser = comment.replyBy.map(
                (userId) => usernames[userId]
              );
              return comment;
            });

            setSCARdata(enrichedComments);
          }
        }
      }
    } catch (error) {
      console.error("Failed to get comments with replies due to : ", error);
    }
  };

  useEffect(() => {
    fetchReplies();
  }, [selectedCommentForSCAR]);

  // if (SCARdata) {
  //   console.log("Data for SCAR is", SCARdata);
  // }

  const handleCloseCRmodal = () => {
    setSCARmodal(false);
    setSelectedCommentForSCAR(null);
    setSCARdata({});
  };

  const handleDeleteMyReply = async (commentId) => {
    const confirmation = window.confirm(
      "Do you want to remove your reply from this comment?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}deletemyreply?commentId=${commentId}&userId=${userData?._id}`
        );
        if (response.status === 200) {
          window.alert(response.data.message);
          setSCARmodal(false);

          setSCARdata((prevData) =>
            prevData.map((comment) => {
              if (comment._id === commentId) {
                return {
                  ...comment,
                  replies: comment.replies.filter((_, index) => {
                    return comment.replyBy[index] !== userData?._id;
                  }),
                  replyBy: comment.replyBy.filter((id) => id !== userData?._id),
                };
              }
              return comment;
            })
          );
        }
      } catch (error) {
        console.error(
          "Failed to delete your reply from this comment due to: ",
          error
        );
        window.alert(
          "Failed to delete your reply from this comment, please try again!!"
        );
      }
    }
  };

  const handleSendCommentReply = async (comment, index) => {
    try {
      const replyToUserId = comment.replyBy[index];
      const replyToUserUN = comment.replyByUser[index];

      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}sendcommentreply?commentId=${comment._id}`,
        {
          replyToUserId: replyToUserId,
          replyToText: replyTexts[`${comment._id}-${index}`],
          replyToUserUN: replyToUserUN,
        }
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setReplyTexts("");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
        setReplyTexts("");
      } else {
        console.error("Failed to send reply to user due to : ", error);
        window.alert("Failed to send reply to user, please try again!!");
      }
    }
  };

  const handleFetchCommentReplies = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchreplies?myId=${userData?._id}`
      );
      if (response.status === 200) {
        setCommentReplies(response.data.replies);
      }
    } catch (error) {
      console.error(
        "Failed to fetch replies for your comments due to : ",
        error
      );
    }
  };

  useEffect(() => {
    handleFetchCommentReplies();
  }, [userData]);

  // if (commentReplies) {
  //   console.log("Replies of your comments are : ", commentReplies);
  // }

  const handleCloseCommentRepliesModal = () => {
    setCommentRepliesModal(false);
    setCommentReplies([]);
  };

  const handleFetchBookmarks = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchbookmarks?userId=${userData._id}`
      );
      if (response.status === 200) {
        setFetchedBookmarks(response.data.yourBookmarks);
        console.log("Bookmark data", response.data.yourBookmarks);
      }
    } catch (error) {
      console.error(
        "Failed to fetch your bookmarks added to homes due to : ",
        error
      );
    }
  };

  useEffect(() => {
    handleFetchBookmarks();
  }, [userData]);

  const handleShowMoreDetailsOfBookmark = (bookmarkData) => {
    setHomeBookmarksModal(false);
    setFetchedBookmarks([]);
    localStorage.setItem(
      "selectedHomeData",
      JSON.stringify(bookmarkData.homeId)
    );
    window.location.reload();
  };

  const handleCloseBMmodal = () => {
    setFetchedBookmarks([]);
    setHomeBookmarksModal(false);
  };

  const handleEUPCloseModal = () => {
    setEUPuserPassword("");
    setEditUserProfileModal(false);
  };

  const handleChangeProfileInfo = async () => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}updateuserinfo?userId=${userData._id}`,
        {
          newUsername: EUPuserUsername,
          newFullName: EUPuserFullname,
          newPassword: EUPuserPassword,
        }
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setEUPuserPassword("");
        setEditUserProfileModal(false);
        localStorage.setItem("user", JSON.stringify(response.data.user));
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to update user info due to : ", error);
        window.alert("Failed to your profile details, please try again!!");
      }
    }
  };

  const handleLogOutUser = () => {
    const confirmation = window.confirm(
      "Do you want to logout from this account ?"
    );
    if (confirmation) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      localStorage.removeItem("selectedHomeData");
      navigate("/");
    }
  };

  const handleDisplayUserQueries = () => {
    setUserQueriesModal(true);
    handleFetchUserQueries();
  };

  const handleCloseUserQueriesModal = () => {
    setUserQueriesModal(false);
    setUserQueries([]);
  };

  const handleFetchUserQueries = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchresolvedqueries?userId=${userData._id}`
      );
      if (response.status === 200) {
        setUserQueries(response.data.resolvedQueries);
      }
    } catch (error) {
      console.error(
        "Failed to fetch resolved queries for your account due to : ",
        error
      );
    }
  };

  useEffect(() => {
    handleFetchUserQueries();
    handleFetchCustomerNotifications();
  }, [userData]);

  const handleShowCustomerNofications = () => {
    setNotificationModal(true);
    handleFetchCustomerNotifications();
  };

  const handleFetchCustomerNotifications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchCHN?userId=${userData._id}`
      );
      if (response.status === 200) {
        setUserNofications(response.data.notifications);
      }
    } catch (error) {
      console.error("Failed to fetch your notifications due to : ", error);
    }
  };

  const handleCloseNotificationModal = () => {
    setNotificationModal(false);
    setUserNofications([]);
  };

  const handleShowBookmarksFromNotifications = () => {
    setNotificationModal(false);
    setUserNofications([]);
    setHomeBookmarksModal(true);
    handleFetchBookmarks();
  };

  const handleShowMyQueriesFromNotifications = () => {
    setNotificationModal(false);
    setUserNofications([]);
    setUserQueriesModal(true);
    handleFetchUserQueries();
  };

  const handleDeleteCustomerNotification = async (notificationId) => {
    const confirmation = window.confirm(
      "Do you want to remove this notification from your account ?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}deleteCHN?notificationId=${notificationId}`
        );
        if (response.status === 200) {
          window.alert(response.data.message);
          setUserNofications((prevNotifications) =>
            prevNotifications.filter((n) => n._id !== notificationId)
          );
        }
      } catch (error) {
        console.error(
          "Failed to delete the selected notification due to : ",
          error
        );
        window.alert(
          "Failed to delete the selected notification, please try again!"
        );
      }
    }
  };

  return (
    <>
      <CusHomePageNav
        onCommentRepliesPress={handleCommentRepliesModal}
        onHomeBookmarkPress={handleFBmodal}
        onProfileBtnPress={handleEUPmodal}
        onLogoutPress={handleLogOutUser}
        onQueriesPress={handleDisplayUserQueries}
        onNotificationPress={handleShowCustomerNofications}
      />
      <CusHomePageSB
        onPrevBtnClick={handlePreviousPageNav}
        onResbtnClick={handleShowRestSelPage}
      />
      <div id="homePageCusDataContainer">
        <p id="homePageCusFirsthead">Home Details</p>
        <div id="homepageHomeDetailscontainer">
          <p id="homePageHomeStreetP">
            Street Name : {selectedHomeData.address?.street}
          </p>
          <p id="homePageHomeCityP">
            City Name : {selectedHomeData.address?.city}
          </p>
          <p id="homePageZipCodeP">
            Zip - Code : {selectedHomeData.address?.zipCode}
          </p>
          <p id="homePageRPRP">
            Price each room : ₹ {selectedHomeData.rentPerRoom} for 24 hours
          </p>
          <p id="homePageNORP">
            Number of Rooms : {selectedHomeData.numberOfRooms}
          </p>
          <div id="homePageSL"></div>
          <p id="descriptionHead">Description</p>
          <div id="CusHomeDesContainer">
            <p id="cusHDT">" {selectedHomeData.description} "</p>
          </div>
          {!isBookmarked && (
            <button id="homePageAddBookmarkBtn" onClick={handleAddToBookmark}>
              Add Bookmark{" "}
              <span id="bookmarkLogo">
                <FontAwesomeIcon icon={faBookmark} />
              </span>
            </button>
          )}
          {isBookmarked && (
            <button id="homePageRBbtn" onClick={handleRemoveBookmarkedHome}>
              Remove Bookmark{" "}
              <span id="removeBookmarkLogo">
                <FontAwesomeIcon icon={faMinus} />
              </span>
            </button>
          )}
          {!existingQuery && (
            <button
              id="homePageAskQueriesBtn"
              onClick={handleShowQueriesUploadModal}
            >
              Ask Query{" "}
              <span id="queryLogo">
                <FontAwesomeIcon icon={faComment} />
              </span>
            </button>
          )}
          {existingQuery && (
            <button id="homePageEQbutton" onClick={handleShowMyQuery}>
              Show Query{" "}
              <span id="eyeLogo">
                <FontAwesomeIcon icon={faEye} />
              </span>
            </button>
          )}
          <button id="homePageNumberBtn" onClick={handleCopyMobileNumber}>
            Copy Contact Number{" "}
            <span id="copyLogo">
              <FontAwesomeIcon icon={faCopy} />
            </span>
          </button>
          <button id="homePageEmailBtn" onClick={handleEmailThisUser}>
            Email The User{" "}
            <span id="emailLogo">
              <FontAwesomeIcon icon={faEnvelope} />
            </span>
          </button>
        </div>
        <div id="homePageImgContainer">
          {selectedHomeData &&
          selectedHomeData.imagesOfHome &&
          selectedHomeData.imagesOfHome.length > 0 ? (
            selectedHomeData.imagesOfHome.map((image, index) => {
              const imageUrl = `http://localhost:8081/homeimages/${image}`;
              return (
                <img
                  key={index}
                  id="HPHOimges"
                  src={imageUrl}
                  alt={`Your Home Image ${index + 1}`}
                />
              );
            })
          ) : (
            <p id="noHIF">This may take a while!!</p>
          )}
        </div>
        <p id="homePageImgHead">Location Images</p>
        <div id="homePageSplitLine"></div>
        <p id="HPACH" onClick={handleShowCommentsModal}>
          Interact publicly and share your thoughts ?
        </p>
        <p id="homePageSLHead">Public Comments</p>
        <div id="custhomepagecommentsContainer">
          {publicComments.length > 0 ? (
            publicComments.map((comment) => (
              <div key={comment._id} id="commentBackground">
                <p
                  id="commentUserUsername"
                  onClick={() => handleShowSCARmodal(comment)}
                >
                  {comment.userName}
                </p>
                <div id="commentDataContainer">
                  <p id="commentData">{comment.commentContent}</p>
                </div>
                {comment.userId === userData?._id && (
                  <>
                    <button
                      id="editCommentBtn"
                      onClick={() => handleShowEditingCommentModal(comment)}
                    >
                      Edit Comment
                    </button>
                    <button
                      id="deleteCommentBtn"
                      onClick={() => handleDeleteMyComment(comment._id)}
                    >
                      Delete Comment
                    </button>
                    <p id="myCommentUD">
                      {new Date(comment.commentedAt).toLocaleDateString()}
                    </p>
                    {comment.linksByUser && comment.linksByUser.length > 0 && (
                      <>
                        <button
                          id="showLinksBtn"
                          onClick={() => handleShowCommentLinks(comment)}
                        >
                          Show Links
                        </button>
                      </>
                    )}
                  </>
                )}
                {comment.userId !== userData?._id && (
                  <>
                    <p id="userCommentUD">
                      {new Date(comment.commentedAt).toLocaleDateString()}
                    </p>
                    <input
                      type="text"
                      id="commentuserDI"
                      placeholder={`Reply ${comment.userName}`}
                      onClick={() => handleShowRCModal(comment)}
                      readOnly
                    />
                    <button
                      id="commentUserLinksBtn"
                      onClick={() => handleShowNUCLM(comment)}
                    >
                      Show Links
                    </button>
                  </>
                )}
              </div>
            ))
          ) : (
            <p id="noCFOP">No Comments Founded For This Place!!</p>
          )}
        </div>
      </div>
      {uploadQueriesModal && (
        <div id="modalBackground">
          <div id="uploadQueriesBackground">
            <p id="uploadQueriesFirstHead">
              This will send your query to {selectedHomeData.contactInfo?.name}
            </p>
            <input
              type="text"
              id="userfullnameInputQuery"
              placeholder="Enter your name"
              value={queryUserFullName}
              onChange={(e) => setQueryUserFullName(e.target.value)}
            />
            <input
              type="number"
              id="userNumberInputQuery"
              placeholder="Enter your number"
              value={queryUserNumber}
              onChange={(e) => setQueryUserNumber(e.target.value)}
            />
            <input
              type="email"
              id="userEmailInputQuery"
              placeholder="Enter your email"
              value={queryUserEmail}
              onChange={(e) => setQueryUserEmail(e.target.value)}
            />
            <textarea
              id="userQueryInputText"
              placeholder="Enter your query"
              value={queryUserText}
              onChange={(e) => setQueryUserText(e.target.value)}
            />
            <button id="sendQueryBtn" onClick={handleSendMyQuery}>
              Send
            </button>
            <button id="cancelQueryBtn" onClick={handleCloseQueriesModal}>
              Cancel
            </button>
          </div>
        </div>
      )}
      {showQuery && (
        <>
          <div id="modalBackground">
            <div id="myQueryModal">
              <p id="specificQueryUD">
                You sent this query on{" "}
                {new Date(specificQuery?.createdAt).toLocaleDateString()} as{" "}
                {specificQuery.userFullName}
              </p>
              <div id="specificQueryTDcontainer">
                <p id="SQTChead">Query Text</p>
                <div id="QTcontainer">
                  <p id="QTtextP">" {specificQuery.userQuery} "</p>
                </div>
                <p id="SQTnumber">Number : {specificQuery.userNumber}</p>
                <p id="SQTemail">Email : {specificQuery.userEmail}</p>
              </div>
              <button
                id="deleteSQbtn"
                onClick={() => handleDeleteMyQuery(specificQuery._id)}
              >
                Delete
              </button>
              <button id="closeSQbtn" onClick={handleCloseSQModal}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {PCmodal && (
        <>
          <div id="modalBackground">
            <div id="placecommentsModal">
              <p id="PCmodalHead">
                This will add a public comment and visible online
              </p>
              <textarea
                id="PCmodalTextContainer"
                placeholder={`Comment publicaly as ${userData.username}`}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              ></textarea>
              <input
                type="text"
                id="PCmodalLinksInput"
                placeholder="Any additional links ? "
                value={linksArray}
                onChange={(e) =>
                  setlinksArray(
                    e.target.value.split(",").map((link) => link.trim())
                  )
                }
              />
              <button id="placeMyCommentBtn" onClick={handlePlaceMyComment}>
                Place Comment
              </button>
              <button
                id="cancelMyCommentBtn"
                onClick={handleCloseCommentsModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
      {commentLM && (
        <>
          <div id="modalBackground">
            <div id="CLmodal">
              <p id="CLmodalhead">Links attached to this comment</p>
              {commentLinks && commentLinks.length > 0 ? (
                <ul id="CLmodalUL">
                  {commentLinks.map((link, index) => (
                    <li key={index} id="CLmodalLI">
                      <a
                        href={
                          link.startsWith("http://") ||
                          link.startsWith("https://")
                            ? link
                            : `https://${link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No links attached to this comment yet.</p>
              )}

              <button id="closeCLbtn" onClick={handleCloseCommentsLink}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {ECmodal && (
        <>
          <div id="modalBackground">
            <div id="editCommentModal">
              <p id="editCommentHead">Current Comment</p>
              <div id="currentCommentContainer">
                <p id="currentCommentText">
                  " {selectedCommentTE.commentContent} "
                </p>
              </div>
              <div id="editCommentContainerSL"></div>
              <textarea
                id="editCommentCTC"
                placeholder="Type new comment"
                value={newCommentText}
                onChange={(e) => setNewCommentText(e.target.value)}
              ></textarea>
              <input
                type="text"
                id="editCommentLC"
                placeholder="Enter links again!"
                value={newCommentLinks}
                onChange={(e) =>
                  setNewCommentLinks(
                    e.target.value.split(",").map((link) => link.trim())
                  )
                }
              />
              <button id="savenewCommentbtn" onClick={handleUpdateUserComment}>
                Save
              </button>
              <button
                id="cancelNewCommentBtn"
                onClick={handleCloseEditingCommentModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
      {RCmodal && (
        <>
          <div id="modalBackground">
            <div id="RCbackground">
              <p id="RCModalUH">Replying to comment of {SCTEdata.userName} </p>
              <div id="RCtextBackground">
                <p id="RCTHead">User Comment</p>
                <div id="RCcontainerTB">
                  <p id="RcBGText">{SCTEdata.commentContent}</p>
                </div>
              </div>
              <div id="RCMSL"></div>
              <textarea
                id="oneMoreCommentInputContainer"
                value={mentionedCommentText}
                onChange={handleTextChange}
                placeholder="Type the comment"
              ></textarea>
              <button id="sendmycommentBtn" onClick={handleAddaReplyToComment}>
                Send Comment
              </button>
              <button id="cancelmycommentBtn" onClick={handleCloseRCmodal}>
                Cancel
              </button>
            </div>
          </div>
        </>
      )}
      {nonUserCLmodal && (
        <>
          <div id="modalBackground">
            <div id="NUCM">
              <p id="NUCMhead">Links found on this comment</p>
              {nonUserCommentLinks && nonUserCommentLinks.length > 0 ? (
                <ul id="CLmodalUL">
                  {nonUserCommentLinks.map((link, index) => (
                    <li key={index} id="CLmodalLI">
                      <a
                        href={
                          link.startsWith("http://") ||
                          link.startsWith("https://")
                            ? link
                            : `https://${link}`
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No links attached to this comment yet.</p>
              )}
              <button id="closeCLbtn" onClick={handleCloseNUCLM}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
      {SCARmodal && (
        <>
          <div id="modalBackground">
            <div id="SCARmodalBG">
              <p id="SCARmodalHead">
                Showing replies on comment of {selectedCommentForSCAR.userName}
              </p>
              <div id="SCARmainCommentContainer">
                <p id="SCARMUhead">User Comment</p>
                <div id="SCARcontainerComment">
                  <p id="SCARContainerCommentText">
                    {selectedCommentForSCAR.commentContent}
                  </p>
                </div>
                <p id="SCARcontainerDate">
                  {new Date(
                    selectedCommentForSCAR.commentedAt
                  ).toLocaleDateString()}
                </p>
              </div>
              <div id="SCARMSL"></div>
              <div id="SCARrepliesContainer">
                {SCARdata.length > 0 ? (
                  SCARdata.map((comment) => {
                    return comment.replies.length > 0
                      ? comment.replies.map((reply, index) => (
                          <div
                            key={`${comment._id}-${index}`}
                            id="replyContainer"
                          >
                            <p id="SCARcontainerusername">
                              {comment.replyByUser[index]}
                            </p>
                            <div id="SCARreplierTextContainer">{reply}</div>
                            {comment.replyBy[index] === userData?._id && (
                              <>
                                <button
                                  id="deleteReplyBtn"
                                  onClick={() =>
                                    handleDeleteMyReply(comment._id)
                                  }
                                >
                                  <FontAwesomeIcon icon={faTrash} />
                                </button>
                              </>
                            )}
                            {comment.userId === userData?._id && (
                              <>
                                <input
                                  id="replyToReplyInput"
                                  placeholder={`Reply to ${comment.replyByUser[index]}`}
                                  type="text"
                                  value={
                                    replyTexts[`${comment._id}-${index}`] || ""
                                  }
                                  onChange={(e) =>
                                    setReplyTexts((prev) => ({
                                      ...prev,
                                      [`${comment._id}-${index}`]:
                                        e.target.value,
                                    }))
                                  }
                                />
                                <button
                                  id="sendReplyToReplyBtn"
                                  onClick={() =>
                                    handleSendCommentReply(comment, index)
                                  }
                                >
                                  <FontAwesomeIcon icon={faPaperPlane} />
                                </button>
                              </>
                            )}
                          </div>
                        ))
                      : null;
                  })
                ) : (
                  <p id="NRFhead">No replies found for this comment!!</p>
                )}
              </div>
              <button id="clsSCARcontainer" onClick={handleCloseCRmodal}>
                Close Replies
              </button>
            </div>
          </div>
        </>
      )}
      {commentRepliesModal && (
        <>
          <div id="modalBackground">
            <div id="commentRepliesModalBG">
              <button
                id="closeCommentrepliesModal"
                onClick={handleCloseCommentRepliesModal}
              >
                Close Replies
              </button>
              <div id="commentRepliesContainer">
                {commentReplies.length > 0 ? (
                  commentReplies.map((reply, index) => (
                    <>
                      <div
                        key={`${commentReplies}-${index}`}
                        id="commentReplyBG"
                      >
                        <p id="CRcontainerFirstHead">{reply.userName}</p>
                        <div id="CRcontainerDataContainer">
                          {reply.replyTo &&
                          reply.replyTo.length > 0 &&
                          userData?._id ? (
                            reply.replyTo.map((replyToUserId, index) =>
                              replyToUserId === userData._id ? (
                                <p
                                  key={`replyText-${index}`}
                                  className="replyText"
                                >
                                  {reply.replyTextToUser[index] ||
                                    "No reply text available"}
                                </p>
                              ) : null
                            )
                          ) : (
                            <p>No replies available for you</p>
                          )}
                        </div>
                        <p id="CRcontainerLasthead">
                          You can't reply to this conversation
                        </p>
                      </div>
                    </>
                  ))
                ) : (
                  <p id="NRFhead">No replies found for your comment!!</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {homeBookmarksModal && (
        <>
          <div id="modalBackground">
            <div id="bookmarksModalHome">
              <p id="BMfirsthead">All homes that you bookmarked recently</p>
              <button id="closeBookMmodal" onClick={handleCloseBMmodal}>
                Close
              </button>
              <div id="bookmarkContainer">
                {fetchedBookmarks.length > 0 ? (
                  fetchedBookmarks.map((bookmark) => (
                    <div key={bookmark._id} id="bookmarkBackground">
                      <div id="bookmarkContainerIMGcontainer">
                        {bookmark.homeId.imagesOfHome &&
                        bookmark.homeId.imagesOfHome.length > 0 ? (
                          bookmark.homeId.imagesOfHome.map((image, index) => (
                            <img
                              key={`${bookmark._id}-${index}`}
                              src={`http://localhost:8081/homeimages/${image}`}
                              alt={`Home image ${index + 1}`}
                              className="bookmarkImages"
                            />
                          ))
                        ) : (
                          <p>No images available</p>
                        )}
                      </div>
                      <div id="bookmarkMoreDataContainer">
                        <p id="BMDstreetname">
                          Street : {bookmark.homeId.address.street}
                        </p>
                        <p id="BMDcityname">
                          City : {bookmark.homeId.address.city}
                        </p>
                        <p id="BMDTotalCost">
                          Room Price = ₹{bookmark.homeId.rentPerRoom} only
                        </p>
                        <button
                          id="BMDfullinfoBtn"
                          onClick={() =>
                            handleShowMoreDetailsOfBookmark(bookmark)
                          }
                        >
                          Click To Get More Info
                        </button>
                        <button
                          id="removeBMbtn"
                          onClick={() =>
                            handleDeleteBookmarkFromBMContainer(
                              bookmark.homeId._id
                            )
                          }
                        >
                          Remove Bookmark
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p id="noBFFU">You didn't added any bookmark yet!!</p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {editUserProfileModal && (
        <>
          <div id="modalBackground">
            <div id="EUPmodal">
              <p id="EUPmodalHead">Your Profile Editable Data</p>
              <input
                type="text"
                id="EUPfullnameInput"
                placeholder="Your Full Name"
                value={EUPuserFullname}
                onChange={(e) => setEUPuserFullname(e.target.value)}
              />
              <input
                type="text"
                id="EUPusernameInput"
                placeholder="Enter your username"
                value={EUPuserUsername}
                onChange={(e) => setEUPuserUsername(e.target.value)}
              />
              <input
                type="password"
                id="EUPuserpasswordInput"
                placeholder="Enter Password"
                value={EUPuserPassword}
                onChange={(e) => setEUPuserPassword(e.target.value)}
              />
              <p id="EUPpasswordhead">
                Password is needed for verification purpose, you can't change it
              </p>
              <button id="EUPsaveDataBtn" onClick={handleChangeProfileInfo}>
                Save Changes
              </button>
              <button id="EUPcancelDataBtn" onClick={handleEUPCloseModal}>
                Cancel Changes
              </button>
            </div>
          </div>
        </>
      )}
      {userQueriesModal && (
        <>
          <div id="modalBackground">
            <div id="queriesModalBG">
              <p id="queriesModalHead">Your queries answers from home owners</p>
              <button id="queriesClsBtn" onClick={handleCloseUserQueriesModal}>
                Close Queries
              </button>
              <div id="queriesContainerUserHome">
                {userQueries.length > 0 ? (
                  userQueries.map((query) => (
                    <div key={query._id} id="userQueryBackground">
                      <p id="queryUserFirstP">Your Query</p>
                      <div id="userQueryTxtContainer">
                        <p id="userQueryText">{query.userQuery}</p>
                      </div>
                      <div id="queryContainerSL"></div>
                      <p id="queryUserSecondP">User Respond To Query</p>
                      <div id="queryUserRespondContainer">
                        <p id="userRespondToqueryText">
                          {query.homeOwnerReplyToQuery}
                        </p>
                      </div>
                      <p
                        id="queryContainerEmailP"
                        onClick={handleEmailThisUser}
                      >
                        <u>Email User ?</u>
                      </p>
                    </div>
                  ))
                ) : (
                  <p id="queryNotFoundedUser">
                    No resolved queries founded for your account!!
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
      {notifcationModal && (
        <>
          <div id="modalBackground">
            <div id="notificationModalBackground">
              <p id="notificationMHead">Displaying Your Notifications</p>
              <div id="notificationsContainerOfHO">
                {userNotifications.length > 0 ? (
                  userNotifications.map((notification) => (
                    <>
                      <div key={notification._id} id="notificationBGOH">
                        <p id="notificationHOhead">Recent Notification</p>
                        <div id="notificationHOtextContainer">
                          <p id="notificationHOtext">{notification.message}</p>
                        </div>
                        <button
                          id="deleteNotificationRCBtn"
                          onClick={() =>
                            handleDeleteCustomerNotification(notification._id)
                          }
                        >
                          <FontAwesomeIcon icon={faTrash} />
                        </button>
                        <p id="notificationGOTHO">
                          {new Date(
                            notification.createdAt
                          ).toLocaleTimeString()}
                        </p>
                        {notification.type === "bookmark_added" && (
                          <>
                            <p
                              id="NTSWhead"
                              onClick={handleShowBookmarksFromNotifications}
                            >
                              show bookmarks
                            </p>
                          </>
                        )}
                        {notification.type === "query_owner_respond" && (
                          <>
                            <p
                              id="NTSQhead"
                              onClick={handleShowMyQueriesFromNotifications}
                            >
                              show query replies
                            </p>
                          </>
                        )}
                      </div>
                    </>
                  ))
                ) : (
                  <p id="noNFFBGHO">No activity founded for your account!!</p>
                )}
              </div>
              <button id="clsNMOHO" onClick={handleCloseNotificationModal}>
                Close Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default CusHomePageForHomes;
