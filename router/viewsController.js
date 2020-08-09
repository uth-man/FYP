const db = require("../model/index").db;
const express = require("express");
const router = express.Router();

const createFeedbackTable = require("../model/index").createFeedbackTable


router.get("/", (req, res) => {
  res.render("index");
});

router.get("/about", (req, res) => {
  res.render("about");
});

router.get("/contact", (req, res) => {
  res.render("contact", { user: req.session });
});


router.get("/contact/feedbacks", createFeedbackTable, (req, res) => {
  if (!req.session.user) {
    return res.redirect('/login')
  }
  let insertData = `INSERT INTO userfeedback (email,name,subject,feedbackDescription)
  VALUES ('${req.query.name}','${req.query.email}','${req.query.subject}','${req.query.userMessage}')`

  db.query(insertData, (err, result) => {
    if (err) {
      return console.log(err);
    }
    return res.redirect('/contact')
  })
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
    return res.render("passengerMapPick", { data: req.session.user });
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

const createAdmin = require('../model/index').createTableAdmin

router.get("/admin", createAdmin, (req, res) => {
  res.render("admin", { error: "" });
});
module.exports = router;
