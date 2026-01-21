// Import Express framework to create a web server
import express from "express";

// Import CORS middleware to allow requests from other origins (e.g. frontend)
import cors from "cors";

//import escapeHtml library to prevent HTML injection
import escapeHtml from "escape-html";


// Create an Express application
const app = express();

// Enable CORS for all routes
app.use(cors());

// Define the port where the backend server will run
const port = 3000;

// Enable parsing of JSON bodies in requests
app.use(express.json());

// Array to store all messages in memory
const userMessageArr = [];

// POST endpoint to receive a new message
app.post("/messages", (req, res) => {
  // Extract user and text from the request body
  let { user, text } = req.body;

  // Create a new message object with a timestamp
  const newMessage = { user, text, timestamp: Date.now() };

  // Log the received message
  console.log(`POST /messages: ${JSON.stringify(newMessage)}`);

  // Validate input: user and text must exist and be strings
  if (!user || !text || typeof user !== "string" || typeof text !== "string") {
    return res.status(400).json({ error: "Invalid user or text" });
  }

  // Escape any HTML or script tags to prevent XSS/injection
  user = escapeHtml(user);
  text = escapeHtml(text);

  // Store the new message in the array
  userMessageArr.push(newMessage);

  // Respond to the client confirming the message was received
  res.send("received");
});

// GET endpoint to return messages
app.get("/messages", (req, res) => {
  // Check if a "since" query parameter is provided (timestamp)
  const since = req.query.since ? Number(req.query.since) : undefined;

  // Log the GET request with the "since" timestamp
  console.log(`GET /messages?since=${since}`);

  // Logging and checking for NaN in timestamp
  if (since !== undefined && isNaN(since)) {
    return res.status(400).json({ error: "Invalid timestamp" });
  }

  // If since is provided, filter messages sent after that timestamp
  if (since !== undefined) {
    const newMessages = userMessageArr.filter((msg) => msg.timestamp > since);
    res.json(newMessages);
  } else {
    // If no since parameter, return all messages
    res.json(userMessageArr);
  }
});

// Start the server and listen for incoming requests
app.listen(port, () => {
  console.error(`Chat Server listening on port ${port}`);
});
