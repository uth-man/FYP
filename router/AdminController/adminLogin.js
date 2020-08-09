const db = require("../../model/index").db;
const express = require("express");
const router = express.Router();


router.get('/home', (req, res) => {
  res.render("adminDashboard")
})

router.post("/", (req, res) => {
  let sql = "SELECT * FROM admin";
  db.query(sql, (err, result) => {
    if (err) {
      return console.log(err);

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
          return res.render("adminDashboard", { name: result[i].name });
        }
      }
      if (data == null) {
        let error = "Error : Wrong Admin Details";
        return res.render("admin", { error: error });
      }
    }
  });
});

router.get("/passenger", (req, res) => {
  let sql = "SELECT * FROM passenger";
  db.query(sql, (err, result) => {
    if (err) {
      return console.log(err);

    } else {
      return res.render("dashboardPassenger", { result: result });
    }
  });
});

router.get("/driver", (req, res) => {
  let sql = "SELECT * FROM driver WHERE isVerified = true";
  db.query(sql, (err, result) => {
    if (err) {
      return console.log(err);

    } else {
      return res.render("dashboardDriver", { result: result });
    }
  });
});

router.get("/requests", (req, res) => {
  let sql = "SELECT * FROM driver WHERE isVerified = false";
  db.query(sql, (err, result) => {
    if (err) { return console.log(err); }

    return res.render("dashboardRequests", { result: result });
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

router.get("/updateDriver/:id", (req, res) => {
  // res.json(req.params.id)
  let sql = `SELECT * FROM driver WHERE id=${req.params.id}`
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);

    } else {
      res.render('updateDrivers', { result: result[0] })
    }
  })
})

router.get('/individualridesdetails', (req, res) => {
  let sql = "SELECT * FROM casualridesdetails";
  db.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    else {
      res.status(200).render("bookingDetails", { result: result })
    }
  })
})

router.get('/buddyridesdetails', (req, res) => {
  let sql = "SELECT * FROM buddyridesdetails";
  db.query(sql, (err, result) => {
    if (err) {
      return console.log(err);
    }
    else {
      res.status(200).render("bookingDetails", { result: result })
    }
  })
})

module.exports = router;
