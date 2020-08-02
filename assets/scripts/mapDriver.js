const socket = io.connect();
let map;
let markers = [];
let initialCurrentLocation;
let passengerMark = [];
let poolMarkers = [];

let email = document.getElementById("_email").value;
socket.emit('im_driver', email)



function flashMessage(info) {
    let msgContainer = document.getElementById('pool_request_box');
    let msg = document.getElementById('req_message');

    msgContainer.style.display = "block"
    msg.innerHTML = `<b>${info.name}</b> Just Booked Ride With You..`;

    setTimeout(() => {
        msgContainer.style.display = "none";
    }, 5000);
}



socket.on("passenger_requests", (params) => {
    flashMessage(params.info)

    console.log("User requested a ride");
    console.log(params);

    let info = {
        name: params.info.name,
        phone: params.info.phone
    }
    let passengercoords = {
        lat: parseFloat(params.coords.lat),
        lng: parseFloat(params.coords.lng)
    }

    setPassengerMarker(passengercoords, info);

    let parameters = {
        passengerSocket: params.socketId,
        driverEmail: email
    }
    console.log("Passenger Socket Id : " + params.socketId);

    socket.emit('driver_response', parameters)

})

socket.on('_pooling_results_for_driver', params => {
    let coords = {
        lat: parseFloat(params.coords.lat),
        lng: parseFloat(params.coords.lng)
    }

    setPoolMarker(coords, params)
    displayPoolMarkers();

    socket.emit('_driver_locations', document.getElementById('_email').value)
})
socket.on('cancel_pool', zilch => {
    removePoolMarkers();
})
function initMap() {

    navigator.geolocation.getCurrentPosition(p => {
        initialCurrentLocation = { lat: p.coords.latitude, lng: p.coords.longitude }
        map.setCenter(initialCurrentLocation)
    })

    setInterval(() => {
        if (navigator.geolocation) {

            navigator.geolocation.getCurrentPosition((p) => {

                // Add Marker
                let coords = { lat: p.coords.latitude, lng: p.coords.longitude }

                //Get driver email
                let driverEmail = document.getElementById('_email').value

                // sending live location to server
                socket.emit('update_location', { coords, driverEmail })

                let iconImage = {
                    url: "https://img.icons8.com/color/48/000000/car-top-view.png"
                }
                addMarker(coords, iconImage)

            }, (err) => {
                console.log(err);
            });
        }
    }, 3 * 1000)

    // New Map
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        draggableCursor: 'default',
        disableDefaultUI: true,
    });

    function addMarker(coords, icon) {
        // Removing previous markers from Map
        if (!markers.length == 0) {
            markers.forEach(m => {
                m.setMap(null);
            })
        }

        let marker = new google.maps.Marker();
        marker.setPosition(coords)
        marker.setMap(map)
        //map.setCenter(coords)
        //marker.setIcon(icon)

        markers.push(marker)
    }
}


function setPoolMarker(coords, info) {

    let marker = new google.maps.Marker();
    marker.setPosition(coords);
    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(`<b>${info.name}</b><br/> ${info.phone}`)
    infoWindow.open(map, marker)
    poolMarkers.push(marker)

    // socket.emit('live_location_for_passenger', "live Location For Passenger")
}
function displayPoolMarkers() {
    if (!poolMarkers.length == 0) {
        poolMarkers.forEach(marker => {
            marker.setMap(map)
        });
    }
}

function removePoolMarkers() {
    if (!poolMarkers.length == 0) {
        poolMarkers.forEach(marker => {
            marker.setMap(null)
        })
    }
}


function setPassengerMarker(coords, info) {
    if (!passengerMark.length == 0) {
        passengerMark.forEach(m => {
            m.setMap(null);
        })
    }
    let marker = new google.maps.Marker();
    marker.setPosition(coords);
    marker.setMap(map)
    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(`<b>${info.name}</b><br/> ${info.phone}`)
    infoWindow.open(map, marker)
    passengerMark.push(marker)
}
displayPoolMarkers();