const db = require("../../model/index").db;
var express = require('express');
var router = express.Router();
let pickupLocation;
let allDrivers = [];
let closestDriver = [];
let passengerSocketId;

var distance = require('google-distance-matrix');


router.post('/cancel-ride', (req, res) => {
    let sql = `UPDATE bookingdetails SET status='cancelled'
    WHERE passengerEmail='${req.body.passengerEmail}'
    AND driverEmail='${req.body.driveEmail}'`;

    db.query(sql, (err, result) => {
        if (err) {
            return console.log(err)
        } else {
            let setDriverOffline = `UPDATE driver SET isOnline=1 WHERE email='${req.body.driverEmail}'`;
            db.query(setDriverOffline, (err1, result1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    return res.render('passengerMapPick', { data: req.session.user })

                }
            })

        }
    })
})

router.get('/coordinates', (req, res) => {

    let sql = `SELECT socketId from passenger where email='${req.session.email}'`;

    db.query(sql, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            passengerSocketId = result[0].socketId;
        }
    })



    req.session.coordinates = {
        origin: {
            lat: req.query.latitude,
            lng: req.query.longitude
        }
    }

    res.render('passengerMapDropoff', { data: req.session });
})
///passenger/coordinates/findride
let bookingDetails = require('../../model/index')
router.get('/coordinates/findride', bookingDetails.createTableBookingDetails, (req, res) => {

    req.session.user = {
        ...req.session.user,
        passengerSocketId
    }



    req.session.coordinates = {
        ...req.session.coordinates,
        destination: {
            lat: req.query.dropLat,
            lng: req.query.dropLng
        }
    }

    // Finding Drivers

    console.log("-------------------------------------------------");
    console.log(req.session);
    console.log("-------------------------------------------------");


    let sql =
        "SELECT name,email,phone,currentLocation,picture,licensePlate,socketId FROM driver WHERE isOnline=1 AND isVerified=1";
    db.query(sql, (error, result) => {

        pickupLocation = req.session.coordinates.origin.lat + ',' + req.session.coordinates.origin.lng
        if (error) {
            res.send(error);

        } else {
            // setting array back to empty
            allDrivers = [];
            for (let i = 0; i < result.length; i++) {
                distanceCalculator(result[i].name, result[i].email, result[i].phone, result[i].licensePlate, result[i].picture, result[i].socketId, result[i].currentLocation)

            }
            setTimeout(() => { displayAllDriverDetails() }, 1000 * 2)
            setTimeout(() => { findNearest() }, 1000 * 2)
        }
    })
    setTimeout(() => {
        if (allDrivers.length == 0) {
            res.send("All Rides are busy")
        } else {


            let sql =
                `INSERT INTO bookingdetails (passengerName,passengerSocketId,passengerEmail,passengerPhone,driverName,driverEmail,origion,destination,passengers)
                VALUES ('${req.session.name}','${req.session.user.passengerSocketId}','${req.session.email}','${req.session.user.phone}','${closestDriver.name}','${closestDriver.email}','${req.session.coordinates.origin.lat} ${req.session.coordinates.origin.lng}','${req.session.coordinates.destination.lat} ${req.session.coordinates.destination.lng}',1)`
            db.query(sql, (error, result) => {
                if (error) {
                    console.log(error);

                } else {
                    console.log("BookingDetails updated successfully");

                }
            })
            res.render('findRide', { data: req.session, driver: closestDriver })
        }
    }, 1000 * 3)

})



function distanceCalculator(name, email, phone, licensePlate, picture, socketId, driverLocation) {

    var origins = [pickupLocation];
    var destinations = [driverLocation];

    distance.key(process.env.MAP_KEY);
    distance.units('metric');

    distance.matrix(origins, destinations, function (err, distances) {
        if (err) {
            return console.log(err);
        }

        if (distances.status == 'OK') {

            allDrivers.push({
                name: name,
                email: email,
                phone: phone,
                licensePlate: licensePlate,
                picture: picture,
                socketId: socketId,
                currentLocation: driverLocation,
                distance: distances.rows[0].elements[0].distance,
                time: distances.rows[0].elements[0].duration
            })
        }
    });
}
function displayAllDriverDetails() {
    // console.log(allDrivers);
}
function findNearest() {
    if (!allDrivers.length == 0) {
        const closest = allDrivers.reduce(
            (acc, loc) =>

                acc.distance.value < loc.distance.value
                    ? acc
                    : loc
        )
        closestDriver = closest
        // console.log("Closest Driver");
        // console.log(closestDriver);
    }
}
module.exports = router