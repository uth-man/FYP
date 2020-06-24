const db = require('./model/index')
const io = require('socket.io')(8080);
const { request } = require('express');
io.on('connection', (socket) => {

    socket.on('im_driver', (params) => {

        console.log(params + ' - ' + socket.id);

    })
    socket.on('update_location', (params) => {
        let { driverEmail, coords } = params;
        // console.log(params.driverEmail);
        // console.log(params.coords);
        console.log(coords);

        let sql = `UPDATE driver SET currentLocation='${coords.lat},${coords.lng}' WHERE email='${driverEmail}' `;

        db.query(sql, (result, error) => {
            if (error) {
                //console.log(error);
            }
        })


    })
})
