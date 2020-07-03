const db = require("../model/index").db;
const bcryptjs = require("bcryptjs");
const express = require("express");
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ fyp: findMyBuddyRider })
})

module.exports = router