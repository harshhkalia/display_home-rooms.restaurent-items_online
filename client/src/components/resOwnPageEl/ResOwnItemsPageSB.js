import "./ResOwnItemsPageSB.css";
import { useEffect, useState } from "react";
import axios from "axios";

const ResOwnItemsPageSB = ({ setSelectedSubItem }) => {
  const [restaurentDetails, setRestaurentDetails] = useState(null);
  const [fetchedResItems, setFetchedResItems] = useState([]);

  useEffect(() => {
    const fetchRestaurentData = () => {
      const restaurent = JSON.parse(localStorage.getItem("restaurent"));
      if (restaurent) {
        setRestaurentDetails(restaurent);
      }
    };
    fetchRestaurentData();
  }, []);

  useEffect(() => {
    const handleFetchRestaurentItems = async () => {
      try {
        const response = await axios.get(
          `${process.env.REACT_APP_API_URL}fetchallitems/${restaurentDetails?._id}`
        );
        if (response.status === 200) {
          setFetchedResItems(response.data.items);
        } else {
          console.error(
            "Failed to get all items of this restaurent because of some unknown error!"
          );
        }
      } catch (error) {
        console.error(
          "Failed to get all items of this restaurent due to an error."
        );
      }
    };
    handleFetchRestaurentItems();
  }, [restaurentDetails?._id]);

  return (
    <>
      <div id="ItemsSBContainer">
        {fetchedResItems.length > 0 ? (
          fetchedResItems.map((item) => (
            <div key={item._id}>
              <div id="resItemContainer">
                <h3 id="fetchedItemCategoryName">{item.name}</h3>
                <p id="fetchedCategoryADDtime">
                  {new Date(item.createdAt).toLocaleString()}
                </p>
                <div id="itemsSL"></div>
                {item.subItems.length > 0 ? (
                  <>
                    <p id="subItemHeading">All items that you added!</p>
                    <div id="fetchedSubItemsContainer">
                      {item.subItems.map((subItem) => (
                        <div key={subItem._id}>
                          <div
                            id="fetchedSubitemBackground"
                            onClick={() => setSelectedSubItem(subItem)}
                          >
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
                            <p id="moreDetailsLine">More Details</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p id="noRestaurentItemAvailable">No Item Has Been Added!</p>
                )}
              </div>
            </div>
          ))
        ) : (
          <p id="noResItems">No Items Found For Your Restaurant!</p>
        )}
      </div>
    </>
  );
};

export default ResOwnItemsPageSB;
