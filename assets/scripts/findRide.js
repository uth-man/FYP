const socket = io.connect();
let map;
let driverMark = []
let passLat = parseFloat(document.getElementById('_lat').value);
let passLng = parseFloat(document.getElementById('_lng').value);

function initMap() {
    console.log("Findride initiated...");

    let driverSocket = document.getElementById('driver_socket_id').value;
    let passengerSocket = document.getElementById('passenger_socket_id').value;
    // console.log("Driver Socket : " + driverSocket);
    // console.log("passenger Socket : " + passengerSocket);

    let data = {
        passenger: {
            coords: {
                lat: parseFloat(document.getElementById('_lat').value),
                lng: parseFloat(document.getElementById('_lng').value)
            },
            socketId: passengerSocket
        },
        driver: { email: document.getElementById('driver_email').value, socketId: driverSocket }
    }

    let options = {
        zoom: 16,
        draggableCursor: "default",
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

    socket.emit('book_request', data);

    socket.emit("_live_", data)

    socket.on('_live_tracking', driverCoords => {
        // console.log("Driver coordinated");
        // console.log(driverCoords);

        addDriverMarker(driverCoords)

    })



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
        marker.setIcon({
            url: "https://img.icons8.com/plasticine/100/000000/standing-man.png",
            scaledSize: new google.maps.Size(50, 50)
        })
        let infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent(`<h2">${params.name}</h2>`)
        infoWindow.open(map, marker)
        let passengerLocation = {
            lat: passLat,
            lng: passLng
        }
        let name = document.getElementById('user_name').innerText
        let parameters = {
            name: name,
            coords: passengerLocation
        }
        socket.emit("_passenger_locations", parameters)



    })


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
        marker.setIcon({
            url: "https://img.icons8.com/plasticine/100/000000/standing-man.png",
            scaledSize: new google.maps.Size(50, 50)
        })

        let infoWindow = new google.maps.InfoWindow();
        infoWindow.setContent("Passenger")
        infoWindow.open(map, marker)
    }
}

