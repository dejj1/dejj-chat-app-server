const getUserDetailsFromToken = require("../helpers/getUserDetailsFromToken");
const UserModel = require("../models/userModel");

async function deletePicture(req, res) {
  try {
    const token = req.cookies.token || "";
    const user = await getUserDetailsFromToken(token);

    const { profile_pic } = req.body;
    await UserModel.findByIdAndDelete(
     
      {
        profile_pic,
      }
    );
    const userInformation = await UserModel.findById(user._id);
    return res.json({
      message: "User profile picture deleted successfully",
      data: userInformation,
      success: true,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || error,
      error: true,
    });
  }
}
module.exports = deletePicture;