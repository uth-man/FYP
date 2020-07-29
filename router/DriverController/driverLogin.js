const db = require("../../model/index").db;
const bcryptjs = require("bcryptjs");
const express = require("express");
const session = require("express-session");
const router = express.Router();

const createDriverTable = require("../../model/index").createDriverTable;

router.post("/", createDriverTable, async (req, res) => {

  let sql = "SELECT * FROM driver";
  db.query(sql, async (err, result) => {
    if (err) {
      throw err;
    } else {
      let data;
      let error;
      for (let i = 0; i < result.length; i++) {
        if (
          result[i].email === req.body.email &&
          (await bcryptjs.compare(req.body.password, result[i].password))
        ) {
          if (result[i].isVerified === 0) {
            return res.send(
              "<h1>You are not Authorized yet..<br/>Kindly Contact Your Admin</h1>"
            );
          }
          req.session.email = req.body.email;
          req.session.pass = req.body.password;
          req.session.name = result[i].name;
          req.session.id = result[i].id;
          data = {
            name: req.session.name,
            email: req.session.email,
            phone: result[i].phone,
            id: req.session.id,
            picture: result[i].picture,
            category: "driver",
            key: process.env.MAP_KEY,
          };
          req.session.driver = data;
          if (!req.session.driver.picture) {
            console.log(req.session);

            return res.render("driverPic", { data: req.session.driver });
          } else {
            console.log(req.session);

            // Setting isOnline to true in DB
            let sql = `UPDATE driver SET isOnline=1 WHERE email='${req.session.driver.email}' `;
            db.query(sql, (error, result) => {
              if (error) {
                console.log(error);
              }
            })
            return res.render("driverMap", {
              data: data,
            });
          }
        }
      }
      if (data == null) {
        error = "ERROR : Invalid Email or Password";
        return res.render("driverLogin", { error: error });
      }
    }
  });
});
router.get("/logout", setOffline, (req, res) => {

  req.session.destroy();
  if (req.session === undefined) {
    console.log("destroyed");
    res.redirect("/driverlogin");
  }

});

// Setting isOnline for driver to False in DB

function setOffline(req, res, next) {
  let sql = `UPDATE driver SET isOnline=0 WHERE email='${req.session.driver.email}'`;

  db.query(sql, (error, result) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Driver is set offline");
      next()
    }
  })


}

module.exports = router

