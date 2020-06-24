const db = require("../../model/index");
const bcryptjs = require("bcryptjs");
const express = require("express");
const { request } = require("../router");
const router = express.Router();
// const socket = require('../../serverSocket')



router.post("/", async (req, res) => {
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
          req.session.user = data;
          if (!req.session.user.picture) {
            console.log(req.session);

            return res.render("driverPic", { data: req.session.user });
          } else {
            console.log(req.session);

            // Setting isOnline to true in DB
            let sql = `UPDATE driver SET isOnline=true WHERE email='${req.session.email}' `;
            db.query(sql, async (result, error) => {
              if (error) {
                console.log(error);
              }
            })
            console.log(data);
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
router.get("/logout", (req, res) => {

  // Setting isOnline to False in DB
  let sql = `UPDATE driver SET isOnline=false WHERE email='${req.session.email}' `;
  db.query(sql, async (result, error) => {
    if (error) {
      console.log(error);
    }
  })
  req.session.destroy();
  if (req.session === undefined) {
    console.log("destroyed");
  }

  res.redirect("/driverlogin");
});

module.exports = router

