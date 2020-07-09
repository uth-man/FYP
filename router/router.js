const express = require('express');
const app = express();

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("assets/"));
//app.use("/assets", express.static("assets"));

const session = require("express-session");
app.use(
  session({
    secret: "kjdsfljflrejfiasjf",
    resave: true,
    saveUninitialized: true,
  })
);

//--------------------------------Passenger Controller------------------

let basicRouting = require("./viewsController");
let passengerSignup = require("./PassengerController/passengerSignup");
let passengerLogin = require("./PassengerController/passengerLogin");
let passengerMap = require("./PassengerController/passengerMap");

let schedule = require('./ScheduleRideController/schedule')

// ---------------------------- APIS -----------------------
let apis = require('./apis')
app.use('/api', apis)

//-------------------------------- Basic Routing ------------------


app.use("/", basicRouting);

//--------------------------------Passenger Controller------------------

app.use("/passengersignup", passengerSignup);
app.use("/passengerlogin", passengerLogin);
app.use('/passenger', passengerMap)

//--------------------------------Schedule Ride Controller------------------

app.use('/schedule', schedule)

//--------------------------------Driver Controller------------------

driverSignup = require("./DriverController/driverSignup");
driverLogin = require("./DriverController/driverLogin");
driverPic = require("./DriverController/driverPic");
app.use("/driversignup", driverSignup);
app.use("/upload", driverLogin);
app.use("/providing", driverPic);

//--------------------------------Admin Controller------------------

adminLogin = require("./AdminController/adminLogin");
app.use("/admindashboard", adminLogin);

module.exports = app
