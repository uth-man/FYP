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

function createPassengerTable(req, res, next) {
  let sql =
    "CREATE TABLE IF NOT EXISTS passenger (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name varchar(255), email varchar(255) NOT NULL UNIQUE,phone varchar(255),password varchar(255),socketId varchar(255), creationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, modificationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP, isPool TINYINT(1) NOT NULL DEFAULT 0)"
  db.query(sql, (error, result) => {
    if (error) {
      console.log(error);

    } else {
      console.log("Passenger Table Created..");
      next()

    }
  })
}
function createDriverTable(req, res, next) {
  let sql =
    "CREATE TABLE IF NOT EXISTS driver (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name varchar(255),gender varchar(255),email varchar(255),phone varchar(255),password varchar(255),cnic varchar(255),drivingLicense varchar(255),vehicleEngine varchar(255),vehicleModel varchar(255),licensePlate varchar(255),vehicleClass varchar(255),vehicleType varchar(255),creationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP, modificationDate TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,isVerified TINYINT(1) NOT NULL DEFAULT 0,picture varchar(255), userCat varchar(255), isOnline TINYINT(1), currentLocation varchar(255),socketId varchar(255))"
  db.query(sql, (error, result) => {

    if (error) {
      console.log(error);

    } else {

      console.log("Driver Table Created..");
      next();

    }
  })
}

module.exports = {

  db: db,
  createPassengerTable: createPassengerTable,
  createDriverTable: createDriverTable,
  createScheduleRides: createScheduleRides,
  createTableBookingDetails: createTableBookingDetails

};
