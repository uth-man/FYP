const socket = io.connect();

let map;
let driverMarker = [];
// let socketId = document.getElementById('data_socketId').dataset.params;
let tableName = document.getElementById('table_name').dataset.params;

let name = document.getElementById('data_name').dataset.params;
let phone = document.getElementById('data_phone').dataset.params;
let email = document.getElementById('data_email').dataset.params;
let bookingId = document.getElementById('booking_id').dataset.params;

let details = {
    passengerEmail: email,
    bookingId: bookingId
}
//socket.emit('im_passenger', details);

let data = {
    name, email, phone,
    coords: {
        lat: parseFloat(document.getElementById('pickLat').value),
        lng: parseFloat(document.getElementById('pickLng').value)
    },
    rideId: parseInt(document.getElementById('rideId').value),
    rideFare: parseInt(document.getElementById('fare'))
}

console.log(data);

socket.emit("_request_pool", data)

socket.on('_passenger_pool_loc', params => {
    let coords = params.coords;
    let content = { name: params.name, phone: params.phone };

    setPassengerMarker(coords, content);
})

socket.on('_driver_pool_loc', params => {
    let content = { name: params.name, phone: params.phone }
    setDriverMarker(params.coords, content)
    displayDriverMarker();
})

socket.on('cancel_pool', zilch => {
    removeDriverMarker();
})

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
                "elementType": "labels.text.fill",
                "stylers": [
                    {
                        "color": "#d59563"
                    }
                ]
            },
            {
                "featureType": "poi.business",
                "stylers": [
                    {
                        "visibility": "off"
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
                "elementType": "labels.text",
                "stylers": [
                    {
                        "visibility": "off"
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
    map.setCenter(data.coords)

    let marker = new google.maps.Marker();
    marker.setPosition(data.coords);
    marker.setMap(map);

    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent("Me");
    infoWindow.open(map, marker)

}

function setPassengerMarker(coords, content) {
    let marker = new google.maps.Marker();
    marker.setPosition(coords);
    marker.setMap(map);
    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(`<b>${content.name}</b><br/>${content.phone}`);
    infoWindow.open(map, marker)
}

function setDriverMarker(coords, content) {

    let marker = new google.maps.Marker();
    marker.setPosition(coords);
    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(`<b>Driver</b><br/>${content.name}<br/>${content.phone}`);
    infoWindow.open(map, marker)
    driverMarker.push(marker);

}
function displayDriverMarker() {
    if (!driverMarker.length == 0) {
        driverMarker.forEach(marker => {
            marker.setMap(map)
        })
    }
}
function removeDriverMarker() {
    if (!driverMarker.length == 0) {
        driverMarker.forEach(marker => {
            marker.setMap(null)
        })
    }
}

displayDriverMarker()