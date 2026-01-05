// SOS controller logic will go here
const SOSAlert = require("../models/SOSAlert");
const EmergencyContact = require("../models/EmergencyContact");

/**
 * Helper function to notify a contact
 * (SMS / WhatsApp / Push will be integrated later)
 */
const notifyContact = async (contact, alert) => {
  const liveLocationLink = `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`;

  // For now, we log the notification (stub)
  console.log(
    "-----------------------------\n" +
    `🚨 SOS ALERT 🚨\n` +
    `Contact: ${contact.name}\n` +
    `Phone: ${contact.phone}\n` +
    `Live Location: ${liveLocationLink}\n` +
    "-----------------------------"
  );
};

/**
 * POST /api/sos
 * Trigger SOS alert with live location
 */
const triggerSOS = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    // Validation
    if (!userId || !latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: "userId, latitude and longitude are required"
      });
    }

    // 1️⃣ Save SOS alert in database
    const alert = await SOSAlert.create({
      userId,
      latitude,
      longitude
    });

    // 2️⃣ Fetch emergency contacts
    const contacts = await EmergencyContact.find({ userId });

    // 3️⃣ Notify each contact with live location
    for (const contact of contacts) {
      await notifyContact(contact, alert);
    }

    // 4️⃣ Send response with live location
    const liveLocation = `https://www.google.com/maps?q=${latitude},${longitude}`;

    res.status(201).json({
      success: true,
      message: "SOS alert sent successfully",
      alert,
      liveLocation,
      notifiedCount: contacts.length
    });
  } catch (error) {
    console.error("SOS error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while sending SOS"
    });
  }
};

module.exports = { triggerSOS };
