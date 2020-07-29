const db = require("../../model/index").db;
var express = require('express');
var router = express.Router();

router.get('/carpool', (req, res) => {

    let sql = "SELECT * from buddyridesdetails WHERE status='matching'"
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);

        } else {
            console.log(result);
        }
    })
})

module.exports = router