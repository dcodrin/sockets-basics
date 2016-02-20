var socket = io();

//This will log on the browser console
socket.on("connect", ()=>{
    console.log("Connected to socket.io server");
});