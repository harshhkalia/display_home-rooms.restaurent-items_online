import react, { useEffect, useState } from "react";
import "./CustomerViewResItemsSB.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleCheck,
  faLocationDot,
} from "@fortawesome/free-solid-svg-icons";
import { useNavigate } from "react-router-dom";

const ResItemsCusSB = ({ onItemClick }) => {
  const [restaurent, setRestaurent] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResDetails = async () => {
      const restId = JSON.parse(localStorage.getItem("selectedRestaurentId"));
      try {
        const response = await axios.post(
          `${process.env.REACT_APP_API_URL}findresdetails`,
          {
            restaurentId: restId,
          }
        );
        if (response.status === 200) {
          setRestaurent(response.data.details);
          // console.log([response.data.details]);
        }
      } catch (error) {
        console.error(
          "Failed to fetch details of restaurent along with items due to : ",
          error
        );
      }
    };
    fetchResDetails();
  }, []);

  const handleSelectRestaurents = () => {
    localStorage.removeItem("selectedRestaurentId");
    navigate("/viewallrestaurents");
  };

  return (
    <>
      <div id="ItemsSBContainer">
        <div id="restaurentDetailsContainer">
          {restaurent && restaurent.items && restaurent.items.length > 0 ? (
            restaurent.items?.map((item) => (
              <div key={item._id}>
                <img
                  id="resDetailsImg"
                  src={`http://localhost:8081/api/restaurentUploads/${restaurent.restaurentId?.restaurentpfp}`}
                  alt="Restaurent PFP"
                />
                <p id="resDetailsResName">
                  {restaurent.restaurentId?.restaurentname}{" "}
                  <span id="resNameLogo">
                    <FontAwesomeIcon icon={faCircleCheck} />
                  </span>
                </p>
                <p id="resDetailsResLocation">
                  <span id="resLocationLogo">
                    <FontAwesomeIcon icon={faLocationDot} />
                  </span>
                  {restaurent.restaurentId?.restaurentlocation}
                </p>
                <div id="itemCategoryBackground">
                  <p id="itemType">Item Type : "{item.name}" </p>
                </div>
              </div>
            ))
          ) : (
            <p id="noDetailsOfRes">Loading data... </p>
          )}
        </div>
        <p id="restaurentDetailsHeading">Restaurent Details</p>
        <p id="restaurentItemsHeading">Available Items</p>
        <div id="displayResPurItems">
          {restaurent && restaurent.items && restaurent.items.length > 0 ? (
            restaurent.items.map((item) =>
              item.subItems && item.subItems.length > 0 ? (
                item.subItems.map((subItem) => (
                  <div key={subItem._id}>
                    <div id="subitemBC" onClick={() => onItemClick(subItem)}>
                      {subItem.subitemImages &&
                      subItem.subitemImages.length > 0 ? (
                        <>
                          <img
                            id="fetchedSubItemImage"
                            src={`http://localhost:8081/restaurentItemImg/${subItem.subitemImages[0]}`}
                            alt="Item Image"
                          />
                        </>
                      ) : (
                        <p>No image added!</p>
                      )}
                      <p id="fetchedSubItemName">{subItem.name}</p>
                      <p id="subitemDetails">More Details</p>
                    </div>
                  </div>
                ))
              ) : (
                <p id="noSubItemDisplayed">No Data!</p>
              )
            )
          ) : (
            <p id="noSubItemDisplayed">No Data!</p>
          )}
        </div>
        <button
          id="navigateRestaurentSelection"
          onClick={handleSelectRestaurents}
        >
          Other Restaurents
        </button>
      </div>
    </>
  );
};

export default ResItemsCusSB;
