const socket = io.connect();
let map;
let driverMark = []
let passLat = parseFloat(document.getElementById('_lat').value);
let passLng = parseFloat(document.getElementById('_lng').value);


console.log("Findride initiated...");

let driverSocket = document.getElementById('driver_socket_id').value;
let passengerSocket = document.getElementById('passenger_socket_id').value;

let passengerName = document.getElementById("_p_name").value;
let passengerPhone = document.getElementById('_p_phone').value;

let data = {
    passenger: {
        info: {
            name: passengerName,
            phone: passengerPhone,
            email: document.getElementById('passenger_email').value
        },
        coords: {
            lat: parseFloat(document.getElementById('_lat').value),
            lng: parseFloat(document.getElementById('_lng').value)
        },
        socketId: passengerSocket
    },
    driver: { email: document.getElementById('driver_email').value, socketId: driverSocket }
}

socket.emit('book_request', data);

socket.on('_live_tracking', driverCoords => {

    addDriverMarker(driverCoords)

})


socket.on('_pooling_results', params => {
    console.log(params);

    // add carpool markers
    let marker = new google.maps.Marker({
        position: {
            lat: parseFloat(params.coords.lat),
            lng: parseFloat(params.coords.lng)
        }
    });
    marker.setMap(map)
    // marker.setIcon({
    //     url: "https://img.icons8.com/plasticine/100/000000/standing-man.png",
    //     scaledSize: new google.maps.Size(50, 50)
    // })

    let passengerLocation = {
        lat: passLat,
        lng: passLng
    }
    let name = document.getElementById('user_name').innerText
    let parameters = {
        name: name,
        phone: passengerPhone,
        coords: passengerLocation
    }
    // accept pool request

    let poolBox = document.getElementById('pool_request_box');
    let msgElem = document.getElementById('req_message');
    let acceptBtn = document.getElementById('accept_pool');

    poolBox.style.display = "block";
    msgElem.innerHTML = `${params.name} sent pool request`
    acceptBtn.addEventListener('click', (e) => {
        socket.emit("_passenger_locations", parameters);
        poolBox.style.display = "none";

        let marker1 = new google.maps.Marker({
            position: {
                lat: parseFloat(params.coords.lat),
                lng: parseFloat(params.coords.lng)
            }
        });
        marker1.setMap(map)
        let infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(`<b>${params.name}</b><br/>${params.phone}`)
        infoWindow.open(map, marker1)

    })

    let rejectBtn = document.getElementById('reject_pool');
    rejectBtn = addEventListener('click', (e) => {
        poolBox.style.display = "none";
        marker.setMap(null)
    })

})


// ===================== Canceling Ride

// let cancelForm = document.getElementById('search_form')
// cancelForm.onsubmit(() => {

// })



function initMap() {

    let options = {
        zoom: 16,
        draggableCursor: "default",
        disableDefaultUI: true,
        styles: [
            {
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#242f3e"
                    }
                ]
            },
            {
                "featureType": "administrative.land_parcel",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "administrative.locality",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "poi",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#263c3f"
                    }
                ]
            },
            {
                "featureType": "poi.park",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#6b9a76"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#38414e"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#212a37"
                    }
                ]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#9ca5b3"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#746855"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "geometry.stroke",
                "stylers": [
                    {
                        "color": "#1f2835"
                    }
                ]
            },
            {
                "featureType": "road.highway",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#f3d19c"
                    }
                ]
            },
            {
                "featureType": "road.local",
                "elementType": "labels",
                "stylers": [
                    {
                        "visibility": "off"
                    }
                ]
            },
            {
                "featureType": "transit",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#2f3948"
                    }
                ]
            },
            {
                "featureType": "transit.station",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#515c6d"
                    }
                ]
            },
            {
                "featureType": "water",
                "elementType": "labels.text.stroke",
                "stylers": [
                    {
                        "color": "#17263c"
                    }
                ]
            }
        ]

    }
    map = new google.maps.Map(document.getElementById('map'), options);
    map.setCenter(data.passenger.coords)

    addPassengerMarker(data.passenger.coords)


    // ----------------------------------------- Open Pool --------------------------------


    let openPool = document.getElementById('open_pool');
    openPool.addEventListener("click", (e) => {
        openPool.style.display = "none";
        let email = document.getElementById('passenger_email').value

        socket.emit("_open_pool", email)
        let time = 180;
        let countDown = document.getElementById('count-down');
        let startInterval = setInterval(updateTime, 1000)

        function updateTime() {
            countDown.style.display = 'block'
            countDown.innerHTML = time;
            time--;
            if (time < -1) {
                clearInterval(startInterval)
                countDown.style.display = 'none'
            }
        }

    })


}
// ------------------------------------------ Markers ---------------------------------


function addDriverMarker(coords) {
    if (!driverMark.length == 0) {
        driverMark.forEach(m => {
            m.setMap(null)
        })
    }
    let marker = new google.maps.Marker();
    marker.setPosition(coords);
    marker.setMap(map);
    // marker.setIcon({
    //     url: "https://img.icons8.com/color/48/000000/car-top-view.png"
    // })

    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent("Driver")
    infoWindow.open(map, marker)

    driverMark.push(marker)
}

function addPassengerMarker(coords) {
    // console.log("passenger location : ");
    // console.log(coords);

    let marker = new google.maps.Marker();
    marker.setPosition(coords);
    marker.setMap(map);
    // marker.setIcon({
    //     url: "https://img.icons8.com/plasticine/100/000000/standing-man.png",
    //     scaledSize: new google.maps.Size(50, 50)
    // })

    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent("Passenger")
    infoWindow.open(map, marker)
}


