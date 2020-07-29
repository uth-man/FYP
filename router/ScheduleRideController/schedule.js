const db = require("../../model/index").db;
const express = require('express');
const router = express.Router();



// For Passenger Home
// router.get('/backtobooking', (req, res) => {
//     res.render('passengerMapPick', { data: req.session.user })
// })

router.get('/scheduleRide', (req, res) => {

    res.render('scheduleRide', { data: req.session.driver })
})


let scheduledRides = require('../../model/index');
router.post('/saveSchedule', scheduledRides.createScheduleRides, (req, res) => {
    console.log(req.body);

    let sql = `INSERT INTO scheduledrides 
    (name, phone, email, numberOfPassengers, origion,destination, pickDate, pickTime)
    VALUES ('${req.session.driver.name}','${req.session.driver.phone}','${req.session.driver.email}','${parseInt(req.body.numberOfPassengers)}','${req.body.origin}','${req.body.destination}','${req.body.pickDate}','${req.body.pickTime}')`

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
            res.redirect(`/schedule/myschedule/${req.session.driver.email}`)
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

            res.render('mySchedules', { result: result, data: req.session.driver })
        }
    })
})

router.get('/passenger/all-scheduled-rides', (req, res) => {

    let sql = "SELECT * FROM scheduledrides"
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);

        } else {
            res.render('allScheduledRidesPassenger', { data: req.session.user, rides: result })
        }
    })


})


router.get('/all-scheduled-rides', (req, res) => {

    let sql = "SELECT * FROM scheduledrides"
    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);

        } else {
            res.render('allScheduledRides', { data: req.session.driver, rides: result })
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
            if (number >= 4) {
                return res.json({ failed: { msg: "Seats filled" } })
            }
            number++;
            let sql1 = `UPDATE scheduledrides SET numberOfPassengers=${number} WHERE id=${req.params.id}`
            db.query(sql1, (err1, result1) => {
                if (err1) {
                    return console.log(err1);

                } else {
                    res.redirect('/schedule/passenger/all-scheduled-rides');

                }
            })
        }
    })
})

router.get('/findschedule', (req, res) => {

    let sql = `SELECT * FROM scheduledrides WHERE origion='${req.query.origion}'
    AND destination='${req.query.destination}'`

    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            res.render('allScheduledRidesPassenger', { data: req.session.user, rides: result })
        }
    })

})


module.exports = router