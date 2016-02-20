//Our front end JavaScript

var socket = io();

//This will log on the browser console
socket.on("connect", ()=>{
    console.log("Connected to socket.io server");
});
//Listen to the emit. First argument is the emit name, second argument is the callback with our data.
socket.on("message", (data)=>{
    console.log(data);
});