const express = require("express");
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.set("view engine", "ejs");
app.use(express.static("assets"));
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

basicRouting = require("./viewsController");
passengerSignup = require("./PassengerController/passengerSignup");
passengerLogin = require("./PassengerController/passengerLogin");

app.use("/", basicRouting);
app.use("/passengersignup", passengerSignup);
app.use("/passengerlogin", passengerLogin);

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

module.exports = app;
