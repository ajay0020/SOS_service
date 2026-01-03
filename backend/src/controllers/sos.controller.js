// SOS controller logic will go here
const SOSAlert = require("../models/SOSAlert");

const triggerSOS = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    if (!userId || !latitude || !longitude) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const alert = await SOSAlert.create({
      userId,
      latitude,
      longitude
    });

    res.status(201).json({
      success: true,
      alert
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { triggerSOS };
