const mysql = require("mysql");

let db_config = {
  host: "us-cdbr-east-02.cleardb.com",
  user: "bf4808090a525d",
  password: "5d20a066",
  database: "heroku_4a12729e85039f6"

  // For Development
  // host: "localhost",
  // user: "root",
  // password: "",
  // database: "findmybuddyrider"
}

let db;

function createConnection() {
  db = mysql.createConnection(db_config);

  db.connect(err => {
    if (err) {
      console.log("*******Error while connecting to Database******** ");
      console.log(err);
      createConnection();
    } else {
      console.log("MySQL Connected");
    }
  });
}
createConnection();


// Creating Tables
creatingAllTables();

function creatingAllTables() {
  // Admin Table

  let sqlAdmin =
    "CREATE TABLE IF NOT EXISTS admin (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,name varchar(255),email varchar(255),password varchar(255) )"
  db.query(sqlAdmin, (error, result) => {
    if (error) {
      console.log(error);

    } else {
      console.log("Table Admin created");
      let sqlInsertAdmin =
        "INSERT INTO admin (name,email,password) VALUES('Usman','usmansardar247@gmail.com','Usman123')"
      db.query(sqlInsertAdmin, (error, result) => {
        if (error) {
          console.log(error);

        }
      })
    }
  })

  // Scheduled Rides
  let sqlSchedileRides =
    "CREATE TABLE IF NOT EXISTS ScheduledRides (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY,role varchar(255), name varchar(255),phone varchar(255),email varchar(255),numberOfPassengers varchar(255) ,origion VARCHAR(100),destination VARCHAR(100), pickDate DATE ,pickTime TIME, timeStamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)";
  db.query(sqlSchedileRides, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Table ScheduledRides created");
    }
  })

  // Booking Details
  let sqlBookingDetails =
    "CREATE TABLE IF NOT EXISTS BookingDetails (id INT(6) UNSIGNED AUTO_INCREMENT PRIMARY KEY, passengerName varchar(255),passengerSocketId varchar(255),passengerEmail varchar(255),passengerPhone varchar(255) ,driverName varchar(255),driverEmail varchar(255) ,origion VARCHAR(100),destination VARCHAR(100),passengers INT UNSIGNED, isPool TINYINT(1) NOT NULL DEFAULT 0,status varchar(255) DEFAULT 'matching', timeStamp TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP)";
  db.query(sqlBookingDetails, (err, result) => {
    if (err) {
      console.log(err);
    } else {
      console.log("Table BookingDetails created");

    }
  })

  // Passenger Table
  let sqlPassenger =
    "CREATE TABLE IF NOT EXISTS passenger (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name varchar(255), email varchar(255) NOT NULL UNIQUE,phone varchar(255),password varchar(255),socketId varchar(255), creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, isPool TINYINT(1) NOT NULL DEFAULT 0)"
  db.query(sqlPassenger, (error, result) => {
    if (error) {
      console.log(error);

    } else {
      console.log("Table Passenger Created..");
    }
  })

  // Driver table
  let sqlDriver =
    "CREATE TABLE IF NOT EXISTS driver (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name varchar(255),gender varchar(255),email varchar(255),phone varchar(255),password varchar(255),cnic varchar(255),drivingLicense varchar(255),vehicleEngine varchar(255),vehicleModel varchar(255),licensePlate varchar(255),vehicleClass varchar(255),vehicleType varchar(255)," +
    "creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,isVerified TINYINT(1) NOT NULL DEFAULT 0,picture varchar(255), userCat varchar(255), isOnline TINYINT(1), currentLocation varchar(255),socketId varchar(255))"
  db.query(sqlDriver, (error, result) => {

    if (error) {
      console.log(error);

    } else {
      console.log("Table Driver Created..");
    }
  })
}




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
    "CREATE TABLE IF NOT EXISTS passenger (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name varchar(255), email varchar(255) NOT NULL UNIQUE,phone varchar(255),password varchar(255),socketId varchar(255), creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP, isPool TINYINT(1) NOT NULL DEFAULT 0)"
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
    "CREATE TABLE IF NOT EXISTS driver (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, name varchar(255),gender varchar(255),email varchar(255),phone varchar(255),password varchar(255),cnic varchar(255),drivingLicense varchar(255),vehicleEngine varchar(255),vehicleModel varchar(255),licensePlate varchar(255),vehicleClass varchar(255),vehicleType varchar(255)," +
    "creationDate TIMESTAMP DEFAULT CURRENT_TIMESTAMP,isVerified TINYINT(1) NOT NULL DEFAULT 0,picture varchar(255), userCat varchar(255), isOnline TINYINT(1), currentLocation varchar(255),socketId varchar(255))"
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
