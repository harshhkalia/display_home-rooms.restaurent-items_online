import react, { useEffect, useState } from "react";
import "./LoginsuccessfullOwnerR.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginsuccessfullRowner = () => {
  const [data, setData] = useState({
    restaurentname: "",
    restaurentlocation: "",
  });
  const [user, setUser] = useState({});
  const [restaurentpfp, setRestaurentPfp] = useState(null);
  const [previewData, setPreviewData] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      const user = JSON.parse(localStorage.getItem("user"));
      setUser(user);
    };
    if (user) {
      fetchUserData();
    }
  }, [user?._id]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setRestaurentPfp(selectedFile);
    }
  };

  const handleSaveRestaurentInfo = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("restaurentname", data.restaurentname);
    formData.append("restaurentlocation", data.restaurentlocation);
    formData.append("restaurentowner", user?._id);
    formData.append("restaurentpfp", restaurentpfp);

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}saverestaurentinfo`,
        formData
      );
      if (response.status === 201) {
        window.alert(response.data.message);
        setData({
          restaurentname: "",
          restaurentlocation: "",
        });
        setRestaurentPfp(null);
        setPreviewData([response.data.restaurent]);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to save the data due to : ", error);
        window.alert("Failed to save the data, please try again!!");
      }
    }
  };

  const handleReEnterDetails = async (restaurentId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}deleterestaurentdetails/${restaurentId}`
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        setPreviewData([]);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to delete the entered details due to : ", error);
        window.alert("Failed to delete entered details, please try again!!");
      }
    }
  };

  const handleCancelActionPress = async (userId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}eraserestaurentdata/${userId}`
      );
      if (response.status === 200) {
        window.alert(response.data.message);
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
        setPreviewData([]);
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
          "Failed to cancel formation of restaurent details due to : ",
          error
        );
        window.alert(
          "Failed to cancel formation of restaurent, please try again!!"
        );
      }
    }
  };

  const proceedToHomeDashboard = async (restaurentId) => {
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}restaurentownerdashboard/${restaurentId}`
      );
      if (response.status === 200) {
        const restaurent = response.data.restaurent;
        localStorage.setItem("restaurent", JSON.stringify(restaurent));
        navigate("/restaurentownerdashboard");
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        window.alert(error.response.data.message);
      } else {
        console.error("Failed to proceed further due to : ", error);
        window.alert("Failed to proceed further, please try again!!");
      }
    }
  };

  return (
    <>
      <div id="restaurentOwnerpage">
        <div id="uploadrestaurentDetails">
          <div id="imageDummyContainer">
            <span id="imageLogo">
              {" "}
              <FontAwesomeIcon icon={faUserPlus} />
            </span>
          </div>
          <form id="saveRestaurentDetails" onSubmit={handleSaveRestaurentInfo}>
            <input
              type="text"
              id="restaurentnameInput"
              placeholder="Enter restaurent name"
              value={data.restaurentname}
              name="restaurentname"
              onChange={handleInputChange}
              disabled={previewData.length > 0}
              required
            />
            <label htmlFor="file-upload" className="custom-file-upload">
              Upload Image
            </label>
            <input
              id="file-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
              disabled={previewData.length > 0}
            />
            <input
              type="text"
              id="restaurentlocationInput"
              placeholder="Enter restaurent location"
              value={data.restaurentlocation}
              onChange={handleInputChange}
              name="restaurentlocation"
              disabled={previewData.length > 0}
              required
            />
            <button
              id="saverestaurentInfo"
              type="submit"
              disabled={previewData.length > 0}
            >
              Save Info
            </button>
          </form>
          <button
            id="cancelCreatingRestaurent"
            onClick={() => handleCancelActionPress(user._id)}
          >
            Cancel Action
          </button>
          <h4 id="restaurentContainerNote">
            Saving info will create your restaurent data centre
          </h4>
        </div>
        <div id="middlePageLine"></div>
        <div id="displayrestaurentdetails">
          {previewData.length > 0 ? (
            previewData.map((item) => (
              <div key={item._id}>
                <div id="dataBackground">
                  <img
                    id="restaurentPFP"
                    src={`http://localhost:8081/restaurentUploads/${item.restaurentpfp}`}
                    alt="Restaurant Image"
                  />
                  <h4 id="restaurentName">{`${item.restaurentname}`}</h4>
                </div>
                <h4 id="dataHeading">Would you like to continue</h4>
                <h4 id="dataHeading2">with this profile ?</h4>
                <button
                  id="proceedButton"
                  onClick={() => proceedToHomeDashboard(item._id)}
                >
                  Yes, proceed{" "}
                </button>
                <button
                  id="re-enterDetailsButton"
                  onClick={() => handleReEnterDetails(item._id)}
                >
                  Re-enter details
                </button>
              </div>
            ))
          ) : (
            <p id="noRestaurentData">
              You will get a preview of your restaurent profile in this
              container after saving above info{" "}
            </p>
          )}
        </div>
      </div>
    </>
  );
};

export default LoginsuccessfullRowner;
