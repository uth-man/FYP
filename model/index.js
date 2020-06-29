const mysql = require("mysql");

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "findMyBuddyRider"
});

db.connect(err => {
  if (err) {
    throw err;
  } else {
    console.log("MySQL Connected");
  }
});

function createScheduleRides(req, res, next) {
  console.log("Creating ScheduleRides");

  let sql =
    "CREATE TABLE IF NOT EXISTS ScheduledRides (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,role varchar(255), name varchar(255),phone varchar(255),email varchar(255),numberOfPassengers varchar(255) ,origion VARCHAR(100),destination VARCHAR(100), pickDate DATE ,pickTime TIME, timeStamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Table created in db");
      next();
    }
  })
}

function createTableBookingDetails(req, res, next) {

  let sql =
    "CREATE TABLE IF NOT EXISTS BookingDetails (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, passengerName varchar(255),passengerSocketId varchar(255),passengerEmail varchar(255),passengerPhone varchar(255) ,driverName varchar(255),driverEmail varchar(255) ,origion VARCHAR(100),destination VARCHAR(100),passengers INT UNSIGNED, isPool TINYINT(1) NOT NULL DEFAULT 0,status varchar(255) DEFAULT 'matching', timeStamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)";
  db.query(sql, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      next();
    }
  })
}

module.exports = {
  db: db,
  createScheduleRides: createScheduleRides,
  createTableBookingDetails: createTableBookingDetails
};
