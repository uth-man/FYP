const db = require("../../model/index").db;
const express = require("express");
const router = express.Router();

router.post("/", (req, res) => {
  let sql = "SELECT * FROM admin";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      let data;
      for (let i = 0; i < result.length; i++) {
        if (
          req.body.name === result[i].name &&
          req.body.email === result[i].email &&
          req.body.password === result[i].password
        ) {
          data = {
            name: result[i].name,
            email: result[i].email,
            password: result[i].password
          };
          res.render("adminDashboard", { name: result[i].name });
        }
      }
      if (data == null) {
        let error = "Error : Wrong Admin Details";
        res.render("admin", { error: error });
      }
    }
  });
});

router.get("/passenger", (req, res) => {
  let sql = "SELECT * FROM passenger";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.render("dashboardPassenger", { result: result });
    }
  });
});

router.get("/driver", (req, res) => {
  let sql = "SELECT * FROM driver WHERE isVerified = true";
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      res.render("dashboardDriver", { result: result });
    }
  });
});

router.get("/requests", (req, res) => {
  let sql = "SELECT * FROM driver WHERE isVerified = false";
  db.query(sql, (err, result) => {
    if (err) throw err;
    res.render("dashboardRequests", { result: result });
  });
});

router.get("/verifydriver/:id", (req, res) => {
  let id = req.params.id;
  let sql = `UPDATE driver SET isVerified = true WHERE id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) {
      throw err;
    } else {
      let x = "SELECT * FROM driver WHERE isVerified = false";
      db.query(x, (err, result) => {
        if (err) {
          throw err;
        } else {
          res.redirect("/admindashboard/requests");
        }
      });
    }
  });
});

router.get("/blockDriver/:id", (req, res) => {
  let id = req.params.id;
  let sql = `UPDATE driver SET isVerified = false WHERE id = ${id}`;
  db.query(sql, (err, result) => {
    if (err) throw err;
    else {
      let x = "SELECT * FROM driver WHERE isVerified = true";
      db.query(x, (err, result) => {
        if (err) throw err;
        res.redirect("/admindashboard/driver");
      });
    }
  });
});

module.exports = router;
