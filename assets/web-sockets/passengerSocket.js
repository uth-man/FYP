const socket = io.connect('https://findmybuddyrider.herokuapp.com')

console.log(window.location.hostname);


let email = document.getElementById("pass_email").value;

socket.emit('im_passenger', email)