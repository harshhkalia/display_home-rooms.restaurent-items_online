import { useEffect, useState } from "react";
import "./CustomerViewVillas.css";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ViewVillas = () => {
  const [redirectToRes, setRedirectToRes] = useState(false);
  const [availableHomes, setAvailableHomes] = useState([]);
  const [searchHome, setSearchHome] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  const [searchModal, setSearchModal] = useState(false);
  const [isSearch, setIsSearch] = useState(false);

  const navigate = useNavigate();

  const navToRestaurents = () => {
    setRedirectToRes(true);
    setTimeout(() => {
      setRedirectToRes(false);
      navigate("/viewallrestaurents");
    }, 2000);
  };

  const handleLogUserOut = () => {
    try {
      const confirmation = window.confirm(
        "This will take you to login page. Press OK to continue"
      );
      if (confirmation) {
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        navigate("/");
      }
    } catch (error) {
      console.error("Failed to logout the user due to : ", error);
      window.alert("Failed to logout the user, please try again!!");
    }
  };

  const handleFetchAllHomes = async () => {
    try {
      const fetchResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchhomesfromDB`
      );
      if (fetchResponse.status === 200) {
        setAvailableHomes(fetchResponse.data.data);
      }
    } catch (error) {
      console.error("Failed to load all homes from backend due to : ", error);
    }
  };

  useEffect(() => {
    handleFetchAllHomes();
  }, []);

  // if (availableHomes) {
  //   console.log("Homes that are fetched ", availableHomes);
  // }

  const handleEmailUser = (HD) => {
    const recipientEmail = HD.contactInfo?.email;
    const subject = "Enter subject";
    const body = "What you want to say with this mail";

    const mailToLink = `mailto:${recipientEmail}?subject=${encodeURIComponent(
      subject
    )}&body=${encodeURIComponent(body)}`;

    window.open(mailToLink, "_blank");
  };

  const handleShowSearchModal = () => {
    setSearchModal(true);
    setIsSearch(true);
  };

  const handleHideSearchModal = () => {
    setSearchModal(false);
    setIsSearch(false);
    setSearchHome("");
    setSearchedData([]);
  };

  const handleFetchHomesByBudget = async () => {
    try {
      const fetchHomesResponse = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchhomesbybudget?budget=${searchHome}`
      );
      if (fetchHomesResponse.status === 200) {
        setSearchedData(fetchHomesResponse.data);
      }
    } catch (error) {
      console.error(
        "Failed to fetch homes with entered budget due to : ",
        error
      );
    }
  };

  useEffect(() => {
    handleFetchHomesByBudget();
  }, [isSearch]);

  // if (searchedData) {
  //   console.log("The searched data is ", searchedData);
  // }

  const handleExploreHomePage = (data) => {
    navigate("/selectedHome");
    localStorage.setItem("selectedHomeData", JSON.stringify(data));
  };

  return (
    <>
      <div id="villaPageBc">
        {availableHomes.length > 0 ? (
          availableHomes.map((HD) => (
            <div key={HD._id} id="HDcontainer">
              <div id="HDimgContainer">
                {HD.imagesOfHome.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:8081/homeimages/${image}`}
                    alt={`Image of ${HD.address.street}`}
                    id="HDimages"
                  />
                ))}
              </div>
              <p id="HDaddressStreetName">Street Name : {HD.address?.street}</p>
              <p id="HDaddressCityName">City Name : {HD.address?.city}</p>
              <p id="HDcontactInfoEmail">
                Contact Email : {HD.contactInfo?.email}{" "}
                <button
                  id="contactEmailBtn"
                  onClick={() => handleEmailUser(HD)}
                >
                  Email User
                </button>
              </p>
              <button
                id="HDviewhomeBtn"
                onClick={() => handleExploreHomePage(HD)}
              >
                Explore Home
              </button>
            </div>
          ))
        ) : (
          <p id="noAvailableHomes">Oops, no homes are there to explore.</p>
        )}
      </div>
      <h4 id="villaPageHead">
        Select Homes Of Which You Wanna Explore Details
      </h4>
      <input
        type="text"
        id="searchVillaInput"
        placeholder="Search using room budgets"
        value={searchHome}
        onChange={(e) => setSearchHome(e.target.value)}
      />
      <button id="searchVillaButton" onClick={handleShowSearchModal}>
        Find Homes
      </button>
      <button id="viewOtherRestaurents" onClick={navToRestaurents}>
        View Some Restaurents
      </button>
      <button id="logoutButtonofVilla" onClick={handleLogUserOut}>
        Log Me Out
      </button>
      {redirectToRes && (
        <h4 id="redirectingAlert">Redirecting you to another page...</h4>
      )}
      {searchModal && (
        <>
          <div id="modalBackground">
            <div id="searchModalBackground">
              <p id="inputBudgetHead">
                Showing all available homes under ₹ {searchHome}
              </p>
              <div id="fetchedHomesContainer">
                {searchedData.length > 0 ? (
                  searchedData.map((data) => (
                    <div key={data._id} id="SDbackground">
                      <div id="SDimgContainer">
                        {data.imagesOfHome.map((image, index) => (
                          <img
                            key={index}
                            src={`http://localhost:8081/homeimages/${image}`}
                            alt={`Image of ${data.address.street}`}
                            id="SDimages"
                          />
                        ))}
                      </div>
                      <p id="SDaddressStreetName">
                        Street Name : {data.address?.street}
                      </p>
                      <p id="SDaddressCityName">
                        City Name : {data.address?.city}
                      </p>
                      <p id="HDcontactInfoEmail">
                        Contact Email : {data.contactInfo?.email}{" "}
                        <button
                          id="contactEmailBtn"
                          onClick={() => handleEmailUser(data)}
                        >
                          Email User
                        </button>
                      </p>
                      <button
                        id="HDviewhomeBtn"
                        onClick={() => handleExploreHomePage(data)}
                      >
                        Explore Home
                      </button>
                    </div>
                  ))
                ) : (
                  <p id="noSDF">Sorry, no home found within this budget!!</p>
                )}
              </div>
              <button id="closeFHCbtn" onClick={handleHideSearchModal}>
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewVillas;
