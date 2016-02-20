var moment = require("moment");

var now = moment();


//This will only print the time.
console.log(moment().format('h:mm a'));

now.subtract(1, "year");
//This will store the time.
var timestampMoment = moment.utc("pass the unix time in here");

//This will print the date and time with the month abbreviated
console.log(moment().format('Do MMM YYYY, h:mm a'));

//This will print the unix time stamp, which is in seconds.
console.log(moment().format('X'));


//This will print the javascript unix time stamp, which is in milliseconds
console.log(moment().format('x'));