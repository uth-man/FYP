const socket = io.connect()

let email = document.getElementById("pass_email").value;

socket.emit('im_passenger', email)