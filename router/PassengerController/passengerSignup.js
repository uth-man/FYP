const db = require("../../model/index").db;
const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let valid = `SELECT email FROM passenger`;
  db.query(valid, async (err, result) => {
    if (err) {
      throw err;
    } else if (result.find(res => res.email === req.body.email)) {
      let error =
        "ERROR: An account already exists across this Email.. Try Logging in";
      res.render("passengerSignUp", { error: error });
    } else {
      let salt = await bcryptjs.genSalt();
      let password = await bcryptjs.hash(req.body.password, salt);
      let info = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: password
      };
      let sql = "INSERT INTO passenger SET ?";
      db.query(sql, info, (err, result) => {
        if (err) {
          throw err;
        } else {
          return res.render("passengerLogin");
        }
      });
    }
  });
});
module.exports = router;
