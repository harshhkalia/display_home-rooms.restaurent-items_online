import resItemModel from "../models/RestaurentItems.js";
import orderModal from "../models/RestaurentOrders.js";
import RestaurentOwnerNotification from "../models/RestaurentOwner.js";
import restaurentModel from "../models/Restaurents.js";

export const createcategory = async (req, res) => {
  const { restaurentId } = req.params;
  const { category } = req.body;
  try {
    const restaurent = await restaurentModel.findById(restaurentId);
    if (!restaurent) {
      return res
        .status(404)
        .json({ message: "Restaurent not found to add new category." });
    }

    const existingItems = await resItemModel.findOne({
      restaurentId: restaurentId,
    });
    if (existingItems && existingItems.items.length > 0) {
      return res.status(400).json({
        message:
          "Your restaurant already has an Item. Please remove them first to add a new category!",
      });
    }

    const newCategory = await resItemModel({
      restaurentId: restaurentId,
      items: [
        {
          name: category,
          restaurentId: restaurentId,
        },
      ],
    });

    const restaurentOwnerId = restaurent.restaurentowner;
    const restaurentName = restaurent.restaurentname;

    const restOwnerNotification = new RestaurentOwnerNotification({
      restOwnerId: restaurentOwnerId,
      restaurentName: restaurentName,
      type: "category_item_added",
      message: `${category} category has been added to your restaurent items!`,
    });

    const savedCategory = await newCategory.save();
    if (savedCategory) {
      await restOwnerNotification.save();
      return res.status(201).json({
        message:
          "The category has been saved successfully that is now associated with your restaurent",
        resCategory: savedCategory,
      });
    }
  } catch (error) {
    console.error(
      "Failed to save new category with your restaurent due to : ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to save new category with your restaurent, please try again.",
    });
  }
};

export const fetchcategories = async (req, res) => {
  const { restaurentId } = req.params;
  try {
    const restaurentItems = await resItemModel
      .findOne({ restaurentId: restaurentId })
      .select("items");

    if (
      !restaurentItems ||
      !restaurentItems.items ||
      restaurentItems.items.length === 0
    ) {
      return res.status(404).json({
        message: "This restaurant does not have any categories of items.",
      });
    }

    const uniqueCategories = restaurentItems.items.map((item) => ({
      name: item.name,
      timestamp: item.createdAt,
      relatedId: item._id,
    }));

    const documentId = restaurentItems._id;

    res
      .status(200)
      .json({ categories: uniqueCategories, documentId: documentId });
  } catch (error) {
    console.error(
      "Failed to get the categories for this restaurant due to: ",
      error
    );
    return res
      .status(500)
      .json({ message: "Failed to get the categories for this restaurant" });
  }
};

export const deletecategory = async (req, res) => {
  const { itemId } = req.params;
  try {
    const itemFound = await resItemModel
      .findOne({ "items._id": itemId })
      .populate({
        path: "restaurentId",
        model: "restaurents",
        populate: {
          path: "restaurentowner",
          model: "user_data",
        },
      });
    if (!itemFound) {
      return res
        .status(404)
        .json({ message: "Item with this ID does not found." });
    }

    const restaurentOwnerId = itemFound.restaurentId.restaurentowner;
    const restaurentName = itemFound.restaurentId.restaurentname;

    const item = itemFound.items.id(itemId);
    const itemName = item ? item.name : "Unknown Item";

    const restOwnerNotification = new RestaurentOwnerNotification({
      restOwnerId: restaurentOwnerId,
      restaurentName: restaurentName,
      type: "category_item_removed",
      message: `${itemName} category has been removed from your restaurent items!`,
    });

    const successfullDelete = await resItemModel.updateOne(
      { "items._id": itemId },
      { $pull: { items: { _id: itemId } } }
    );

    if (successfullDelete.modifiedCount > 0) {
      const updatedDocument = await resItemModel.findById(itemFound._id);
      if (updatedDocument.items.length === 0) {
        await resItemModel.findByIdAndDelete(itemFound._id);
        await restOwnerNotification.save();
        return res
          .status(200)
          .json({ successMessage: "Document removed as well!!" });
      }
      return res.status(200).json({
        message: "The Uploaded category has been removed successfully!",
      });
    } else {
      return res
        .status(500)
        .json({ message: "Unable to remove the category, please try again" });
    }
  } catch (error) {
    console.error("Failed to delete category of the item due to : ", error);
    return res
      .status(500)
      .json({ message: "Unable to remove the category, please try again" });
  }
};

export const insertanitem = async (req, res) => {
  const { insertionCategoryId } = req.params;
  const { itemName, itemPrice, itemQuantity, itemDescription, restaurentId } =
    req.body;
  const itemImages = req.files ? req.files.map((file) => file.filename) : [];
  try {
    const restaurentDocument = await resItemModel
      .findOne({
        restaurentId: restaurentId,
      })
      .populate({
        path: "restaurentId",
        model: "restaurents",
        populate: {
          path: "restaurentowner",
          model: "user_data",
        },
      });

    if (!restaurentDocument) {
      return res.status(404).json({ message: "Restaurent not founded" });
    }
    const itemAvailable = restaurentDocument.items.id(insertionCategoryId);
    if (!itemAvailable) {
      return res.status(404).json({
        message: "Item for this restaurent not found or did not uploaded yet.",
      });
    }
    const newSubItem = {
      name: itemName,
      price: itemPrice,
      description: itemDescription,
      quantity: itemQuantity,
      subitemImages: itemImages,
      // restaurentId: restaurentId,
    };

    itemAvailable.subItems.push(newSubItem);

    const restaurentOwnerId = restaurentDocument.restaurentId.restaurentowner;
    const restaurentName = restaurentDocument.restaurentId.restaurentname;

    const restOwnerNotification = new RestaurentOwnerNotification({
      restOwnerId: restaurentOwnerId,
      restaurentName: restaurentName,
      type: "new_item_added",
      message: `${itemName} has been added to your restaurent items related to ${itemAvailable.name} category!`,
    });

    const saveItem = await restaurentDocument.save();
    if (saveItem) {
      await restOwnerNotification.save();
      return res.status(201).json({
        message: "The item has been inserted successfully to the list.",
        addedItem: saveItem,
      });
    }
  } catch (error) {
    console.error("Failed to insert item to list due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to insert item to list, please try again." });
  }
};

export const fetchallitems = async (req, res) => {
  const { restaurentId } = req.params;
  try {
    const restaurentFound = await resItemModel.findOne({
      restaurentId: restaurentId,
    });
    if (!restaurentFound) {
      return res
        .status(404)
        .json({ message: "Restaurent with the included ID does not found." });
    }
    const fetchItems = restaurentFound.items;
    if (fetchItems.length === 0) {
      return res
        .status(404)
        .json({ message: "Items does not found for this restaurent." });
    }
    return res
      .status(200)
      .json({ message: "All items fetched successfully!", items: fetchItems });
  } catch (error) {
    console.error(
      "Failed to fetch all items of this restaurent due to : ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to fetch all items of this restaurent due to some error.",
    });
  }
};

export const updateselectedItem = async (req, res) => {
  const { itemId } = req.params;
  const {
    selectedItemName,
    selectedItemPrice,
    selectedItemQuantity,
    selectedItemDescription,
  } = req.body;
  const changedItemImages = req.files
    ? req.files.map((file) => file.filename)
    : [];

  try {
    const findTheItemAndUpdate = await resItemModel.findOneAndUpdate(
      { "items.subItems._id": itemId },
      {
        $set: {
          "items.$.subItems.$[subItem].name": selectedItemName,
          "items.$.subItems.$[subItem].price": selectedItemPrice,
          "items.$.subItems.$[subItem].quantity": selectedItemQuantity,
          "items.$.subItems.$[subItem].description": selectedItemDescription,
          "items.$.subItems.$[subItem].subitemImages": changedItemImages,
        },
      },
      {
        arrayFilters: [{ "subItem._id": itemId }],
        new: true,
        runValidators: true,
      }
    );

    if (!findTheItemAndUpdate) {
      return res
        .status(404)
        .json({ message: "The item was not found for updating." });
    }

    return res.status(200).json({
      message: "The item has been updated successfully!",
      updatedItem: findTheItemAndUpdate,
    });
  } catch (error) {
    console.error("Failed to update the selected item due to:", error);
    return res.status(500).json({
      message: "Failed to update the selected item, please try again.",
    });
  }
};

export const deleteselectedItem = async (req, res) => {
  const { itemId } = req.params;
  try {
    // Find the document first
    const delItem = await resItemModel
      .findOne({
        "items.subItems._id": itemId,
      })
      .populate({
        path: "restaurentId",
        model: "restaurents",
        populate: {
          path: "restaurentowner",
          model: "user_data",
        },
      });

    if (!delItem) {
      return res
        .status(404)
        .json({ message: "Failed to find the item as it is not found." });
    }

    let itemName = "Unknown Item";
    let categoryName = "Unknown Category";
    delItem.items.forEach((item) => {
      if (item.subItems && item.subItems.length > 0) {
        item.subItems.forEach((subItem) => {
          if (subItem._id.toString() === itemId) {
            itemName = subItem.name;
            categoryName = item.name;
          }
        });
      } else {
        console.log("No subItems found for item:", item.name);
      }
    });

    const updateResult = await resItemModel.updateOne(
      {
        "items.subItems._id": itemId,
      },
      { $pull: { "items.$.subItems": { _id: itemId } } }
    );

    if (updateResult.modifiedCount === 0) {
      return res
        .status(500)
        .json({ message: "Failed to delete the item, please try again" });
    }

    const restaurentOwnerId = delItem.restaurentId.restaurentowner._id;
    const restaurentName = delItem.restaurentId.restaurentname;

    const restOwnerNotification = new RestaurentOwnerNotification({
      restOwnerId: restaurentOwnerId,
      restaurentName: restaurentName,
      type: "item_removed",
      message: `${itemName} has been removed from your restaurant items related to ${categoryName} category!`,
    });

    await restOwnerNotification.save();

    return res.status(200).json({
      message: "The selected item has been deleted successfully!",
      restaurentOwnerId,
      restaurentName,
      itemName,
      categoryName,
    });
  } catch (error) {
    console.error("Failed to delete the selected item due to:", error);
    return res.status(500).json({
      message: "Failed to delete the selected item, please try again",
    });
  }
};

export const fetchResItems = async (req, res) => {
  const { restaurentIds } = req.body;
  try {
    const restaurentFound = await resItemModel.find({
      restaurentId: { $in: restaurentIds },
    });
    if (!restaurentFound || restaurentFound.length === 0) {
      return res
        .status(404)
        .json({ message: "Restaurent with the included ID does not found." });
    }
    const fetchItems = restaurentFound
      .map((restaurent) =>
        restaurent.items.map((item) => ({
          ...item,
          restaurentId: restaurent._id,
        }))
      )
      .flat();
    if (!fetchItems || fetchItems.length === 0) {
      return res
        .status(404)
        .json({ message: "There is no item founded for this restaurent." });
    }
    return res.status(200).json({
      message: "The items has been fetched and sended successfully!",
      RestaurentItem: fetchItems,
    });
  } catch (error) {
    console.error(
      "Failed to fetch the items for this restaurent due to : ",
      error
    );
    return res
      .status(500)
      .json({ message: "Failed to fetch the items for restaurent!" });
  }
};

export const searchResWithCategory = async (req, res) => {
  const itemName = req.query.name;
  try {
    if (!itemName) {
      return res.status(404).json({ message: "No Item Name Has Been Added!" });
    }

    const restaurentMatch = await resItemModel
      .find({ "items.name": itemName })
      .populate("restaurentId");

    if (restaurentMatch.length > 0) {
      const result = restaurentMatch.map((restaurent) => ({
        _id: restaurent.restaurentId._id,
        restaurentId: restaurent.restaurentId._id,
        restaurentName: restaurent.restaurentId.restaurentname,
        restaurentLocation: restaurent.restaurentId.restaurentlocation,
        restaurentPFP: restaurent.restaurentId.restaurentpfp,
        restaurentOwner: restaurent.restaurentId.restaurentowner,
        items: restaurent.items.map((item) => ({
          itemId: item._id,
          itemName: item.name,
          itemRestaurentId: item.restaurentId,
          subItems: item.subItems,
        })),
      }));

      return res.status(200).json({
        message: "Some restaurants with entered category are : ",
        restaurents: result,
      });
    } else {
      return res.status(400).json({
        message:
          "Failed to find the restaurent with entered category name, try using another category for search!",
      });
    }
  } catch (error) {
    console.error(
      "Failed to find restaurent with entered category name due to : ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to find the restaurent with entered category name, try using another category for search!",
    });
  }
};

export const fetchItemDetailsById = async (req, res) => {
  const { itemId } = req.body;
  try {
    const itemFound = await resItemModel
      .findById(itemId)
      .populate("restaurentId");
    if (!itemFound) {
      return res
        .status(404)
        .json({ message: "Failed to find the item because it won't exists!" });
    }
    return res.status(200).json(itemFound);
  } catch (error) {
    console.error(
      "Failed to fetch the details of restaurent items due to : ",
      error
    );
  }
};

export const fetchRestaurentDetailsWithItems = async (req, res) => {
  const { restaurentId } = req.body;
  try {
    const foundAll = await resItemModel
      .findOne({ restaurentId: restaurentId })
      .populate("restaurentId");
    if (!foundAll) {
      return res
        .status(404)
        .json({ message: "Failed to find all the items by given ID" });
    }

    return res.status(200).json({
      message: "All items have been founded with restaurent ID as ",
      details: foundAll,
    });
  } catch (error) {
    console.error(
      "Failed to find items with restaurent details due to : ",
      error
    );
    return res
      .status(500)
      .json({ message: "Failed to find restaurent details !" });
  }
};

export const changeResItemInfo = async (req, res) => {
  const {
    itemId,
    newItemName,
    newItemPrice,
    newItemQuantity,
    newItemDescription,
  } = req.body;
  try {
    if ((!newItemName, !newItemPrice, !newItemQuantity, !newItemDescription)) {
      return res.status(400).json({
        message: "Please fill all the required info to change the details.",
      });
    }

    const itemFound = await resItemModel
      .findOneAndUpdate(
        { "items.subItems._id": itemId },
        {
          $set: {
            "items.$.subItems.$[subItem].name": newItemName,
            "items.$.subItems.$[subItem].price": newItemPrice,
            "items.$.subItems.$[subItem].quantity": newItemQuantity,
            "items.$.subItems.$[subItem].description": newItemDescription,
          },
        },
        {
          arrayFilters: [{ "subItem._id": itemId }],
          new: true,
          runValidators: true,
        }
      )
      .populate({
        path: "restaurentId",
        model: "restaurents",
        populate: {
          path: "restaurentowner",
          model: "user_data",
        },
      });

    const restaurentOwnerId = itemFound.restaurentId.restaurentowner;
    const restaurentName = itemFound.restaurentId.restaurentname;

    const restOwnerNotification = new RestaurentOwnerNotification({
      restOwnerId: restaurentOwnerId,
      restaurentName: restaurentName,
      type: "item_updated",
      message: `An item details has been updated and it's new name is ${newItemName}!`,
    });

    if (!itemFound) {
      return res.status(404).json({
        message: "No item found for this restaurent ID or item ID is wrong",
      });
    }
    await restOwnerNotification.save();
    return res.status(200).json({
      message: "Item info has been updated successfully!",
      updatedItem: itemFound,
    });
  } catch (error) {
    console.error("Failed to change info of selected item due to : ", error);
    return res.status(500).json({
      message: "Failed to change the info of this item, please try again",
    });
  }
};

export const fetchDetailsOfItem = async (req, res) => {
  const { itemId } = req.query;
  try {
    const itemFound = await resItemModel
      .findOne({ "items.subItems._id": itemId })
      .populate("restaurentId");
    if (!itemFound) {
      return res.status(404).json({
        message: "No item found for this restaurent ID or item ID is wrong",
      });
    }

    const subItem = itemFound.items
      .flatMap((item) => item.subItems)
      .find((subItem) => subItem._id.toString() === itemId);

    if (!subItem) {
      return res
        .status(404)
        .json({ message: "Failed to find the item details!" });
    }

    return res.status(200).json({
      message: "Item has been founded successfully!",
      itemData: subItem,
    });
  } catch (error) {
    console.error("Failed to fetch details of item due to : ", error);
    return res.status(500).json({
      message: "Failed to fetch details of item, please try again!",
    });
  }
};

export const fetchItemBySearch = async (req, res) => {
  const { itemName } = req.query;
  const { restaurentId } = req.body;
  try {
    const itemFound = await resItemModel.findOne({
      restaurentId: restaurentId,
      "items.subItems.name": itemName,
    });
    if (!itemFound) {
      return res.status(404).json({
        message: "No item found with this name!",
      });
    }

    let foundSubItem = null;
    itemFound.items.forEach((item) => {
      const subItem = item.subItems.find(
        (subItem) => subItem.name.toLowerCase() === itemName.toLowerCase()
      );
      if (subItem) {
        foundSubItem = subItem;
      }
    });

    return res.status(200).json({
      message: "Item has been founded successfully!",
      item: foundSubItem,
    });
  } catch (error) {
    console.error("Failed to fetch item by search due to : ", error);
    return res.status(500).json({
      message: "Failed to fetch item by search, please try again!",
    });
  }
};

export const fetchItemSaleCount = async (req, res) => {
  const { itemId } = req.query;
  try {
    const saleCount = await orderModal.countDocuments({
      itemId: itemId,
      orderStatus: "accepted",
    });
    return res.status(200).json({
      message: "Item sale count has been fetched successfully!",
      saleCount: saleCount,
    });
  } catch (error) {
    console.error("Failed to fetch item sale count due to : ", error);
    return res.status(500).json({
      message: "Failed to fetch item sale count, please try again!",
    });
  }
};

export const fetchTotalItemSaleEarnings = async (req, res) => {
  const { itemId } = req.query;
  try {
    const order = await orderModal.find({
      itemId: itemId,
      orderStatus: "accepted",
    });
    if (!order || order.length === 0) {
      return res.status(404).json({
        message: "No order found for this item!",
      });
    }
    const totalEarnings = order.reduce((total, order) => {
      return total + order.itemprice * order.itemquantity;
    }, 0);
    return res.status(200).json({
      message: "Total item sale earnings has been fetched successfully!",
      totalEarnings: totalEarnings,
    });
  } catch (error) {
    console.error("Failed to fetch total item sale earnings due to : ", error);
    return res.status(500).json({
      message: "Failed to fetch total item sale earnings, please try again!",
    });
  }
};

// This function does not work as i want, i will fix it later
export const fetchOtherItemsOfRest = async (req, res) => {
  const { itemId } = req.query;
  const { restaurentId } = req.body;
  try {
    const items = await resItemModel.find({
      restaurentId: restaurentId,
    });

    if (!items || items.length === 0) {
      return res.status(404).json({
        message: "No items found for this restaurant!",
      });
    }

    const filteredItems = items.map((item) => {
      return {
        ...item._doc,
        items: item.items.map((subItem) => ({
          ...subItem._doc,
          subItems: subItem.subItems.filter(
            (subItem) => subItem._id.toString() !== itemId
          ),
        })),
      };
    });

    const hasSubItems = filteredItems.some((item) =>
      item.items.some((subItem) => subItem.subItems.length > 0)
    );

    if (!hasSubItems) {
      return res.status(404).json({
        message: "No other items found for this restaurant!",
      });
    }

    return res.status(200).json({
      message: "Other items have been fetched successfully!",
      allItems: filteredItems,
    });
  } catch (error) {
    console.error("Failed to fetch other items of restaurant due to: ", error);
    return res.status(500).json({
      message: "Failed to fetch other items of restaurant, please try again!",
    });
  }
};

export const fetchTotalItemsofRestaurentSale = async (req, res) => {
  const { restaurentId } = req.query;
  const { itemId } = req.body;

  try {
    const totalItemSale = await resItemModel.countDocuments({
      restaurentId: restaurentId,
      "items._id": itemId,
    });

    if (totalItemSale === 0) {
      return res.status(404).json({
        message: "No item found for this restaurent ID or item ID is wrong",
      });
    }

    return res.status(200).json({
      message: "Total item sale has been fetched successfully!",
      totalItemSale: totalItemSale,
    });
  } catch (error) {
    console.error(
      "Failed to fetch total item sale of restaurent due to: ",
      error
    );
    return res.status(500).json({
      message:
        "Failed to fetch total item sale of restaurent, please try again!",
    });
  }
};
