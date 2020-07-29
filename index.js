const dotenv = require("dotenv");
dotenv.config();

let db = require('./model/index').db

const express = require('express');
const socketio = require('socket.io');
const http = require('http');

const port = process.env.PORT || 6000;

const router = require("./router/router");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

io.on('connection', (socket) => {

  socket.on('im_driver', (email) => {
    console.log(email + ' : ' + socket.id);
    let sql =
      `UPDATE driver SET socketId='${socket.id}' WHERE email='${email}'`
    db.query(sql, (error, result) => {
      if (error) {
        console.log(error);
      }
    })
  })

  socket.on('update_location', (params) => {
    let { driverEmail, coords } = params;
    // console.log(coords);
    let sql =
      `UPDATE driver SET currentLocation='${coords.lat},${coords.lng}' WHERE email='${driverEmail}' `;

    db.query(sql, (error, result) => {
      if (error) {
        console.log(error);
      }
    })


  })
  socket.on("im_passenger", (args) => {
    console.log(args.passengerEmail + " : " + socket.id);
    let sql =
      `UPDATE passenger SET socketId='${socket.id}' WHERE email='${args.passengerEmail}'`
    db.query(sql, (error, result) => {
      if (error) {
        console.log(error);
      }
      else {
        let tableName = args.tableName;
        let buddyRidesUpdate = `UPDATE ${tableName} SET passengerSocket='${socket.id}' 
        WHERE id='${args.bookingId}'`;
        db.query(buddyRidesUpdate, (error, result) => {
          if (error) {
            console.log(error);
          }
        })
      }
    })

  })
  socket.on("book_request", (params) => {
    console.log("Socket Id : " + socket.id);
    let getPassengerSocket = `SELECT socketId FROM passenger WHERE email='${params.passenger.info.email}'`
    db.query(getPassengerSocket, (error, result) => {
      if (error) {
        return console.log(error);
      } else {
        let passenger = {
          ...params.passenger,
          socketId: result[0].socketId
        }
        console.log("Passenger Socket Id : " + passenger.socketId);

        socket.broadcast.to(params.driver.socketId).emit('passenger_requests', passenger)
      }
    })
  })

  socket.on('driver_response', (params) => {

    let updateIsOnline = `UPDATE driver SET isOnline=0 WHERE email='${params.driverEmail}'`;
    db.query(updateIsOnline, (err, result) => {
      if (err) {
        console.log(err)
      }
    })

    setInterval(() => {

      let sql = `SELECT currentLocation FROM driver WHERE email='${params.driverEmail}'`
      db.query(sql, (error, result) => {
        if (error) {
          console.log(error);
        } else {


          let unformattedCoords = result[0].currentLocation;
          let liveLocation = unformattedCoords.split(',')

          let driverLatLng = {
            lat: parseFloat(liveLocation[0]),
            lng: parseFloat(liveLocation[1])
          }

          socket.broadcast.to(params.passengerSocket).emit("_live_tracking", driverLatLng)

        }
      })
    }, 3 * 1000)
  })

  socket.on('_open_pool', email => {
    let sql = `UPDATE bookingdetails SET ispool = 1 WHERE passengerEmail='${email}'`

    db.query(sql, (error, result) => {
      if (error) {
        console.log(error);
      } else {

      }
    })


  })
  socket.on("_request_pool", params => {
    console.log('==========REQUESTING POOL===========');

    console.log(params);
    db.query(`SELECT * from bookingdetails WHERE isPool=true AND status='matching'`,
      (error, result) => {
        if (error) {
          console.log(error);
        } else {
          console.log("________________CARPOOL___________");
          if (result.length > 0) {
            socket.broadcast.emit("_pooling_results", params);

            socket.broadcast.emit('_pooling_results_for_driver', params)
          }

        }
      })

  })
  socket.on('_passenger_locations', params => {
    socket.broadcast.emit('_passenger_pool_loc', params)
  })

  socket.on('search_for_pool_rides', (socketId) => {
    console.log("=============Searching Pool Rodes==============");

    let sql = "SELECT * FROM buddyridesdetails WHERE status='matching'"
    db.query(sql, (err, result) => {
      if (err) {
        console.log(err);
      } else {

        socket.emit('rides_ready_for_pool', result);
      }
    })
  })

})




app.use(router)

server.listen(port, () => {
  console.log(`Listening on port ${port}..`);
});