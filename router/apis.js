const db = require("../model/index").db;
const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();


// ------------------------------- All Passengers 
router.get('/passengers', (req, res) => {
    let sql = "SELECT * FROM passenger";
    db.query(sql, (error, result) => {
        if (error) {
            res.json(error)
        } else {
            res.json(result)
        }
    })
})

// ------------------------------- Passenger search by id

router.get('/passengers/:id', (req, res) => {
    let sql = `SELECT * FROM passenger WHERE id=${req.params.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            res.json(error)
        } else {
            res.json(result)
        }
    })
})



// ---------------------------------- All Drivers -----------------------

router.get('/drivers', (req, res) => {
    let sql = "SELECT * FROM driver";
    db.query(sql, (error, result) => {
        if (error) {
            res.json(error)
        } else {
            res.json(result)
        }
    })
})

// ------------------------------- Driver search by id -------------------------------

router.get('/drivers/:id', (req, res) => {
    let sql = `SELECT * FROM driver WHERE id=${req.params.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            res.json(error)
        } else {
            res.json(result)
        }
    })
})


module.exports = router