// Import Express framework to create a web server
import express from "express";

// Create an Express application
const app = express();

// Define the port where the backend server will run
const port = 3000;

app.use(express.json());

const userMessageArr = [];

//post endpoint
app.post("/messages",(req,res)=>{
    userMessageArr.push(req.body);
    res.send("received");
})

//get endpoint
app.get("/messages",(req,res) => {
    res.json(userMessageArr)})

// Start the server and listen for incoming requests
app.listen(port,()=>{console.error(`Quote server listening on port ${port}`);});
