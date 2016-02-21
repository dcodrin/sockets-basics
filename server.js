var PORT = process.env.PORT || 3000;
var express = require("express");
var moment = require("moment");
var app = express();
//This tells Node to start a new server and to use the express app as a boilerplate.
var http = require("http").Server(app);

var io = require("socket.io")(http);

//We are exposing a folder
app.use(express.static(__dirname + "/public"));

var clientInfo = {};

function sendCurrentUsers(socket){
    //We get the info based on the socket id.
    var info = clientInfo[socket.id];
    var users = [];
    if(!info){
        return;
    }
    //We loop over all the sockets, aka users
    Object.keys(clientInfo).forEach((socketId)=>{
        //We create a reference to each socket, aka user object
        var userInfo = clientInfo[socketId];

        if(userInfo.room === info.room){
            users.push(userInfo.name);
        }
    });
    socket.emit("message", {
        name: "SKYNET",
        text: `Current users: ${users.join("\n")}`,
        timestamp: moment.valueOf()
    })
}

//Tell the server to wait for a connection and when a connection is detected print to the console. Note the word connection is a built in socket word
io.on("connection", (socket)=> {
//The socket in the callback is an individual connection.
    console.log("User connected via socket.io");

    //We will listen for disconnects. Note the word is a socket specific word.
    socket.on("disconnect", ()=> {
        if (clientInfo[socket.id]) {
            socket.leave(clientInfo[socket.id].room);
            io.to(clientInfo[socket.id].room).emit("message", {
                name: "SKYNET",
                text: `${clientInfo[socket.id].name} has left the room! Or did they?`
            });
        }
        delete clientInfo[socket.id];
    });

    socket.on("joinRoom", (req)=> {
        //Socket.id is a unique identifier that is created by socket for every user. For every user we create a unique identifier and then set that equal to the user info that was passed in.
        clientInfo[socket.id] = req;

        //This is a built in socket feature. It allows to join specific rooms.
        socket.join(req.room);
        socket.broadcast.to(req.room).emit("message", {
            name: "SKYNET",
            text: `${req.name} has joined the chat!`,
            timestamp: moment().valueOf()
        });
    });

    //Listen on the message event
    socket.on("message", (data)=> {

        if (data.text === "@currentUsers") {
            //We are passing the current socket a.k.a the "user"
            sendCurrentUsers(socket);
        } else {
            //socket.broadcast.emit will emit to everyone but the browser that sent the message.
            //if we wanted to emit to everyone, including the browser that sent the message we would use io.emit
            //Again we pass the emit method two argument s the first is the type and the second is the data that we received.
            //Note .valueOf() returns the JavaScript unix timestamp in ms
            data.time = moment().valueOf();
            //We only emit message to users in the same room
            io.to(clientInfo[socket.id].room).emit("message", data);
        }


    });

    //.emit takes two arguments. The first is the name which can be anything we want.
    //The second argument is data to send. It is recommended to use an object.
    socket.emit("welcome", {
        text: "Welcome to this most awesome chat application"
    });
});

http.listen(PORT, ()=> {
    console.log(`Server started on port ${PORT}`)
});