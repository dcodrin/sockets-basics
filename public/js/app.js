//Our front end JavaScript
var name = getQueries(window.location.search).name;
var room = getQueries(window.location.search).room;
var socket = io();

//Get queries formatted as object. The query string will come from window.location.search
function getQueries(queryString) {
    //First we remove the "?" then we split the string by "$"
    var query = queryString.substring(1).split('&');
    //We then build our object
    var params =  query.reduce((acc, next)=>{
        var split = next.split("=");
        //Ensure that we decode spaces and special characters. Note that we replace the "+" with a space using regex, this is done because when we submit a form it treats spaces as plus signs in input fields.
        //Also note that we first run the replace method and only then do we decode the data. This is done so as to allow actual "+" signs imputed by the user to through.
        acc[decodeURIComponent(split[0])] = decodeURIComponent(split[1].replace(/\+/g," "));
        return acc;
    }, {});
    return params;
}

//This will log on the browser console
socket.on("connect", ()=> {
    console.log("Connected to socket.io server");
    socket.emit("joinRoom", {
        name: name,
        room: room
    });
    var greeting = room ? `Welcome to the ${room} room` : `Welcome to the internetz!`;
    $(".welcome").append(
        `
        <h1>${greeting}</h1>
        `
    );
});


//Listen to the emit. First argument is the emit name, second argument is the callback with our data.
socket.on("message", (data)=> {
    //We will append the incoming messages
    //The servers sends us the unix time. We then convert it to the local time.
    var timeStamp = moment.utc(data.time);
    timeStamp = timeStamp.local().format("Do MMM YYYY, h:mm a");

    $(".messages").append(
        `
        <div class="message"><h3>${data.text}</h3>
            <p class="poster">Posted by: ${data.name ? data.name : "Anonymous"}</p>
            <strong class="timeStamp"> Posted on: ${timeStamp ? timeStamp : ""}</strong>
        </div>
        `
    )
});

//In this section we will handle submission of new messages

//Use jQuery to select our form;
var $form = $("#message-form");

$form.on("submit", (event)=> {
    //Use preventDefault() to prevent the form from refreshing the page
    event.preventDefault();

    //If an element is to be used more that once, store it in a variable to avoid traversing the dome multiple times.
    var $message = $form.find("input[name=message]");

    socket.emit("message", {
        //Use the .find() to find an input field by attributes
        //Notice how we are selecting the input field that has an attribute name that is set to message. We then use the val() method to extract the value of that input field.
        text: $message.val(),
        name: name
    });

    //Clear the input field after sending the message.
    $message.val("");
});