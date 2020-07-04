const db = require('./model/index').db
let http = require('http');
let express = require('express');
let app = express();
let server = http.createServer(app);
let io = require('socket.io').listen(server);
server.listen(80);

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
    socket.on("im_passenger", (email) => {
        console.log(email + " : " + socket.id);
        let sql =
            `UPDATE passenger SET socketId='${socket.id}' WHERE email='${email}'`
        db.query(sql, (error, result) => {
            if (error) {
                console.log(error);

            }
        })

    })
    socket.on("book_request", (params) => {

        socket.broadcast.to(params.driver.socketId).emit('passenger_requests', params.passenger)

    })
    socket.on('_live_', (params) => {

        setInterval(() => {

            let sql = `SELECT currentLocation FROM driver WHERE email='${params.driver.email}'`
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

                    socket.broadcast.emit("_live_tracking", driverLatLng)

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
                    if (result[0].isPool == true) {
                        socket.broadcast.emit("_pooling_results", params)
                    }

                }
            })

    })
    socket.on('_passenger_locations', params => {
        socket.broadcast.emit('_passenger_pool_loc', params)
    })
})
