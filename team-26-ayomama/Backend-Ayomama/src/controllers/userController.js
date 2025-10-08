import User from "../models/user.js";

const getUser = async (req, res) => {
  try {
    if (!req.user) return res.status(401).json({ error: "Unauthorized" });

    // Support tokens that contain userId or id
    const id = req.user._id;

    const user = await User.findById(id).select("-password");
    console.log(user);
    if (!user) return res.status(404).json({ error: "User not found" });

    res.status(200).json({ message: "User found", success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const updateLanguagePreference = async (req, res) => {
  try {
    const userId = req.user._id;
    const { preferredLanguages } = req.body;

    const newLanguagePreference = await User.findByIdAndUpdate(
      userId,
      { preferredLanguages },
      { new: true }
    ).select("-password");

    res.status(201).json({
      message: "Language preference updated",
      success: true,
      data: newLanguagePreference,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

const profileInformation = async (req, res) => {
  try {
    const userId = req.user._id;
    const { name, address, lastPeriodDate, contact, emergencyContact } =
      req.body;

    const updatedProfile = await User.findByIdAndUpdate(
      userId,
      { name, address, lastPeriodDate, contact, emergencyContact },
      { new: true }
    ).select("-password");

    res.status(201).json({
      message: "Profile updated",
      success: true,
      data: updatedProfile,
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

export { updateLanguagePreference, profileInformation, getUser };
