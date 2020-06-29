const socket = io('http://localhost:8080')
let map;
let markers = [];
let initialCurrentLocation;

let email = document.getElementById("_email").value;
socket.emit('im_driver', email)

socket.on("passenger_requests", (params) => {
    console.log("User requested a ride");
    console.log(params);


})

function initMap() {


    let email = document.getElementById("_email").value;
    socket.emit('im_driver', email)

    socket.on("passenger_requests", (params) => {
        console.log("User requested a ride");
        let passengercoords = {
            lat: parseFloat(params.coords.lat),
            lng: parseFloat(params.coords.lng)
        }


        setPassengerMarker(passengercoords);
    })

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
                "elementType": "labels.icon",
                "stylers": [
                    {
                        "visibility": "off"
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
    function setPassengerMarker(coords) {
        let marker = new google.maps.Marker();
        marker.setPosition(coords);
        marker.setMap(map)

        // socket.emit('live_location_for_passenger', "live Location For Passenger")
    }

}