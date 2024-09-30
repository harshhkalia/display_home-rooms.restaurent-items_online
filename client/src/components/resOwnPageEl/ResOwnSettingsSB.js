import { useEffect, useState } from "react";
import "./ResOwnSettingsSB.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const ResOwnSettingsSB = ({
  onAddItemsPress,
  onAddSettingsPress,
  onAddAllOrdersPress,
  onAddNotificationsPress,
  onDeleteRestCompletely,
}) => {
  const [user, setUser] = useState(null);
  const [restaurentData, setRestaurentData] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const fetchRestaurentData = async () => {
      const restaurent = JSON.parse(localStorage.getItem("restaurent"));
      setRestaurentData(restaurent);
    };
    fetchRestaurentData();
  }, []);

  return (
    <>
      <div id="SBcontainer">
        <div id="SBdataContainer">
          {restaurentData ? (
            <>
              <img
                id="SBdataImg"
                src={`http://localhost:8081/api/restaurentUploads/${restaurentData?.restaurentpfp}`}
                alt="RestaurentPFP"
              />
              <h4 id="SBdataResName">{restaurentData?.restaurentname}</h4>
              <p id="SBdataResLoc">
                {" "}
                <span id="locationLogo">
                  <FontAwesomeIcon icon={faLocationDot} />
                </span>
                {restaurentData?.restaurentlocation}
              </p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>
        <button id="addItemsButton" onClick={onAddItemsPress}>
          Add Items
        </button>
        <button id="editResProfileButton" onClick={onAddSettingsPress}>
          Edit Profile
        </button>
        <button id="manageCustomersOrders" onClick={onAddAllOrdersPress}>
          Manage Orders
        </button>
        <button id="restaurentNotifications" onClick={onAddNotificationsPress}>
          View Notifications
        </button>
        <button id="deleteResProfileButton" onClick={onDeleteRestCompletely}>
          Delete Profile
        </button>
        <h4 id="buttonsTopHeading">What You Wanna Do ?</h4>
        <h4 id="irreversibleHeading">This action is irreversible!!</h4>
        <p id="copyrightsRestaurent">
          <u>@ROUSTUF</u> all rights reserved
        </p>
      </div>
    </>
  );
};

export default ResOwnSettingsSB;
