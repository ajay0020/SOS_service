# 🚨 SOS Emergency Response Backend System

A backend-driven SOS emergency system that allows clients to trigger an SOS
with live location and notify emergency contacts via SMS, with built-in
validation, cooldown protection, and structured logging.

---

## 🎯 Objective
To provide a fast, reliable, and abuse-safe backend system for emergency
alerts that can be consumed by any mobile or web client.

---

## ✅ Current Features (Implemented)
- SOS trigger with live GPS location
- Google Maps live location link generation
- Emergency contacts notification via SMS
- Cooldown protection to prevent SOS spam
- Latitude and longitude validation
- Emergency contact existence checks
- Structured logging for SOS events
- Modular backend architecture

---

## 🧠 System Flow
1. Client sends SOS request with latitude and longitude
2. Backend validates request data
3. Cooldown logic prevents repeated SOS triggers
4. SOS event is stored in the database
5. Emergency contacts are notified via SMS with live location
6. SOS event is logged for traceability

---

## 🏗 Architecture Overview
Client (API Consumer / Mobile App)

↓

Node.js + Express Backend

↓

MongoDB (Atlas)

↓

SMS Service (Twilio)


---

## 🛠 Tech Stack
- Backend: Node.js, Express.js
- Database: MongoDB (Atlas)
- Notifications: Twilio SMS
- Location Handling: GPS coordinates + Google Maps links
- Utilities: Haversine Formula
- Version Control: Git & GitHub

---

## 📡 API Overview

### POST `/api/sos`
Triggers an SOS alert with live location.

**Request Body**

{
  "userId": "string",
  "latitude": 26.8467,
  "longitude": 80.9462
}

**Response**

{
  "success": true,
  "liveLocation": "https://www.google.com/maps?q=26.8467,80.9462",
  "notifiedContacts": 2
}

--
