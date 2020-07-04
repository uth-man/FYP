const express = require('express');
const app = express();
let http = require('http').Server(app);
let io = require("socket.io")(http)

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
let scheduleRide = require('./PassengerController/scheduleRide')
let carpool = require('./PassengerController/carpool')
let allScheduleRides = require('./PassengerController/allScheduledRides')


// ---------------------------- APIS -----------------------
let apis = require('./apis')
app.use('/api', apis)

//-------------------------------- Basic Routing ------------------


app.use("/", basicRouting);

//--------------------------------Passenger Controller------------------

app.use("/passengersignup", passengerSignup);
app.use("/passengerlogin", passengerLogin);
app.use('/passenger', passengerMap)
app.use('/passenger', scheduleRide)
app.use('/passenger/schedule', allScheduleRides)
//app.use('/passenger', carpool)

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

module.exports = { app: app, io: io };
