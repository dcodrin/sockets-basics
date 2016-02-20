var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();
//This tells Node to start a new server and to use the express app as a boilerplate.
var http = require("http").Server(app);

var io = require("socket.io")(http);

//We are exposing a folder
app.use(express.static(__dirname + "/public"));

//Tell the server to wait for a connection and when a connection is detected print to the console.
io.on("connection", (socket)=>{
//The socket in the callback is an individual connection.
    console.log("User connected via socket.io");

    //Listen on the message event
    socket.on("message", (data)=>{
        console.log(data);
        //socket.broadcast will emit to everyone but the user the sent the message.
        //if we wanted to emit to everyone, including the user that sent the message we would use io.broadcast
        //Again we pass the emit method two argument s the first is the type and the second is the data that we received.
        io.emit("message", data);
    });

    //.emit takes two arguments. The first is the name which can be anything we want.
    //The second argument is data to send. It is recommended to use an object.
    socket.emit("message", {
       text: "Welcome to this most awesome chat application"
    });
});

http.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
});