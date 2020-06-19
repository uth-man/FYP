const io = require('socket.io')(8080);

io.on('connection', (socket) => {

    socket.on('im_driver', (params) => {
        console.log(params + ' - ' + socket.id);

    })
    socket.on('im_passenger', (params) => {
        console.log(params + ' - ' + socket.id);
    })
})