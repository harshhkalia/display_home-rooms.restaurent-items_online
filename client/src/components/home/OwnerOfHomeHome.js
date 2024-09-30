import { useEffect, useState } from "react";
import HomeOwnNav from "../navbarsAndFooters/OwnerOfHomeHomeNav";
import OwnerHomeSB from "../resOwnPageEl/OwnerOfHomeSB";
import "./OwnerOfHomeHome.css";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faEnvelope,
  faPaperPlane,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

const OwnerHomePage = () => {
  const [homePageSelected, setHomePageSelected] = useState(true);
  const [homeData, setHomeData] = useState({});
  const [homeDetails, setHomeDetails] = useState({});
  const [publicComments, setPublicComments] = useState([]);
  const [editProfileModal, setEditProfileModal] = useState(false);
  const [selectedImages, setSelectedImages] = useState(null);
  const [displayQueriesModal, setDisplayQueriesModal] = useState(false);
  const [HomeQueries, setHomeQueries] = useState([]);
  const [userData, setUserData] = useState({});
  const [queryResponseText, setQueryResponseText] = useState("");
  const [nonUserCLmodal, setNonUserCLmodal] = useState(false);
  const [nonUserCommentLinks, setNonUserCommentLinks] = useState("");
  const [commenterDataModal, setCommenterDataModal] = useState(false);
  const [selectedComment, setSelectedComment] = useState({});
  const [notificationsModal, setNotificationsModal] = useState(false);
  const [HOnotifications, setHOnotifications] = useState([]);

  const navigate = useNavigate();

  const handleLogOut = () => {
    const confirm = window.confirm("Do you really want to logout ?");
    if (confirm) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/");
    }
  };

  const fetchHomeInfo = () => {
    const fetchHomeDetails = JSON.parse(localStorage.getItem("homeInfo"));
    if (fetchHomeDetails) {
      setHomeData(fetchHomeDetails);
    }
  };

  const fetchUserData = () => {
    const fetchUserDetails = JSON.parse(localStorage.getItem("user"));
    if (fetchUserDetails) {
      setUserData(fetchUserDetails);
    }
  };

  useEffect(() => {
    fetchHomeInfo();
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchHomeDataFromAPI = async () => {
      try {
        const url = `${process.env.REACT_APP_API_URL}fetchdetailsofmyhome?dataId=${homeData._id}`;
        const response = await axios.get(url);
        if (response.status === 200) {
          setHomeDetails(response.data);
        }
      } catch (error) {
        console.error("Failed to get details of your home due to: ", error);
      }
    };

    fetchHomeDataFromAPI();
  }, [homeData]);

  const handleShowEPmodal = () => {
    setEditProfileModal(true);
  };

  const handleHideEPmodal = () => {
    setEditProfileModal(false);
    window.location.reload();
  };

  const handleChangeInput = (e) => {
    const { name, value } = e.target;

    setHomeData((prevDetails) => {
      if (name.startsWith("address.")) {
        const addressField = name.split(".")[1];
        return {
          ...prevDetails,
          address: {
            ...prevDetails.address,
            [addressField]: value,
          },
        };
      } else if (name.startsWith("contactInfo.")) {
        const contactField = name.split(".")[1];
        return {
          ...prevDetails,
          contactInfo: {
            ...prevDetails.contactInfo,
            [contactField]: value,
          },
        };
      } else {
        return {
          ...prevDetails,
          [name]: value,
        };
      }
    });
  };

  const handleImagechange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedImages(files);
  };

  const handleEditHomeData = async () => {
    const formData = new FormData();
    formData.append("streetNewName", homeData.address?.street);
    formData.append("cityNewName", homeData.address?.city);
    formData.append("newZipCode", homeData.address?.zipCode);
    formData.append("updatedPrice", homeData.rentPerRoom);
    formData.append("updatedNoOfRooms", homeData.numberOfRooms);
    formData.append("newPersonName", homeData.contactInfo?.name);
    formData.append("newPersonNumber", homeData.contactInfo?.number);
    formData.append("newPersonEmail", homeData.contactInfo?.email);
    formData.append("newDescription", homeData.description);

    if (selectedImages && selectedImages.length > 0) {
      selectedImages.forEach((image) => {
        formData.append("newImages", image);
      });
    } else {
      window.alert("Please upload at least one image.");
      return;
    }

    try {
      const updatedResponse = await axios.put(
        `${process.env.REACT_APP_API_URL}updatemyhome?dataId=${homeData._id}`,
        formData
      );

      if (updatedResponse.status === 200) {
        setHomeData((prevData) => ({
          ...prevData,
          ...updatedResponse.data.newData,
        }));
        localStorage.setItem(
          "homeInfo",
          JSON.stringify(updatedResponse.data.newData)
        );
        window.alert(updatedResponse.data.message);
        setEditProfileModal(false);
        const confirmationforReload = window.confirm(
          "Do you want to reload ? It will improve your experience."
        );
        if (confirmationforReload) {
          window.location.reload();
        }
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to update the data:", error);
        window.alert("Failed to update the data, please try again!");
      }
    }
  };

  const handleOpenMyInboxGmail = () => {
    const email = `https://mail.google.com/mail/u/0/#inbox`;
    window.open(email, "_blank");
  };

  const handleDisplayMyQueries = () => {
    setDisplayQueriesModal(true);
    handleFetchHomeQueries();
  };

  const handleFetchHomeQueries = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchqueriesforhome?homeId=${homeData._id}`
      );
      if (response.status === 200) {
        setHomeQueries(response.data.queries);
      }
    } catch (error) {
      console.error(
        "Failed to get all queries related to your home due to : ",
        error
      );
    }
  };

  useEffect(() => {
    handleFetchHomeQueries();
  }, [homeData]);

  const handleCLSqueryContainer = () => {
    setHomeQueries([]);
    setDisplayQueriesModal(false);
  };

  const handleQueryChange = (text, queryId) => {
    setQueryResponseText((prevState) => ({
      ...prevState,
      [queryId]: text,
    }));
  };

  const handleSendResponseToQuery = async (queryId) => {
    try {
      const response = await axios.put(
        `${process.env.REACT_APP_API_URL}sendresponsetoquery?queryId=${queryId}`,
        {
          ownerId: userData._id,
          ownerName: homeData.contactInfo?.name,
          ownerNumber: homeData.contactInfo?.number,
          ownerEmail: homeData.contactInfo?.email,
          ownerReply: queryResponseText[queryId],
        }
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        handleFetchHomeQueries();
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
          "Failed to send response to query of user due to : ",
          error
        );
        window.alert("Failed to send response to user, please try again!!");
      }
    }
  };

  const handleShowQueryResponse = (query) => {
    window.alert(
      "You replied " + query.homeOwnerReplyToQuery + " to " + query.userFullName
    );
  };

  const handleFetchCustomerComments = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchhomecomments?homeId=${homeData._id}`
      );
      if (response.status === 200) {
        setPublicComments(response.data.comments);
      }
    } catch (error) {
      console.error("Failed to fetch comments for your home due to : ", error);
    }
  };

  useEffect(() => {
    handleFetchCustomerComments();
  }, [homeData]);

  const handleShowNUCLM = (comment) => {
    setNonUserCLmodal(true);
    setNonUserCommentLinks(comment.linksByUser);
  };

  const handleCloseNUCLM = () => {
    setNonUserCLmodal(false);
    setNonUserCommentLinks("");
  };

  const handleShowCDM = (comment) => {
    setCommenterDataModal(true);
    setSelectedComment(comment);
  };

  if (selectedComment) {
    console.log("Comment data to get is ", selectedComment);
  }

  const handleCloseCDM = () => {
    setCommenterDataModal(false);
    setSelectedComment({});
  };

  const handleDeleteSelectedComment = async (commentId) => {
    const confirmation = window.confirm(
      "Do you want to remove this user comment from your home page ?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}removeselectedcomment?commentId=${commentId}`
        );
        if (response.status === 200) {
          window.alert(response.data.message);
          setCommenterDataModal(false);
          setPublicComments((prevComments) =>
            prevComments.filter((c) => c._id !== commentId)
          );
        }
      } catch (error) {
        console.error("Failed to delete selected comment due to : ", error);
        window.alert("Failed to delete selected comment, please try again!!");
      }
    }
  };

  const handleShowNotificationsModal = () => {
    setNotificationsModal(true);
    handleFetchHomeOwnerNofications();
  };

  const handleFetchHomeOwnerNofications = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchOHN?userId=${userData._id}`
      );
      if (response.status === 200) {
        setHOnotifications(response.data.notifications);
      }
    } catch (error) {
      console.error(
        "Failed to fetch notifications for your account due to : ",
        error
      );
    }
  };

  useEffect(() => {
    handleFetchHomeOwnerNofications();
  }, [userData]);

  const handleCloseHOnotificationModal = () => {
    setNotificationsModal(false);
    setHOnotifications([]);
  };

  const handleDeleteOwnerNotification = async (notificationId) => {
    const confirmation = window.confirm(
      "Do you want to delete this notification from your account ?"
    );
    if (confirmation) {
      try {
        const response = await axios.delete(
          `${process.env.REACT_APP_API_URL}deleteHON?notificationId=${notificationId}`
        );
        if (response.status === 200) {
          window.alert(response.data.message);
          setHOnotifications((prevNotifications) =>
            prevNotifications.filter((n) => n._id !== notificationId)
          );
        }
      } catch (error) {
        console.error(
          "Failed to delete selected notification due to : ",
          error
        );
        window.alert(
          "Failed to delete selected notification, please try again!!"
        );
      }
    }
  };

  return (
    <>
      <HomeOwnNav onLogOutPress={handleLogOut} />
      <OwnerHomeSB
        onEditProfilePress={handleShowEPmodal}
        onDQpress={handleDisplayMyQueries}
        onNotificationPress={handleShowNotificationsModal}
      />
      {homePageSelected && (
        <>
          <div id="homePageContentContainer">
            <p id="homePageSBCHead">Viewing Home Page</p>
            <div id="homePageMainFirstContainer">
              <p id="streetheadMC">Street Name : {homeData.address?.street}</p>
              <p id="cityHeadMC">City Name : {homeData.address?.city}</p>
              <p id="zipcodeHeadMC">Zip - Code : {homeData.address?.zipCode}</p>
              <p id="priceperRoomMC">
                Price each room : ₹ {homeData.rentPerRoom} for 24 hours
              </p>
              <p id="noOfRoomsMC">Number of Rooms : {homeData.numberOfRooms}</p>
              <div id="SLHC"></div>
              <p id="descheadMc">Description</p>
              <div id="descriptionContainer">
                <p id="descriptionText">" {homeData.description} "</p>
              </div>
              <button id="openMyEmail" onClick={handleOpenMyInboxGmail}>
                Open My Email <FontAwesomeIcon icon={faEnvelope} />
              </button>
            </div>
            <div id="homePageMainImageContainer">
              {homeDetails &&
              homeDetails.imagesOfHome &&
              homeDetails.imagesOfHome.length > 0 ? (
                homeDetails.imagesOfHome.map((image, index) => {
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
            <div id="homePageSLOC"></div>
            <p id="homepageHeadFirst">Data Container</p>
            <p id="homePageheadBelow">Public Comments</p>
            <div id="homePageCommentsContainer">
              {publicComments.length > 0 ? (
                publicComments.map((comment) => (
                  <div key={comment._id} id="commentBackground">
                    <p
                      id="commentUserUsername"
                      onClick={() => handleShowCDM(comment)}
                    >
                      {comment.userName}
                    </p>
                    <div id="commentDataContainer">
                      <p id="commentData">{comment.commentContent}</p>
                    </div>
                    {comment.userId !== userData?._id && (
                      <>
                        <p id="userCommentUD">
                          {new Date(comment.commentedAt).toLocaleDateString()}
                        </p>
                        <button
                          id="commentAuthUserLinksBtn"
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
        </>
      )}
      {editProfileModal && (
        <div id="modalBackground">
          <div id="editProfileModal">
            <input
              type="text"
              id="newStreetInputBox"
              placeholder="New street name"
              value={homeData.address?.street}
              name="address.street"
              onChange={handleChangeInput}
            />
            <input
              type="text"
              id="newCityInputBox"
              placeholder="New city name"
              value={homeData.address?.city}
              name="address.city"
              onChange={handleChangeInput}
            />
            <input
              type="number"
              id="newZipCodeInputBox"
              placeholder="Enter ZipCode"
              value={homeData.address?.zipCode}
              name="address.zipCode"
              onChange={handleChangeInput}
            />
            <input
              type="number"
              id="newPriceOfRoomsInputBox"
              placeholder="Enter new price"
              value={homeData.rentPerRoom}
              name="rentPerRoom"
              onChange={handleChangeInput}
            />
            <input
              type="number"
              id="newAvailRoomsInput"
              placeholder="Enter rooms count"
              name="numberOfRooms"
              onChange={handleChangeInput}
              value={homeData.numberOfRooms}
            />
            <input
              type="text"
              id="newPersonName"
              placeholder="Enter your name"
              value={homeData.contactInfo?.name}
              name="contactInfo.name"
              onChange={handleChangeInput}
            />
            <input
              type="number"
              id="newPersonNumber"
              placeholder="Enter contact number"
              value={homeData.contactInfo?.number}
              name="contactInfo.number"
              onChange={handleChangeInput}
            />
            <input
              type="email"
              id="newPersonEmail"
              placeholder="Enter your email"
              name="contactInfo.email"
              onChange={handleChangeInput}
              value={homeData.contactInfo?.email}
            />
            <textarea
              id="newDescriptionInputBox"
              placeholder="Enter new description"
              onChange={handleChangeInput}
              name="description"
              value={homeData.description}
            />
            <label class="image-upload-label-second">
              <input
                type="file"
                accept="image/*"
                multiple
                class="image-upload-input"
                onChange={handleImagechange}
              />
              <p>Upload Images</p>
            </label>
            <button id="saveMyHomeData" onClick={handleEditHomeData}>
              Save and Close
            </button>
            <button id="closeandexitBtnHOB" onClick={handleHideEPmodal}>
              Close and Exit
            </button>
          </div>
        </div>
      )}
      {displayQueriesModal && (
        <>
          <div id="modalBackground">
            <div id="displayQueriesModal">
              <p id="DQhead">Your Home Queries</p>
              <button id="clsDQmodal" onClick={handleCLSqueryContainer}>
                Close Queries
              </button>
              <div id="queriesContainer">
                {HomeQueries.length > 0 ? (
                  HomeQueries.map((query) => (
                    <div key={query.id} id="queryBackground">
                      <p id="querySenderName">{query.userFullName}</p>
                      <div id="queryUserTxtContainer">
                        <p id="queryUserTxt">{query.userQuery}</p>
                      </div>
                      {query.queryStatus === "pending" && (
                        <>
                          <input
                            type="text"
                            id="queryResponseInput"
                            placeholder={`Respond ${query.userFullName}`}
                            value={queryResponseText[query._id] || ""}
                            onChange={(e) =>
                              handleQueryChange(e.target.value, query._id)
                            }
                          />
                          <button
                            id="sendQueryResponseBtn"
                            onClick={() => handleSendResponseToQuery(query._id)}
                          >
                            <FontAwesomeIcon icon={faPaperPlane} />
                          </button>
                        </>
                      )}
                      {query.queryStatus === "resolved" && (
                        <>
                          <p
                            id="resQueryP"
                            onClick={() => handleShowQueryResponse(query)}
                          >
                            <u>Show my respond</u>
                          </p>
                        </>
                      )}
                    </div>
                  ))
                ) : (
                  <p id="noQFFH">No user query founded for your home!!</p>
                )}
              </div>
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
      {commenterDataModal && (
        <>
          <div id="modalBackground">
            <div id="commenterDataModalBackground">
              <div id="commenterDataContainer">
                <p id="commenterDataContainerFirstP">
                  Selected Comment Of {selectedComment.userName}
                </p>
                <div id="commenterContainerOfComment">
                  <p id="CCOCfirstHead">User Comment</p>
                  <div id="CCOCtextContainer">
                    <p id="CCOCtextP">{selectedComment.commentContent}</p>
                  </div>
                  {selectedComment?.linksByUser &&
                  (selectedComment.linksByUser.length === 0 ||
                    (selectedComment.linksByUser.length === 1 &&
                      selectedComment.linksByUser[0] === "")) ? (
                    <p id="noLinksIncludedByUONS">
                      No links found on this comment.
                    </p>
                  ) : (
                    <>
                      <p id="CCOCsecondHead">Links Included - </p>
                      <ul id="noBulletLists">
                        {selectedComment.linksByUser.map((link, index) => {
                          const validLink =
                            link.startsWith("http://") ||
                            link.startsWith("https://")
                              ? link
                              : `http://${link}`;

                          return (
                            <li key={index}>
                              <a
                                href={validLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                id="selectedCommentLinks"
                              >
                                {link}
                              </a>
                            </li>
                          );
                        })}
                      </ul>
                    </>
                  )}
                </div>
              </div>

              <button id="closeCDCcontainer" onClick={handleCloseCDM}>
                Close User Data
              </button>
              <button
                id="DeleteSelectedComment"
                onClick={() => handleDeleteSelectedComment(selectedComment._id)}
              >
                Delete Selected Comment
              </button>
            </div>
          </div>
        </>
      )}
      {notificationsModal && (
        <>
          <div id="modalBackground">
            <div id="notificationModalBackground">
              <p id="notificationMHead">Displaying Your Notifications</p>
              <div id="notificationsContainerOfHO">
                {HOnotifications.length > 0 ? (
                  HOnotifications.map((notification) => (
                    <div key={notification._id} id="notificationBGHO">
                      <p id="notificationHOhead">Recent Notification</p>
                      <div id="notificationHOtextContainer">
                        <p id="notificationHOtext">{notification.message}</p>
                      </div>
                      <button
                        id="deleteNotificationOHBtn"
                        onClick={() =>
                          handleDeleteOwnerNotification(notification._id)
                        }
                      >
                        <FontAwesomeIcon icon={faTrash} />
                      </button>
                      <p id="notificationGOTHO">
                        {new Date(notification.createdAt).toLocaleTimeString()}
                      </p>
                    </div>
                  ))
                ) : (
                  <p id="noNFFBGHO">No activity founded for your account!!</p>
                )}
              </div>
              <button id="clsNMOHO" onClick={handleCloseHOnotificationModal}>
                Close Notifications
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default OwnerHomePage;
