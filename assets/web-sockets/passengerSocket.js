console.log(window.location.hostname);
let socket = io.connect("https://findmybuddyrider.herokuapp.com")

let email = document.getElementById("pass_email").value;

socket.emit('im_passenger', email)