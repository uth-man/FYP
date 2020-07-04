console.log(window.location.hostname);


const socket = io('http://localhost:8080')

let email = document.getElementById("pass_email").value;

socket.emit('im_passenger', email)