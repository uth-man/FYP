const db = require("../../model/index");
const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();

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
            category: "driver"
          };
          req.session.user = data;
          if (!req.session.user.picture) {
            console.log(req.session);

            return res.render("driverPic", { data: req.session.user });
          } else {
            return res.render("driverMap", { data: req.session.user });
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
  req.session.destroy();
  if (req.session === undefined) {
    console.log("destroyed");
  }

  res.redirect("/driverlogin");
});
module.exports = router;
