const db = require("../../model/index");
const bcryptjs = require("bcryptjs");
const express = require("express");
const app = express();
const router = express.Router();

router.post("/watching", async (req, res) => {
  let sql = "SELECT * FROM passenger";
  db.query(sql, async (err, result) => {
    if (err) {
      throw err;
    } else {
      let data;
      for (let i = 0; i < result.length; i++) {
        if (
          result[i].email === req.body.email &&
          (await bcryptjs.compare(req.body.password, result[i].password))
        ) {
          req.session.email = req.body.email;
          req.session.pass = req.body.password;
          req.session.name = result[i].name;
          req.session.id = result[i].id;

          data = {
            id: req.session.id,
            name: req.session.name,
            phone: result[i].phone,
            email: req.session.email,
            category: "passenger",
            key: process.env.MAP_KEY,
          };
          req.session.user = data;
          console.log(req.session);

          if (req.session === undefined) {
            res.render("passengerLogin", { error: "Try Logging In Again" });
          } else {
            res.render("passengerMap", {
              data: data,
            });
          }
        }
      }
      if (data == null) {
        let error = "ERROR : Invalid Email or Password!";
        res.render("passengerLogin", { error: error });
      }
    }
  });
});

router.get("/logout", (req, res) => {
  req.session.destroy();
  if (req.session === undefined) {
    console.log("session destroyed");
  }

  res.redirect("/passengerlogin");
});
module.exports = router;
