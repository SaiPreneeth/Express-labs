// server.js - Express server for Lab 1
const express = require("express");
const app = express();

const PORT = 3000;

// Route 1: GET / -> Welcome text
app.get("/", (req, res) => {
  res.status(200).send("Welcome to Lab 1 Node.js and Express Server");
});

// Route 2: GET /about -> JSON containing student name and section
app.get("/about", (req, res) => {
  res.status(200).json({
    name: "Sai Preneeth",
    section: "CSE(QE)-2A"
  });
});

// Route 3: GET /time -> Current date and time using new Date()
app.get("/time", (req, res) => {
  const currentDateTime = new Date();
  res.status(200).send(`Current Date and Time: ${currentDateTime.toString()}`);
});

// Route 4: Catch-all handler for unknown paths -> 404 response
app.use((req, res) => {
  res.status(404).send("404 - Route Not Found");
});

// Start the Express server on port 3000
app.listen(PORT, () => {
  console.log(`Express server running at http://localhost:${PORT}/`);
});
