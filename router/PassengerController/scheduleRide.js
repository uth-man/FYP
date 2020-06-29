const db = require("../../model/index").db;
const express = require("express");

const router = express.Router();

router.get('/scheduleRide', (req, res) => {
    console.log(req.session.user);

    res.render('scheduleRide', { data: req.session.user })
})
let scheduledRides = require('../../model/index');
router.post('/saveSchedule', scheduledRides.createScheduleRides, (req, res) => {
    console.log(req.body);

    let sql = `INSERT INTO scheduledrides 
    (role,name , phone, email, numberOfPassengers, origion,destination, pickDate, pickTime)
    VALUES ('${req.body.role}','${req.session.name}','${req.session.user.phone}','${req.session.email}','${req.body.numberOfPassengers}','${req.body.origin}','${req.body.destination}','${req.body.pickDate}','${req.body.pickTime}')`

    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.redirect('schedule/all-schedules-rides');

        }
    })
})
module.exports = router