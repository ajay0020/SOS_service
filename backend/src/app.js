const contactRoutes = require("./routes/contact.routes");
const express = require("express");
const connectDB = require("./config/db");
const sosRoutes = require("./routes/sos.routes");

const app = express();

// Connect MongoDB
connectDB();

// Middleware
app.use(express.json());

// Routes
app.use("/api", sosRoutes);
app.use("/api", contactRoutes);


// Test route
app.get("/", (req, res) => {
  res.send("SOS Backend is running");
});

module.exports = app;

