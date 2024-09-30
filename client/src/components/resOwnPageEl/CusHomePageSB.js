import React, { useEffect, useState } from "react";
import "./CusHomePageSB.css";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMapMarkerAlt,
  faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

function CusHomePageSB({ onPrevBtnClick, onResbtnClick }) {
  const [moreHomes, setMoreHomes] = useState([]);
  const [selectedHomeData, setSelectedHomeData] = useState({});

  useEffect(() => {
    const fetchHomeData = () => {
      const homeDetails = JSON.parse(localStorage.getItem("selectedHomeData"));
      if (homeDetails) {
        setSelectedHomeData(homeDetails);
      }
    };
    fetchHomeData();
  }, []);

  //   if (selectedHomeData) {
  //     console.log(selectedHomeData);
  //   }

  const handleFetchMoreHomes = async () => {
    try {
      const fetchHomesResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchexclhomes?excludedHomeId=${selectedHomeData._id}`
      );
      if (fetchHomesResponse.status === 200) {
        setMoreHomes(fetchHomesResponse.data);
      }
    } catch (error) {
      console.error("Failed to fetch more homes from the website !");
    }
  };

  useEffect(() => {
    handleFetchMoreHomes();
  }, [selectedHomeData]);

  // if (moreHomes) {
  //   console.log(moreHomes);
  // }

  const handleChangeInHomes = (homeData) => {
    localStorage.setItem("selectedHomeData", JSON.stringify(homeData));
    window.location.reload();
    handleFetchMoreHomes();
  };

  return (
    <>
      <div id="CustHomeSBContainer">
        <p id="CustHomeSBhead">Other Homes You Can Explore</p>
        <div id="CustHomeOHcontainer">
          {moreHomes.length > 0 ? (
            moreHomes.map((home) => (
              <div
                key={home._id}
                id="SBhomeBG"
                onClick={() => handleChangeInHomes(home)}
              >
                <span id="locationLogoSBBG">
                  <FontAwesomeIcon icon={faMapMarkerAlt} />
                </span>
                <p id="SBhomeRentP">₹ {home.rentPerRoom} / 24 hr</p>
                <p id="SBhomeCityP">{home.address?.city}</p>
                <button id="SBhomeNavbtn">
                  <FontAwesomeIcon icon={faChevronRight} />
                </button>
              </div>
            ))
          ) : (
            <p id="noHF">No Data</p>
          )}
        </div>
        <button id="navCusSelHome" onClick={onPrevBtnClick}>
          Previous Page
        </button>
        <button id="navCusSelRes" onClick={onResbtnClick}>
          Select Restaurent
        </button>
      </div>
    </>
  );
}

export default CusHomePageSB;
