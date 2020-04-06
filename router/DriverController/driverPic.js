const db = require("../../model/index");
const bcryptjs = require("bcryptjs");
const express = require("express");
const multer = require("multer");
const path = require("path");
const router = express.Router();
//---------------------------------setting Up Multer--------------------
const storage = multer.diskStorage({
  destination: "assets/uploads",
  filename: function(req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + path.extname(file.originalname)
    );
  }
});
//--------------------------------Initialize upload----------------------
const upload = multer({
  storage: storage,
  limits: { fileSize: 10000000 },
  fileFilter: function(req, file, cb) {
    checkFileType(file, cb);
  }
}).single("pic");

function checkFileType(file, cb) {
  //Allowed extentions
  const filetypes = /jpeg|jpg|png|gif/;
  //check extention
  const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = filetypes.test(file.mimetype);

  if (mimeType && extname) {
    return cb(null, true);
  } else {
    cb("Error: Images Only");
  }
}

router.post("/", (req, res) => {
  upload(req, res, err => {
    if (err) {
      res.render("driverPic", { msg: err });
    } else {
      let address = `/uploads/${req.file.filename}`;
      console.log(req.session);

      req.session.user.picture = address;
      let sql = `UPDATE driver SET picture = '${address}' WHERE email = '${req.session.user.email}'`;
      db.query(sql, (err, result) => {
        if (err) {
          console.log("Something Went Wrong");
          return res.render("driverPic", { msg: err });
        } else {
          res.render("driverMap", { data: req.session.user });
        }
      });
    }
  });
});
module.exports = router;
