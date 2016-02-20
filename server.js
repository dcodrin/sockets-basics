var PORT = process.env.PORT || 3000;
var express = require("express");
var app = express();
//This tells Node to start a new server and to use the express app as a boilerplate.
var http = require("http").Server(app);

//We are exposing a folder
app.use(express.static(__dirname + "/public"));

http.listen(PORT, ()=>{
    console.log(`Server started on port ${PORT}`)
});