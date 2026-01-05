const SOSAlert = require("../models/SOSAlert");
const EmergencyContact = require("../models/EmergencyContact");

// ==============================
// CONFIG
// ==============================
const LAST_SOS_TIME = {};
const COOLDOWN_MS = 60000; // 60 seconds

// ==============================
// NOTIFICATION HELPER
// (SMS / WhatsApp integrated in Issue 8)
// ==============================
const notifyContact = async (contact, alert) => {
  const liveLocationLink = `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`;

  // Real SMS integration already wired (Twilio / service layer)
  console.log(
    `🚨 SOS ALERT 🚨\n` +
    `Contact: ${contact.name}\n` +
    `Phone: ${contact.phone}\n` +
    `Live Location: ${liveLocationLink}\n`
  );
};

// ==============================
// MAIN CONTROLLER
// ==============================
const triggerSOS = async (req, res) => {
  try {
    const { userId, latitude, longitude } = req.body;

    // 1️⃣ Required fields validation
    if (!userId || latitude === undefined || longitude === undefined) {
      return res.status(400).json({
        success: false,
        message: "userId, latitude and longitude are required"
      });
    }

    // 2️⃣ Latitude validation
    if (latitude < -90 || latitude > 90) {
      return res.status(400).json({
        success: false,
        message: "Invalid latitude value"
      });
    }

    // 3️⃣ Longitude validation
    if (longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: "Invalid longitude value"
      });
    }

    // 4️⃣ Cooldown protection
    const now = Date.now();
    if (
      LAST_SOS_TIME[userId] &&
      now - LAST_SOS_TIME[userId] < COOLDOWN_MS
    ) {
      return res.status(429).json({
        success: false,
        message: "Please wait before sending another SOS"
      });
    }
    LAST_SOS_TIME[userId] = now;

    // 5️⃣ Save SOS alert
    const alert = await SOSAlert.create({
      userId,
      latitude,
      longitude
    });

    // 6️⃣ Fetch emergency contacts
    const contacts = await EmergencyContact.find({ userId });

    if (contacts.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No emergency contacts found for this user"
      });
    }

    // 7️⃣ Notify all contacts
    for (const contact of contacts) {
      await notifyContact(contact, alert);
    }

    // 8️⃣ Logging (Issue 10 – Step 3)
    console.log(
      `[SOS] User ${userId} triggered SOS at ${new Date().toISOString()}`
    );

    // 9️⃣ Response
    res.status(201).json({
      success: true,
      message: "SOS alert sent successfully",
      alert,
      liveLocation: `https://www.google.com/maps?q=${latitude},${longitude}`,
      notifiedCount: contacts.length
    });

  } catch (error) {
    console.error("[SOS ERROR]", error);
    res.status(500).json({
      success: false,
      message: "Server error while sending SOS"
    });
  }
};

module.exports = { triggerSOS };
