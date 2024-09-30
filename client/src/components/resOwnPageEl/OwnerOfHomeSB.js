import "./OwnerOfHomeSB.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMapMarkerAlt } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";

const OwnerHomeSB = ({
  onEditProfilePress,
  onDQpress,
  onNotificationPress,
}) => {
  const [homeData, setHomeData] = useState({});
  const [currentTime, setCurrentTime] = useState("");

  useEffect(() => {
    const fetchHomeData = () => {
      const fetchedHomeData = JSON.parse(localStorage.getItem("homeInfo"));
      if (fetchedHomeData) {
        setHomeData(fetchedHomeData);
      }
    };
    fetchHomeData();
  }, []);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(now.toLocaleTimeString());
    };
    updateTime();
    const intervalId = setInterval(updateTime, 1000);

    return () => clearInterval(intervalId);
  });

  return (
    <>
      <div id="OwnerHomeSBContainer">
        <div id="OwnerHomeDataContainer">
          <div id="ownerHDUC">
            <span id="locationLogoOHD">
              {" "}
              <FontAwesomeIcon icon={faMapMarkerAlt} />
            </span>
            <p id="locationStreetName">{homeData.address?.street}</p>
            <p id="locationCityName">{homeData.address?.city}</p>
            <p id="currentTime">{currentTime}</p>
          </div>
          <div id="ownerHDCSL"></div>
          <p id="ownerName">{homeData.contactInfo?.name}</p>
          <p id="ownerNumber">{homeData.contactInfo?.number}</p>
          <p id="ownerEmail">( {homeData.contactInfo?.email} )</p>
          {/* <u>
            <p id="ownerMoreData">More Data ?</p>
          </u> */}
        </div>
        <div id="ownerHDBL"></div>
        <button id="homePageButtonOH">Home Page</button>
        <button id="personQueriesButtonOH" onClick={onDQpress}>
          Person Queries
        </button>
        <button id="viewNotificationsOH" onClick={onNotificationPress}>
          Show Notifications
        </button>
        <button id="viewandeditProfileButton" onClick={onEditProfilePress}>
          Edit Profile
        </button>
        <div id="ownerBLOC"></div>
        <p id="ltoC">Nothing more to see yet!!</p>
      </div>
    </>
  );
};

export default OwnerHomeSB;
