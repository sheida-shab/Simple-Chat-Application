console.log("script.js is connected");

let messages =[]; // store all seen messages

// Start fetching new messages repeatedly
fetchNewMessages();

// DOM references
const messageContainer = document.getElementById("messageContainer");
messageContainer.classList.add("general");

const messageForm = document.getElementById("sendMessageForm");
const userInput = document.getElementById("user");
const messageInput = document.getElementById("text");
const errorMessageContainer = document.getElementById("errorMessage");

// Handle form submission
messageForm.addEventListener("submit",async(e)=>{
  e.preventDefault();
  const userName = userInput.value.trim();
  const message = messageInput.value.trim();

  // Validate inputs
  if (!userName || !message) {
    errorMessageContainer.textContent =
      "Both userName and messageText must be filled.";
    errorMessageContainer.style.color = "red";
    return;
  } else {
    errorMessageContainer.textContent = "";
    const data = { user: userName, text: message };
    // POST the new message to the server
    const response = await fetch(
      "https://sheida-shab-chatapp-backend.hosting.codeyourfuture.io/messages",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      }
    );

    // Check if the server responded with an error
    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`);
    }

    // If everything is ok, get the response text
    const result = await response.text();
    console.log(result);

    if (result === "received") {
      // Show success message
      errorMessageContainer.textContent = "message sent successfully!";
      errorMessageContainer.style.color = "green";
      setTimeout(() => {
        errorMessageContainer.textContent = "";
      }, 3000);

      // Add the new message to local state with timestamp
      messages.push({ user: userName, text: message, timestamp: Date.now() });

      //render page and show all messages
      renderMessages();

      // Clear input fields
      userInput.value = "";
      messageInput.value = "";
    }
  }
})

// Render messages to the DOM
async function  renderMessages(){
  messageContainer.innerHTML = ""; // clear container

  // Add each message element
  messages.forEach((obj) => {
    const newMessage = document.createElement("div");
    newMessage.classList.add("message");
    newMessage.textContent = obj.user + ": " + obj.text;
    messageContainer.appendChild(newMessage);
  });
  // scroll to bottom
  messageContainer.scrollTop = messageContainer.scrollHeight;
}

// Fetch new messages from the server using "fast polling"
async function fetchNewMessages(){
  // Find the timestamp of the last message we have
  const lastTimestamp =
    messages.length > 0 ? messages[messages.length - 1].timestamp : 0;
  //Construct the GET URL with query ?since=<timestamp>
  const url = `https://sheida-shab-chatapp-backend.hosting.codeyourfuture.io/messages?since=${lastTimestamp}`;

  //GET new messages from the server
  try {
    const response = await fetch(url);
    const newMessages = await response.json();
    if (newMessages.length > 0) {
      // Use the spread operator to add each new message individually to the messages array
      messages.push(...newMessages);

      // Render updated messages
      renderMessages();
    }
  } catch (error) {
    console.error("Error fetching new messages:", error);
  }
  // Call this function again after 2 seconds
  setTimeout(fetchNewMessages, 2000);
}
