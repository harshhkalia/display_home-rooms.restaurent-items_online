import "./LoginsuccessfullOwner.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginsuccessfullPageOwner = () => {
  const [data, setData] = useState({
    streetName: "",
    cityName: "",
    zipCodeInfo: "",
    personName: "",
    personNumber: "",
    personEmail: "",
    noOfRoomsCount: "",
    rentPerRoom: "",
    availableRoomsCount: "",
    descriptionInfo: "",
  });
  const [selectedFiles, setSelectedFiles] = useState(null);

  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setSelectedFiles(files);
  };

  const handleProceedFurther = async () => {
    const formData = new FormData();
    formData.append("streetName", data.streetName);
    formData.append("cityName", data.cityName);
    formData.append("zipCodeInfo", data.zipCodeInfo);
    formData.append("roomsCount", data.noOfRoomsCount);
    formData.append("rentCount", data.rentPerRoom);
    formData.append("availableRooms", data.availableRoomsCount);
    formData.append("descriptionProvided", data.descriptionInfo);
    formData.append("personName", data.personName);
    formData.append("personNumber", data.personNumber);
    formData.append("personEmail", data.personEmail);

    if (selectedFiles) {
      selectedFiles.forEach((file) => {
        formData.append("imagesofHome", file);
      });
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}savehomedetails`,
        formData
      );
      if (response.status === 201) {
        window.alert(response.data.message);
        const homeInfo = response.data.data;
        localStorage.setItem("homeInfo", JSON.stringify(homeInfo));
        navigate("/yourhomedashboard");
      }
    } catch (error) {
      if (error.response && error.response.data.message) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to process further due to : ", error);
        window.alert(
          "Something went wrong while processing further, please try again!"
        );
      }
    }
  };

  const cancelAndlogOutUser = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/");
    setData({
      streetName: "",
      cityName: "",
      zipCodeInfo: "",
      personName: "",
      personNumber: "",
      personEmail: "",
      noOfRoomsCount: "",
      rentPerRoom: "",
      availableRoomsCount: "",
      descriptionInfo: "",
    });
    setSelectedFiles(null);
  };

  return (
    <>
      <div id="DACBG">
        <div id="dataAddingContainerHO">
          <div id="rectanglePFimgsBox">
            <span id="PFlogo">
              <FontAwesomeIcon icon={faUserPlus} />
            </span>
          </div>
          <label htmlFor="imageUpload" className="image-upload-label">
            Upload Some Images
            <input
              type="file"
              accept="image/*"
              id="imageUpload"
              className="image-upload"
              multiple
              onChange={handleFileChange}
            />
          </label>
          <p id="locationInputHead">Enter Required Location Data</p>
          <div id="locationElementsInputContainer">
            <input
              type="text"
              id="streetInputBox"
              placeholder="Enter street name"
              value={data.streetName}
              name="streetName"
              onChange={handleChange}
            />
            <input
              type="text"
              id="cityInputBox"
              placeholder="Enter city name"
              value={data.cityName}
              name="cityName"
              onChange={handleChange}
            />
            <input
              type="number"
              id="zipCodeInputBox"
              placeholder="Enter Zip Code"
              value={data.zipCodeInfo}
              name="zipCodeInfo"
              onChange={handleChange}
            />
          </div>
          <div id="DACSL"></div>
          <p id="contactInputHead">Enter Your Details</p>
          <div id="contactDataContainer"></div>
          <input
            type="text"
            id="nameInputBox"
            placeholder="Enter name"
            value={data.personName}
            name="personName"
            onChange={handleChange}
          />
          <input
            type="number"
            id="numberInputBox"
            placeholder="Enter number"
            value={data.personNumber}
            name="personNumber"
            onChange={handleChange}
          />
          <input
            type="email"
            id="emailInputBox"
            placeholder="Enter email"
            value={data.personEmail}
            name="personEmail"
            onChange={handleChange}
          />
          <div id="DACHL"></div>
          <p id="homeDataInputHead">Enter Other Required Details</p>
          <div id="homeDataContainer">
            <input
              type="number"
              id="noOfRoomsInputBox"
              placeholder="Enter number of rooms"
              value={data.noOfRoomsCount}
              name="noOfRoomsCount"
              onChange={handleChange}
            />
            <input
              type="number"
              id="rentperroomInputBox"
              name="rentPerRoom"
              placeholder="Enter rent/room"
              onChange={handleChange}
              value={data.rentPerRoom}
            />
            <input
              type="number"
              id="availableRoomsInputBox"
              name="availableRoomsCount"
              placeholder="Enter available rooms count"
              value={data.availableRoomsCount}
              onChange={handleChange}
            />
            <textarea
              id="homeDescriptionInputBox"
              name="descriptionInfo"
              placeholder="Enter description about your home and rooms"
              value={data.descriptionInfo}
              onChange={handleChange}
            ></textarea>
          </div>
          <button
            id="saveHomeDetailsBtn"
            type="button"
            onClick={handleProceedFurther}
          >
            Save And Proceed
          </button>
          <button id="cancelhomeDetailsBtn" onClick={cancelAndlogOutUser}>
            Cancel and log-out
          </button>
        </div>
      </div>
    </>
  );
};

export default LoginsuccessfullPageOwner;
