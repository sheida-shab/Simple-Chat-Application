console.log("script.js is connected");

renderMessages();

const messageContainer = document.getElementById("messageContainer");
messageContainer.classList.add("general");

const messageForm = document.getElementById("sendMessageForm");
const userInput = document.getElementById("user");
const messageInput = document.getElementById("text");
const errorMessageContainer = document.getElementById("errorMessage");

messageForm.addEventListener("submit",async(e)=>{
    e.preventDefault();
    const userName=userInput.value.trim();
    const message=messageInput.value.trim();
    if (!userName || !message) {
        errorMessageContainer.textContent =
          "Both userName and messageText must be filled.";
        errorMessageContainer.style.color="red";
        return;  
    } else{
        errorMessageContainer.textContent="";
        const data={user:userName,text:message};
        const response = await fetch("https://sheida-shab-chatapp-backend.hosting.codeyourfuture.io/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(data),
        });
        const result = await response.text();
        console.log(result);

        if (result === "received") {
          errorMessageContainer.textContent = "message sent successfully!";
          errorMessageContainer.style.color = "green";
          setTimeout(() => {
            errorMessageContainer.textContent = "";
          }, 3000);
          
          //render page and show all messages
          renderMessages();

          userInput.value = "";
          messageInput.value = "";
        }

    }


})

async function  renderMessages(){
    const response = await fetch("https://sheida-shab-chatapp-backend.hosting.codeyourfuture.io/messages");
    const messageArray=await response.json();
    messageContainer.innerHTML="";
    messageArray.forEach(obj => {
        
        const newMessage=document.createElement("div");
        newMessage.classList.add("message");
        newMessage.textContent=obj.user+ ": "+obj.text;
        messageContainer.appendChild(newMessage);
    });

    messageContainer.scrollTop = messageContainer.scrollHeight;


}
setInterval(renderMessages, 2000);  // poll every 2 seconds
