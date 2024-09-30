import userModel from "../models/Auth.js";
import RestaurentOwnerNotification from "../models/RestaurentOwner.js";
import restaurentModel from "../models/Restaurents.js";
import bcrypt from "bcrypt";

export const createrestaurentcentre = async (req, res) => {
  const { restaurentname, restaurentlocation, restaurentowner } = req.body;
  const restaurentpfp = req.file ? req.file.filename : null;
  try {
    const newRestaurent = await restaurentModel({
      restaurentname: restaurentname,
      restaurentlocation: restaurentlocation,
      restaurentowner: restaurentowner,
      restaurentpfp: restaurentpfp,
    });

    const saveData = await newRestaurent.save();

    if (saveData) {
      return res.status(201).json({
        message:
          "The restaurent details has been saved, check the preview in second container downside and if you like it then proceed to add further details.",
        restaurent: newRestaurent,
      });
    }
  } catch (error) {
    console.error("Failed to save the details of restaurent due to : ", error);
    return res.status(500).json({
      message: "Failed to save the details of restaurent, please try again!!",
    });
  }
};

export const deleterestaurentdata = async (req, res) => {
  const { restaurentId } = req.params;
  try {
    const restaurent = await restaurentModel.findById(restaurentId);
    if (!restaurent) {
      return res
        .status(404)
        .json({ message: "The restaurent with this ID not found" });
    }

    const deleteRestaurent = await restaurentModel.findByIdAndDelete(
      restaurentId
    );
    if (deleteRestaurent) {
      return res.status(200).json({
        message:
          "The entered details has been removed, now you can add them again.",
      });
    }
  } catch (error) {
    console.error(
      "Failed to delete entered restaurent details due to : ",
      error
    );
    return res.status(500).json({
      message: "Failed to delete the details you entered, please try again",
    });
  }
};

export const cancelformrestaurent = async (req, res) => {
  const { userId } = req.params;
  try {
    const restaurent = await restaurentModel.findOne({
      restaurentowner: userId,
    });

    if (!restaurent) {
      return res.status(404).json({
        message:
          "You need to enter some details and save them first to use this functionality!!",
      });
    }

    const cancelFormation = await restaurentModel.findByIdAndDelete(
      restaurent._id
    );
    if (cancelFormation) {
      return res.status(200).json({
        message:
          "The formation of you restaurent data centre has been cancelled, logging you out for a while.",
      });
    }
  } catch (error) {
    console.error("Failed to erase data and log user out due to : ", error);
    return res.status(500).json({
      message: "Failed to erase the data and log user out, please try again.",
    });
  }
};

export const proceedToRestaurentOwnerDashboard = async (req, res) => {
  const { restaurentId } = req.params;
  try {
    const restaurent = await restaurentModel.findById(restaurentId);
    if (!restaurent) {
      return res.status(404).json({
        message: "You must have one registered restaurent to proceed further.",
      });
    }
    res.status(200).json({
      message: "Send user to restaurent owner dashboard successfully.",
      restaurent: restaurent,
    });
  } catch (error) {
    console.error("Failed to complete further processing due to : ", error);
    res.status(500).json({
      message: "Failed to complete further processing, please try again.",
    });
  }
};

export const confirmenteredPassword = async (req, res) => {
  const { id } = req.params;
  const { enteredPassword } = req.body;
  try {
    const user = await userModel.findById(id);

    if (!user) {
      return res.status(404).json({
        message: "The restaurent which you are editing does not found",
      });
    }

    const isMatch = await bcrypt.compare(enteredPassword, user.password);

    if (isMatch) {
      return res
        .status(200)
        .json({ isValid: true, message: "The password is correct." });
    } else {
      return res.status(500).json({
        isValid: false,
        message: "The password entered is incorrect.",
      });
    }
  } catch (error) {
    console.error("Failed to check for correct password due to : ", error);
    return res
      .status(500)
      .json({ message: "Failed to check for correct password." });
  }
};

export const updateRestaurentInformation = async (req, res) => {
  const { restaurentId } = req.params;
  const { restaurentNewName, restaurentNewLocation, restaurentOwnerId } =
    req.body;
  const restaurentnewImage = req.file.filename;
  try {
    const restaurent = await restaurentModel.findById(restaurentId);
    if (!restaurent) {
      return res
        .status(404)
        .json({ message: "The restaurent does not found for updation." });
    }

    const updateResInfo = await restaurentModel.findByIdAndUpdate(
      restaurentId,
      {
        restaurentname: restaurentNewName,
        restaurentlocation: restaurentNewLocation,
        restaurentpfp: restaurentnewImage,
        restaurentowner: restaurentOwnerId,
      },
      { new: true }
    );

    const restaurentOwnerNotification = new RestaurentOwnerNotification({
      restOwnerId: restaurentOwnerId,
      restaurentName: restaurentNewName,
      type: "restaurent_details_updated",
      message: `The restaurent details has been updated successfully!`,
    });

    await restaurentOwnerNotification.save();

    if (updateResInfo) {
      return res.status(200).json({
        message: "The restaurent information has been updated successfully!",
        updatedInfo: updateResInfo,
      });
    }
  } catch (error) {
    console.error("Failed to update restaurent information due to : ", error);
    return res.status(500).json({
      message: "Failed to update restaurent information, please try again.",
    });
  }
};

export const fetchRestaurentCount = async (req, res) => {
  try {
    const count = await restaurentModel.countDocuments();
    if (!count) {
      return res.status(404).json({ message: "No restaurent available." });
    }
    res.status(200).json(count);
  } catch (error) {
    console.error("Failed to get restaurent count due to : ", error);
    return res.status(500).json({ message: "Failed to get restaurent count!" });
  }
};

export const fetchAllRestaurents = async (req, res) => {
  try {
    const restaurents = await restaurentModel.find();
    if (!restaurents) {
      return res.status(404).json({ message: "No restaurents found!" });
    }
    return res.status(200).json(restaurents);
  } catch (error) {
    console.error("Failed to fetch all restaurents due to : ", error);
  }
};

export const deleteRestaurentEntireData = async (req, res) => {
  const { restaurentId } = req.params;
  try {
    const restaurent = await restaurentModel.findById(restaurentId);
    if (!restaurent) {
      return res
        .status(404)
        .json({ message: "The restaurent does not found!" });
    }

    const deleteEntireData = await restaurentModel.findByIdAndDelete(
      restaurentId
    );
    if (deleteEntireData) {
      return res.status(200).json({
        message:
          "Your restaurent has been deleted successfully, removed all the data associated with it and logging you out!",
      });
    }
  } catch (error) {
    console.error("Failed to delete restaurent entire data due to : ", error);
    return res.status(500).json({
      message: "Failed to delete restaurent entire data, please try again.",
    });
  }
};
