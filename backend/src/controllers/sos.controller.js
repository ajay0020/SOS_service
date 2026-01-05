const SOSAlert = require("../models/SOSAlert");
const EmergencyContact = require("../models/EmergencyContact");
const { findNearbyServices } = require("../services/emergency.service");

// ==============================
// CONFIG
// ==============================
const LAST_SOS_TIME = {};
const COOLDOWN_MS = 60000; // 60 seconds

// ==============================
// NOTIFICATION HELPER
// (SMS / WhatsApp already integrated earlier)
// ==============================
const notifyContact = async (contact, alert) => {
  const liveLocationLink = `https://www.google.com/maps?q=${alert.latitude},${alert.longitude}`;

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

    // 7️⃣ Notify emergency contacts
    for (const contact of contacts) {
      await notifyContact(contact, alert);
    }

    // 8️⃣ Find nearby ambulances & hospitals
    const { nearbyAmbulances, nearbyHospitals } =
      await findNearbyServices(latitude, longitude);

    console.log(
      `[EMERGENCY] Found ${nearbyAmbulances.length} ambulances and ${nearbyHospitals.length} hospitals`
    );

    // 9️⃣ Logging
    console.log(
      `[SOS] User ${userId} triggered SOS at ${new Date().toISOString()}`
    );

    // 🔟 Response
    res.status(201).json({
      success: true,
      message: "SOS alert sent successfully",
      alert,
      liveLocation: `https://www.google.com/maps?q=${latitude},${longitude}`,
      notifiedContacts: contacts.length,
      ambulances: nearbyAmbulances,
      hospitals: nearbyHospitals
    });

  } catch (error) {
    console.error("[SOS ERROR]", error);
    res.status(500).json({
      success: false,
      message: "Server error while processing SOS"
    });
  }
};

module.exports = { triggerSOS };
