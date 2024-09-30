import HomeInfoModel from "../models/Homes.js";

export const createNewHome = async (req, res) => {
  const {
    streetName,
    cityName,
    zipCodeInfo,
    roomsCount,
    rentCount,
    availableRooms,
    descriptionProvided,
    personName,
    personNumber,
    personEmail,
  } = req.body;

  const imagesofHome = req.files
    ? req.files.map((file) => file.filename)
    : null;

  try {
    if (
      (!streetName,
      !cityName,
      !zipCodeInfo,
      !roomsCount,
      !rentCount,
      !availableRooms,
      !descriptionProvided,
      !personName,
      !personNumber,
      !personEmail,
      !imagesofHome)
    ) {
      return res
        .status(400)
        .json({ message: "Please enter all the required fields to continue." });
    }

    const newHome = new HomeInfoModel({
      address: {
        street: streetName,
        city: cityName,
        zipCode: zipCodeInfo,
      },
      numberOfRooms: roomsCount,
      rentPerRoom: rentCount,
      availableRooms: availableRooms,
      description: descriptionProvided,
      contactInfo: {
        name: personName,
        number: personNumber,
        email: personEmail,
      },
      imagesOfHome: imagesofHome,
    });
    const saveHomeData = await newHome.save();
    if (saveHomeData) {
      return res.status(201).json({
        message:
          "Your data has been saved, taking you to home dashboard where you can access further.",
        data: saveHomeData,
      });
    } else {
      return res.status(400).json({
        message: "Failed to save the data correctly, something went wrong!",
      });
    }
  } catch (error) {
    console.error("Failed to save entered home details due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to save home details, please try again!" });
  }
};

export const fetchHomeData = async (req, res) => {
  const { dataId } = req.query;
  try {
    const findMyHome = await HomeInfoModel.findById(dataId);
    if (!findMyHome) {
      return res.status(404).json({ message: "Failed to find your home!" });
    }
    return res.status(200).json(findMyHome);
  } catch (error) {
    console.error("Failed to find data of your home due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to find the details of your home!" });
  }
};

export const updateHomeData = async (req, res) => {
  const { dataId } = req.query;
  const {
    streetNewName,
    cityNewName,
    newZipCode,
    updatedPrice,
    newPersonName,
    newPersonNumber,
    newPersonEmail,
    newDescription,
    updatedNoOfRooms,
  } = req.body;

  if (
    !streetNewName ||
    !cityNewName ||
    !newZipCode ||
    !updatedPrice ||
    !newPersonName ||
    !newPersonNumber ||
    !newPersonEmail ||
    !newDescription ||
    !updatedNoOfRooms
  ) {
    return res
      .status(400)
      .json({ message: "All fields are required to complete updation!" });
  }

  const newImages = req.files ? req.files.map((file) => file.filename) : [];

  if (newImages.length === 0) {
    return res
      .status(400)
      .json({ message: "Please upload at least one image to continue!" });
  }

  try {
    const findMyData = await HomeInfoModel.findById(dataId);
    if (!findMyData) {
      return res
        .status(404)
        .json({ message: "Data not founded for updation!" });
    }
    findMyData.address.street = streetNewName;
    findMyData.address.city = cityNewName;
    findMyData.address.zipCode = newZipCode;
    findMyData.rentPerRoom = updatedPrice;
    findMyData.contactInfo.name = newPersonName;
    findMyData.contactInfo.number = newPersonNumber;
    findMyData.contactInfo.email = newPersonEmail;
    findMyData.description = newDescription;
    findMyData.numberOfRooms = updatedNoOfRooms;
    findMyData.imagesOfHome = newImages;

    const saveDetails = await findMyData.save();
    if (saveDetails) {
      return res.status(200).json({
        message: "The data has been updated successfully!",
        newData: saveDetails,
      });
    } else {
      return res.status(400).json({
        message: "Failed to update data as something went wrong here",
      });
    }
  } catch (error) {
    console.error("Failed to update the data due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to update the data, please try again!" });
  }
};

export const fetchAllHomesInDB = async (req, res) => {
  try {
    const homes = await HomeInfoModel.find();
    if (!homes) {
      return res
        .status(404)
        .json({ message: "No home founded to fetch and display!" });
    }
    return res.status(200).json({
      message: "All homes that are available on website are : ",
      data: homes,
    });
  } catch (error) {
    console.error("Failed to fetch all homes due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch all homes due to an unknown error!" });
  }
};

export const fetchByBudget = async (req, res) => {
  const { budget } = req.query;

  if (!budget || isNaN(budget)) {
    return res
      .status(400)
      .json({ message: "Please enter a budget to fetch home details!" });
  }

  try {
    const budgetInNumbers = Number(budget);
    const homes = await HomeInfoModel.find({
      rentPerRoom: { $lt: budgetInNumbers },
    });
    if (homes.length === 0) {
      return res
        .status(404)
        .json({ message: "Sorry, no home found within this budget." });
    }
    return res.status(200).json(homes);
  } catch (error) {
    console.error(
      "Failed to fetch homes with the help of budget due to : ",
      error
    );
    return res.status(500).json({
      message: "Failed to fetch homes with this budget, please try again!",
    });
  }
};

export const fetchOtherHomesNEselected = async (req, res) => {
  const { excludedHomeId } = req.query;
  try {
    const homes = await HomeInfoModel.find({
      _id: { $ne: excludedHomeId },
    });
    if (homes.length === 0) {
      return res.status(404).json({ message: "No more homes founded!" });
    }
    return res.status(200).json(homes);
  } catch (error) {
    console.error(
      "Failed to fetch other homes except this one due to : ",
      error
    );
    return res.status(500).json({ message: "Failed to fetch other homes!" });
  }
};

export const fetchNoOfHomesOnWebsite = async (req, res) => {
  try {
    const homes = await HomeInfoModel.countDocuments();
    if (homes === 0) {
      return res.status(404).json({ message: "No home found on website!" });
    }
    return res
      .status(200)
      .json({ message: "Total number of homes on website : ", data: homes });
  } catch (error) {
    console.error("Failed to fetch no of homes on website due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to fetch no of homes on website!" });
  }
};
