const db = require("../../model/index").db;
const express = require('express');
const router = express.Router();

//schedule

router.get('/backtobooking', (req, res) => {
    res.render('passengerMapPick', { data: req.session.user })
})

router.get('/scheduleRide', (req, res) => {
    console.log(req.session.user);

    res.render('scheduleRide', { data: req.session.user })
})


let scheduledRides = require('../../model/index');
router.post('/saveSchedule', scheduledRides.createScheduleRides, (req, res) => {
    console.log(req.body);

    let sql = `INSERT INTO scheduledrides 
    (role,name , phone, email, numberOfPassengers, origion,destination, pickDate, pickTime)
    VALUES ('${req.body.role}','${req.session.name}','${req.session.user.phone}','${req.session.email}','${parseInt(req.body.numberOfPassengers)}','${req.body.origin}','${req.body.destination}','${req.body.pickDate}','${req.body.pickTime}')`

    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
        }
        else {
            res.redirect('/schedule/all-scheduled-rides');

        }
    })
})


router.get('/delete/:id', (req, res) => {
    let sql = `DELETE FROM scheduledrides WHERE id='${req.params.id}'`

    db.query(sql, (err, result) => {
        if (err) {
            return console.log(err);
        } else {
            res.redirect(`/schedule/myschedule/${req.session.user.email}`)
        }
    })
})

router.get('/myschedule/:email', (req, res) => {
    // res.json({ message: req.params.email })
    let sql = `SELECT * FROM scheduledrides WHERE email='${req.params.email}'`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {

            res.render('mySchedules', { result: result, data: req.session.user })
        }
    })
})



router.get('/all-scheduled-rides', (req, res) => {

    let sql = "SELECT * FROM scheduledrides"
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);

        } else {
            res.render('allScheduledRides', { data: req.session, rides: result })
        }
    })


})


router.get('/addpassenger/:id', (req, res) => {

    //res.json({ id: req.params.id })
    let sql = `SELECT numberOfPassengers FROM scheduledrides WHERE id=${req.params.id}`
    db.query(sql, (err, result) => {
        if (err) {
            return console.log(err);
        } else {

            let number = result[0].numberOfPassengers;
            if (number >= 5) {
                return res.json({ failed: { msg: "Seats filled" } })
            }
            number++;
            let sql1 = `UPDATE scheduledrides SET numberOfPassengers=${number} WHERE id=${req.params.id}`
            db.query(sql1, (err1, result1) => {
                if (err1) {
                    return console.log(err1);

                } else {
                    res.redirect('/schedule/all-scheduled-rides');

                }
            })
        }
    })


})


module.exports = router