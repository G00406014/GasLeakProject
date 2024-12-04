const express = require("express");
const mongoose = require("mongoose");
const { createServer } = require("http");
const next = require("next");
const path = require("path");

// Import the API routes
const apiRoutes = require("./routes/api");

// MongoDB connection setup
const dbURI = "mongodb://127.0.0.1:27017/db";  // Ensure MongoDB is running at this address
mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });

// MongoDB connection logging
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB successfully!");
});
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Set up Next.js
const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

// Set up express server and routing
const server = express();
server.use(express.json());  // Middleware to parse JSON bodies

// Use the API routes
server.use("/api", apiRoutes);

// Static file and routing setup for Next.js
app.prepare().then(() => {
  // Serve Next.js pages for all other routes
  server.all("*", (req, res) => {
    return handle(req, res);  // This handles all Next.js page routes
  });

 
  createServer(server).listen(8000, () => {
    console.log("> Ready on http://localhost:8000");
  });
});
