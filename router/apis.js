const db = require("../model/index").db;
const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();

router.get('/passengers', (req, res) => {
    let sql = "SELECT * FROM passenger";
    db.query(sql, (error, result) => {
        if (erorr) {
            res.json(error)
        } else {
            res.json(result)
        }
    })
})

module.exports = router