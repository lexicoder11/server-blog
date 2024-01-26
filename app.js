// global variables to ensure routing and importing information
const express = require("express")
const app = express();

const serverBlog = require("./controllers/routes");
const Port = 4000;

// importing the use of express and initiating the endpoints of the server blog
app.use(express.json());
app.use("/serverBlog", serverBlog);

// testing to ensure everything is connected
app.get('/test', (req, res) => {
    res.send('Hello World!')
});


// creating a port function so you can connect to the server 
app.listen(Port,()=>{
    console.log("Server is running on port", Port);
});