const socket = io('http://localhost:8080');

socket.emit('im_driver', "im driver")
