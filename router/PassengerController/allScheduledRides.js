const db = require("../../model/index").db;
const express = require("express");
const router = express.Router();

router.get('/all-schedules-rides', (req, res) => {

    let sql = "SELECT * FROM scheduledrides"
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);

        } else {
            res.render('allScheduledRides', { data: req.session, rides: result })
        }
    })


})

module.exports = router