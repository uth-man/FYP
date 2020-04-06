const db = require("../../model/index");
const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();

router.post("/", async (req, res) => {
  let drivers = "SELECT * FROM driver";
  db.query(drivers, async (err, result) => {
    if (err) {
      throw err;
    } else if (result.find(res => res.email === req.body.email)) {
      let error =
        "ERROR: an account Already exists across this email.. Try Logging in";
      res.render("driverSignUp", { error: error });
      return;
    } else {
      let salt = await bcryptjs.genSalt();
      let password = await bcryptjs.hash(req.body.password, salt);

      let info = {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        password: password,
        gender: req.body.gender,
        cnic: req.body.cnic,
        drivingLicense: req.body.drivingLicense,
        vehicleEngine: req.body.vehicleEngine,
        vehicleModel: req.body.vehicleModel,
        licensePlate: req.body.licensePlate,
        vehicleClass: req.body.vehicleClass,
        vehicleType: req.body.vehicleType
      };
      let sql = "INSERT INTO driver SET ? ";
      db.query(sql, info, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.render("driverLogin", { error: "" });
        }
      });
    }
  });
});
module.exports = router;
