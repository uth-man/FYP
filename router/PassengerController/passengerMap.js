const db = require("../../model/index");
const bcryptjs = require("bcryptjs");
const express = require("express");
const app = express();
const router = express.Router();

router.get('/coordinates', (req, res) => {

    req.session.coordinates = {
        origin: {
            lat: req.query.latitude,
            lng: req.query.longitude
        }
    }
    console.log(req.session);

    res.render('passengerMapDropoff', { data: req.session });
})

router.get('/coordinates/findride', (req, res) => {

    req.session.coordinates = {
        ...req.session.coordinates,
        destination: {
            lat: req.query.dropLat,
            lng: req.query.dropLng
        }
    }
    console.log(req.session);
    res.send("Finding Driver");


})


module.exports = router