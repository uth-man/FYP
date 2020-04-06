const express = require("express");
const router = express.Router();
const db = require("../model/index");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact");
});

router.get("/services", (req, res) => {
  res.render("services");
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/passengersignup", (req, res) => {
  res.render("passengerSignUp");
});

router.get("/driversignup", (req, res) => {
  res.render("driverSignUp");
});

router.get("/passengerlogin", (req, res) => {
  if (
    req.session.user !== undefined &&
    req.session.user.category === "passenger"
  ) {
    console.log(req.session.user);
    return res.render("passengerMap", { data: req.session.user });
  } else {
    res.render("passengerLogin");
  }
});

router.get("/driverlogin", (req, res) => {
  if (
    req.session.user !== undefined &&
    req.session.user.category === "driver"
  ) {
    console.log(req.session.user);
    return res.render("driverMap", { data: req.session.user });
  } else {
    res.render("driverLogin");
  }
});

router.get("/admin", (req, res) => {
  res.render("admin", { error: "" });
});
module.exports = router;
