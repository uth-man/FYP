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


// Home
app.get('/passengerhome', (req, res) => {
  res.render('passengerMap', { data: req.session.user })
})


app.get('/driverhome', (req, res) => {
  res.render('driverMap', { data: req.session.driver })
})

// ---------------------------- APIS -----------------------

let apis = require('./apis')
app.use('/api', apis)

//-------------------------------- Basic Routing ------------------

let basicRouting = require("./viewsController");

app.use("/", basicRouting);

//--------------------------------Passenger Controller------------------

let passengerSignup = require("./PassengerController/passengerSignup");
let passengerLogin = require("./PassengerController/passengerLogin");
let passengerMap = require("./PassengerController/passengerMap");


app.use("/passengersignup", passengerSignup);
app.use("/passengerlogin", passengerLogin);
app.use('/passenger', passengerMap);


//--------------------------------Schedule Ride Controller------------------

let schedule = require('./ScheduleRideController/schedule')

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
