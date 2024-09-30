import "./LoginCustomer.css";
import react, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const LoginsuccessfullPageCustomer = () => {
  const [restaurentCount, setRestaurentCount] = useState(0);
  const [homesCount, setHomesCount] = useState(0);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchResCount = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchResCount`
        );
        setRestaurentCount(response.data);
      } catch (error) {
        console.error("Failed to fetch restaurent count due to : ", error);
      }
    };
    fetchResCount();
  }, []);

  const handleFetchNoOfHomes = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchTotalHomesOnSite`
      );
      if (response.status === 200) {
        setHomesCount(response.data.data);
      }
    } catch (error) {
      console.error(
        "Failed to fetch number of homes on website due to : ",
        error
      );
    }
  };

  useEffect(() => {
    handleFetchNoOfHomes();
  }, []);

  const handleShowRestaurents = () => {
    navigate("/viewallrestaurents");
  };

  const handleShowVillas = () => {
    navigate("/viewallvillas");
  };

  return (
    <>
      <div id="customerLoginPage">
        <div id="detailsContainer">
          <div id="hotelImgContainer">
            <img
              id="hotelImage"
              src="http://localhost:8081/public/images/hotelImage.jpg"
              alt="Hotel Image"
            />
          </div>
          <div id="restaurentImgContainer">
            <img
              id="restaurentImage"
              src="http://localhost:8081/public/images/restaurentImage.jpg"
              alt="Restaurent Image"
            />
          </div>
          <button id="viewHotels" onClick={handleShowVillas}>
            View All Homes
          </button>
          <button id="viewRestaurents" onClick={handleShowRestaurents}>
            View All Restaurents
          </button>
        </div>
        <div id="numberCountContainer">
          <h4 id="numberCountHeading">DATA-NOTE</h4>
          <p id="hotelCount">Total number of homes we have : {homesCount} </p>
          <p id="restaurentCount">
            Total number of restaurents we have : {restaurentCount}{" "}
          </p>
        </div>
      </div>
    </>
  );
};

export default LoginsuccessfullPageCustomer;
