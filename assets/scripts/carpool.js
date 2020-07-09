let carpool = document.getElementById('_carpool');

carpool.addEventListener('click', (e) => {

    let passEmail = document.getElementById("pass_email").value;
    let passName = document.getElementById('pass_name').innerText;
    let passPhone = document.getElementById('pass_phone').value
    let data = {
        name: passName,
        email: passEmail,
        phone: passPhone,
        coords: {
            lat: document.getElementById('lat').value,
            lng: document.getElementById('lng').value
        }
    }
    console.log(data);

    socket.emit("_request_pool", data)

    // socket.on('_pooling_results', params => {
    //     console.log(params);
    // })

})
