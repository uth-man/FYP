const db = require("../model/index").db;
const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();


// ------------------------------- All Passengers 
router.get('/passengers', (req, res) => {
    let sql = "SELECT * FROM passenger";
    db.query(sql, (error, result) => {
        if (error) {
            res.status(502).json(error)
        } else {
            res.status(200).json(result)
        }
    })
})

// ------------------------------- Passenger search by id

router.get('/passengers/:id', (req, res) => {
    let sql = `SELECT * FROM passenger WHERE id=${req.params.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            res.status(502).json(error)
        } else {
            res.status(200).json(result)
        }
    })
})



// ---------------------------------- All Drivers -----------------------

router.get('/drivers', (req, res) => {
    let sql = "SELECT * FROM driver";
    db.query(sql, (error, result) => {
        if (error) {
            res.status(502).json(error)
        } else {
            res.status(200).json(result)
        }
    })
})

// ------------------------------- Driver search by id -------------------------------

router.get('/drivers/:id', (req, res) => {
    let sql = `SELECT * FROM driver WHERE id=${req.params.id}`;
    db.query(sql, (error, result) => {
        if (error) {
            res.status(502).json(error)
        } else {
            res.status(200).json(result)
        }
    })
})

// ======================== POSTS REQUESTS ============================


// ------------------------- Register Passenger ----------------------
router.post("/passenger/register", async (req, res) => {
    let valid = `SELECT email FROM passenger`;
    db.query(valid, async (err, result) => {
        if (err) {
            res.json(err);
        } else if (result.find(res => res.email === req.body.email)) {
            let error =
                "ERROR: An account already exists across this Email.. Try Logging in";
            res.status(409).json({ error: { msg: error } })
        } else {
            let salt = await bcryptjs.genSalt();
            let password = await bcryptjs.hash(req.body.password, salt);
            let info = {
                name: req.body.name,
                email: req.body.email,
                phone: req.body.phone,
                password: password
            };
            let sql = "INSERT INTO passenger SET ?";
            db.query(sql, info, (err, result) => {
                if (err) {
                    res.status(400).json(err);
                } else {
                    return res.status(200).json({ msg: "Record saved in database" })
                }
            });
        }
    });
});

// ---------------------------- Login Passenger -------------------------

router.post("/passenger/login", async (req, res) => {
    let sql = "SELECT * FROM passenger";
    db.query(sql, async (err, result) => {
        if (err) {
            throw err;
        } else {
            let data;
            for (let i = 0; i < result.length; i++) {
                if (
                    result[i].email === req.body.email &&
                    (await bcryptjs.compare(req.body.password, result[i].password))
                ) {
                    req.session.email = req.body.email;
                    req.session.pass = req.body.password;
                    req.session.name = result[i].name;
                    req.session.id = result[i].id;

                    data = {
                        id: req.session.id,
                        name: req.session.name,
                        phone: result[i].phone,
                        email: req.session.email,
                        category: "passenger",
                        key: process.env.MAP_KEY,
                    };
                    req.session.user = data;
                    console.log(req.session);

                    if (req.session === undefined) {
                        //   res.render("passengerLogin", { error: "Try Logging In Again" });
                        res.status(400).json({ error: "Try Loging In Again!" })

                    } else {
                        res.status(200).json({ name: data.name, email: data.email, category: data.category })
                        //   res.render("passengerMapPick", {data: data,});

                    }
                }
            }
            if (data == null) {
                let error = "ERROR : Invalid Email or Password!";
                // res.render("passengerLogin", { error: error });
                res.status(401).json({ error: { msg: "ERROR : Invalid Email or Password!" } })
            }
        }
    });
});

module.exports = router