const db = require("../../model/index").db;
var express = require('express');
let app = express();
var router = express.Router();
let pickupLocation;
let allDrivers = [];
let closestDriver = [];

var distance = require('google-distance-matrix');


// ============== CASUAL RIDE ===========================

router.get('/casualride', (req, res) => {
    res.render("passengerCasualRide", { data: req.session.user })
})

router.get('/casualride/coordinates', (req, res) => {

    req.session.user.coordinates = {
        ...req.session.user.coordinates,
        origin: {
            lat: req.query.latitude,
            lng: req.query.longitude
        }
    }
    res.render('passengerCasualRideDropoff', { data: req.session.user });
})



// ============== BUDDY RIDE ============================

router.get('/buddyride', (req, res) => {
    res.render("passengerBuddyRide", { data: req.session.user })
})

router.get('/buddyride/coordinates', (req, res) => {

    req.session.user.coordinates = {
        ...req.session.user.coordinates,
        origin: {
            lat: req.query.latitude,
            lng: req.query.longitude
        }
    }
    res.render('passengerBuddyRideDropoff', { data: req.session.user });
})


//  /passenger/coordinates/findride

let casualRides = require('../../model/index')

router.get('/findpool', (req, res) => {

    req.session.user.coordinates = {
        ...req.session.user.coordinates,
        destination: {
            lat: req.query.dropLat,
            lng: req.query.dropLng
        }
    }

    console.log("============Pooling===============");
    console.log(req.session);
    console.log("==================================");
    let sql = `SELECT socketId FROM passenger WHERE email='${req.session.user.email}'`
    db.query(sql, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            req.session.user.socketId = result[0].socketId
            console.log(req.session.user);
        }
    })
    res.render('passengerAllPools', { data: req.session.user, fare: req.query.fare })

})
router.get('/findpool/requestpool', (req, res) => {
    res.render('finalPool', { data: req.session.user, fare: req.query.fare, rideId: req.query.nearestRideId })
})
router.get('/casualride/coordinates/findride', casualRides.createCasualRidesDetails, (req, res) => {


    req.session.user.coordinates = {
        ...req.session.user.coordinates,
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

        pickupLocation = req.session.user.coordinates.origin.lat + ',' + req.session.user.coordinates.origin.lng
        if (error) {
            return console.log(error);

        } else {
            // setting array back to empty
            allDrivers = [];
            for (let i = 0; i < result.length; i++) {
                distanceCalculator(result[i].name, result[i].email, result[i].phone, result[i].licensePlate, result[i].picture, result[i].socketId, result[i].currentLocation)

            }
            setTimeout(() => { findNearest() }, 1000 * 2)
        }
    })
    setTimeout(() => {
        if (allDrivers.length == 0) {
            res.send("All Rides are busy")
        } else {
            let sql =
                `INSERT INTO casualRidesDetails (passengerName,passengerEmail,passengerPhone,passengerSocket,driverName,driverEmail,driverPhone,origion,destination,passengers,status,fare)
                VALUES ('${req.session.user.name}','${req.session.user.email}',
                '${req.session.user.phone}','...','${closestDriver.name}',
                '${closestDriver.email}','${closestDriver.phone}',
                '${req.session.user.coordinates.origin.lat} ${req.session.user.coordinates.origin.lng}',
                '${req.session.user.coordinates.destination.lat} ${req.session.user.coordinates.destination.lng}',1,'matching','${req.query.fare}')`
            db.query(sql, (error, result) => {
                if (error) {
                    console.log(error);

                } else {

                    req.session.user.bookingId = result.insertId;
                    req.session.user.tableName = "casualRidesDetails"

                    console.log("CasualRidesDetails updated successfully");
                    setTimeout(() => {
                        res.render('findRide', { data: req.session.user, driver: closestDriver })
                    }, 1500);

                }
            })

        }
    }, 1000 * 3)
})


let buddyRide = require('../../model/index')
router.get("/buddyride/coordinates/findride", buddyRide.createBuddyRidesDetails, (req, res) => {

    req.session.user.coordinates = {
        ...req.session.user.coordinates,
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

        pickupLocation = req.session.user.coordinates.origin.lat + ',' + req.session.user.coordinates.origin.lng
        if (error) {
            return console.log(error);

        } else {
            // setting array back to empty
            allDrivers = [];
            for (let i = 0; i < result.length; i++) {
                distanceCalculator(result[i].name, result[i].email, result[i].phone, result[i].licensePlate, result[i].picture, result[i].socketId, result[i].currentLocation)

            }
            setTimeout(() => { findNearest() }, 1000 * 2)
        }
    })
    setTimeout(() => {
        if (allDrivers.length == 0) {
            res.send("All Rides are busy")
        } else {
            let sql =
                `INSERT INTO buddyRidesDetails (passengerName,passengerEmail,passengerPhone,passengerSocket,driverName,driverEmail,driverPhone,origion,destination,passengers,status,fare)
                VALUES ('${req.session.user.name}','${req.session.user.email}',
                '${req.session.user.phone}','...',
                '${closestDriver.name}','${closestDriver.email}',
                '${closestDriver.phone}',
                '${req.session.user.coordinates.origin.lat} ${req.session.user.coordinates.origin.lng}',
                '${req.session.user.coordinates.destination.lat} ${req.session.user.coordinates.destination.lng}',1,'matching','${req.query.fare}')`
            db.query(sql, (error, result) => {
                if (error) {
                    console.log(error);

                } else {

                    console.log("BuddyRidesDetails updated successfully");
                    console.log(result.insertId);

                    req.session.user.bookingId = result.insertId
                    req.session.user.tableName = "buddyRidesDetails"
                    console.log(req.session.user);
                    console.log("======================================");
                    res.render('findRide', { data: req.session.user, driver: closestDriver })
                }
            })
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

function findNearest() {
    if (!allDrivers.length == 0) {
        const closest = allDrivers.reduce(
            (acc, loc) =>
                acc.distance.value < loc.distance.value
                    ? acc
                    : loc
        )
        closestDriver = closest
    }
}


// ============== cancel ride ===========================

router.post('/cancel-ride', (req, res) => {

    let sql = `UPDATE ${req.session.user.tableName} SET status='cancelled'
    WHERE id='${req.session.user.bookingId}'`;

    db.query(sql, (err, result) => {
        if (err) {
            return console.log(err)
        } else {
            let setDriverOnline = `UPDATE driver SET isOnline=1 WHERE email='${req.body.driverEmail}'`;
            db.query(setDriverOnline, (err1, result1) => {
                if (err1) {
                    console.log(err1);
                } else {
                    return res.render('passengerMap', { data: req.session.user })
                }
            })
        }
    })
})

module.exports = router