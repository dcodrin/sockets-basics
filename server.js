var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();
//This tells Node to start a new server and to use the express app as a boilerplate.
var http = require("http").Server(app);

var io = require("socket.io")(http);

//We are exposing a folder
app.use(express.static(__dirname + "/public"));

//Tell the server to wait for a connection and when a connection is detected print to the console.
io.on("connection", ()=>{
    console.log("User connected via socket.io");
});

http.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
});