import "./CustomerViewRestaurents.css";
import react, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot } from "@fortawesome/free-solid-svg-icons";

const ViewRestaurents = () => {
  const [showRedirectingAlert, setRedirectingAlert] = useState(false);
  const [restaurents, setRestaurents] = useState([]);
  const [restaurentItem, setRestaurentItem] = useState(null);
  const [fetchedRestaurentItem, setFetchedRestaurentItem] = useState(null);
  const [searchRestaurentModal, setSearchRestaurentModal] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const [fetchedRestaurents, setFetchedRestaurents] = useState([]);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchallRestaurents = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchallrestaurents`
        );
        setRestaurents(response.data);
      } catch (error) {
        console.error("Failed to fetch all restaurents due to : ", error);
      }
    };
    fetchallRestaurents();
  }, []);

  useEffect(() => {
    if (restaurents.length > 0) {
      const ids = restaurents.map((restaurent) => restaurent._id);

      const fetchRestItem = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}fetchresitems`,
            {
              restaurentIds: ids,
            }
          );
          setRestaurentItem(response.data.RestaurentItem);
        } catch (error) {
          console.error("Failed to fetch items for the restaurent : ", error);
        }
      };
      fetchRestItem();
    }
  }, [restaurents]);

  useEffect(() => {
    if (fetchedRestaurents.length > 0) {
      const ids = fetchedRestaurents.map(
        (fetchedRestaurent) => fetchedRestaurent?._id
      );
      // console.log(ids);

      const fetchedRestaurentItem = async () => {
        try {
          const response = await axios.post(
            `${process.env.REACT_APP_API_URL}fetchresitems`,
            {
              restaurentIds: ids,
            }
          );
          const fetchItems = response.data.RestaurentItem;
          setFetchedRestaurentItem(fetchItems);
        } catch (error) {
          console.error(
            "Failed to fetch items for searched category : ",
            error
          );
        }
      };
      fetchedRestaurentItem();
    }
  }, [fetchedRestaurents]);

  const handleLogOut = () => {
    try {
      const confirmation = window.confirm(
        "This will take you to login page. Press OK to continue ?"
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

  const navToVillas = () => {
    setRedirectingAlert(true);
    setTimeout(() => {
      setRedirectingAlert(false);
      navigate("/viewallvillas");
    }, 2000);
  };

  const handleSearchByCategory = async () => {
    try {
      const response = await axios.get(
        `${process.env.REACT_APP_API_URL}fetchresbycategory`,
        {
          params: {
            name: searchInput,
          },
        }
      );
      if (response.status === 200) {
        setFetchedRestaurents(response.data.restaurents);
        setSearchRestaurentModal(true);
      } else {
        setFetchedRestaurents([]);
        setSearchRestaurentModal(false);
      }
    } catch (error) {
      console.error(
        "Failed to fetch restaurents based on search input due to : ",
        error
      );
    }
  };

  const handleCloseSearchModal = () => {
    setSearchRestaurentModal(false);
    setFetchedRestaurents([]);
    setSearchInput("");
  };

  const handleSelectedItemPage = (id) => {
    navigate("/selectedrestaurentitems");
    localStorage.setItem("selectedRestaurentId", JSON.stringify(id));
  };

  return (
    <>
      <div id="restPageBC">
        <div id="displayRestaurentsContainer">
          {restaurents?.length > 0 ? (
            restaurents.map((restaurent) => {
              const itemsForRestaurent = (restaurentItem || [])
                .map((item) => item?.$__parent?.items || [])
                .flat()
                .filter((item) => item.restaurentId === restaurent._id);

              return (
                <div key={restaurent._id}>
                  <div id="restaurentDBG">
                    <img
                      id="restaurentFetchedPFP"
                      src={`http://localhost:8081/restaurentUploads/${restaurent?.restaurentpfp}`}
                      alt="Restaurent PFP"
                    />
                    <div id="restaurentInformationContainer">
                      <p id="restaurentFetchedName">
                        {restaurent?.restaurentname}
                      </p>
                      <p id="restaurentFetchedLocation">
                        <span id="locationLogoRes">
                          <FontAwesomeIcon icon={faLocationDot} />
                        </span>
                        {restaurent?.restaurentlocation}
                      </p>

                      {itemsForRestaurent?.length > 0 ? (
                        itemsForRestaurent.map((item) => (
                          <div key={item._id}>
                            <p id="restaurentFetchedItemName">
                              Currently Selling: {item?.name}
                            </p>
                            <p id="furtherIncludeL">Further Include</p>
                            <div id="subitemDisplayContainer">
                              {item?.subItems?.length > 0 ? (
                                item.subItems.map((subItem) => (
                                  <ul key={subItem._id}>
                                    <li id="subitemFetchedName">
                                      {subItem?.name}
                                    </li>
                                  </ul>
                                ))
                              ) : (
                                <p id="noSubItemFetched">
                                  No Item Has Been Added Yet!
                                </p>
                              )}
                            </div>
                            <button
                              id="exploreRestaurent"
                              onClick={() =>
                                handleSelectedItemPage(restaurent._id)
                              }
                            >
                              Explore Items
                            </button>
                          </div>
                        ))
                      ) : (
                        <p id="restaurentNoItemAdded">
                          No Item Has Been Uploaded!
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <p id="noRestaurentFetched">Sorry, No Restaurent Found!</p>
          )}
        </div>
      </div>
      <h4 id="restPageHead">
        Select Restaurent You Wanna Purchase Products Through
      </h4>
      <input
        type="text"
        id="searchResInput"
        placeholder="Search using item category"
        value={searchInput}
        onChange={(e) => setSearchInput(e.target.value)}
      />
      <button id="searchResButton" onClick={handleSearchByCategory}>
        Find Restaurents
      </button>
      <button id="viewOtherVillas" onClick={navToVillas}>
        View Some Homes
      </button>
      <button id="logoutButtonCustomer" onClick={handleLogOut}>
        Log Me Out
      </button>
      {showRedirectingAlert && (
        <h4 id="redirectingAlert">Redirecting you to another page...</h4>
      )}
      {searchRestaurentModal && (
        <>
          <div id="modalBackground">
            <div id="searchResModal">
              <h4 id="searchResModalHead">
                These Restaurents Actively Selling "{searchInput}"
              </h4>
              <button id="closeSearchModal" onClick={handleCloseSearchModal}>
                Close This Container
              </button>
              <div id="displaySearchedRestaurentsContainer">
                {fetchedRestaurents.length > 0 ? (
                  fetchedRestaurents.map((restaurent) => {
                    const itemsForRestaurent = (fetchedRestaurentItem || [])
                      .map((item) => item?.$__parent?.items || [])
                      .flat()
                      .filter((item) => item.restaurentId === restaurent._id);

                    // console.log(itemsForRestaurent);

                    return (
                      <div key={restaurent._id}>
                        <div id="fetchedRestaurentDBG">
                          <img
                            id="fetchedRestaurentPFP"
                            src={`http://localhost:8081/restaurentUploads/${restaurent?.restaurentPFP}`}
                            alt="Restaurent PFP"
                          />
                          <div id="fetchedRestaurentInformationContainer">
                            <p id="restaurentFetchedName">
                              {restaurent?.restaurentName}
                            </p>
                            <p id="restaurentFetchedLocation">
                              <span id="locationLogoRes">
                                <FontAwesomeIcon icon={faLocationDot} />
                              </span>
                              {restaurent?.restaurentLocation}
                            </p>
                          </div>

                          {itemsForRestaurent?.length > 0 ? (
                            itemsForRestaurent.map((item) => (
                              <div key={item._id}>
                                <p id="fetchedRestaurentItemName">
                                  Currently Selling: {item?.name}
                                </p>
                                <p id="fetchedRestaurentFurtherIL">
                                  Further Include
                                </p>
                                <div id="subitemDisplayContainerFR">
                                  {item?.subItems?.length > 0 ? (
                                    item.subItems.map((subItem) => (
                                      <ul key={subItem._id}>
                                        <li id="subitemFetchedName">
                                          {subItem?.name}
                                        </li>
                                      </ul>
                                    ))
                                  ) : (
                                    <p id="noSubItemFetched">
                                      No Item Has Been Added Yet!
                                    </p>
                                  )}
                                </div>
                                <button
                                  id="exploreRestaurentFR"
                                  onClick={() =>
                                    handleSelectedItemPage(restaurent._id)
                                  }
                                >
                                  Explore Items
                                </button>
                              </div>
                            ))
                          ) : (
                            <p id="restaurentNoItemAdded">
                              No Item Has Been Uploaded!
                            </p>
                          )}
                        </div>
                        <p id="noMoreRestaurentBelow">
                          No More Restaurent Below !
                        </p>
                      </div>
                    );
                  })
                ) : (
                  <p id="noRestaurentFetched">
                    No Restaurant Found For This Category!
                  </p>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
};

export default ViewRestaurents;
