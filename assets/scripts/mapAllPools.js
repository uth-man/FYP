const socket = io.connect();

let closestRide = [];

let map;
let numberOfPools = 0;
let dropLat = parseFloat(document.getElementById('dropLat').value)
let dropLng = parseFloat(document.getElementById('dropLng').value)

let pickLat = parseFloat(document.getElementById('pickLat').value)
let pickLng = parseFloat(document.getElementById('pickLng').value)




let name = document.getElementById('data_name').dataset.params;
let email = document.getElementById('data_email').dataset.params;
let phone = document.getElementById('data_phone').dataset.params;
let socketId = document.getElementById('data_socketId').dataset.params;
console.log(name);
console.log(email);
console.log(phone);


function initMap() {
    let location = {
        lat: dropLat,
        lng: dropLng
    }

    let options = {
        center: location,
        zoom: 14,
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

    socket.emit('search_for_pool_rides', socketId);

    socket.on('rides_ready_for_pool', (result) => {

        result.forEach(res => {

            let pickup = res.origion.split(" ");
            let dropoff = res.destination.split(" ");
            let pickUpCoords = {
                lat: parseFloat(pickup[0]),
                lng: parseFloat(pickup[1])
            }
            let dropOffCoords = {
                lat: parseFloat(dropoff[0]),
                lng: parseFloat(dropoff[1]),
            }

            let distanceMatrixService = new google.maps.DistanceMatrixService();
            distanceMatrixService.getDistanceMatrix({
                origins: [pickLat + ',' + pickLng],
                destinations: [pickUpCoords.lat + ',' + pickUpCoords.lng],
                travelMode: 'DRIVING',
                unitSystem: google.maps.UnitSystem.metric,

            }, (response, status) => {
                if (status === "OK") {
                    console.log("pick up dist");
                    console.log(response.rows[0].elements[0].distance.value);
                    let pickUpDis = response.rows[0].elements[0].distance.value;
                    if (response.rows[0].elements[0].distance.value <= 1000) {
                        distanceMatrixService.getDistanceMatrix({
                            origins: [dropLat + ',' + dropLng],
                            destinations: [dropOffCoords.lat + ',' + dropOffCoords.lng],
                            travelMode: 'DRIVING',
                            unitSystem: google.maps.UnitSystem.metric,

                        }, (response, status) => {
                            if (status === "OK") {
                                console.log("drop off dist");
                                console.log(response.rows[0].elements[0].distance.value);
                                if (response.rows[0].elements[0].distance.value <= 1000) {
                                    let contentPick = `<b>Pick-up</b></br><b>${res.passengerName}</b></br><span>${res.passengerPhone}</span>`
                                    let contentDrop = `<b>Drop-off</b></br><b>${res.passengerName}</b>`
                                    drawMarker(pickUpCoords, contentPick)
                                    drawMarker(dropOffCoords, contentDrop)
                                    let details = { ...res, pickUpDistance: pickUpDis }
                                    closestRide.push(details);
                                }
                            }
                        })
                    }
                }
            })
        });
        setTimeout(checkRides, 5000);
        setTimeout(findNearestRide, 6000);
    });
}


function drawMarker(coords, content) {
    numberOfPools++;
    let marker = new google.maps.Marker();
    marker.setPosition(coords);
    marker.setMap(map);

    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
}
function checkRides() {
    if (numberOfPools == 0) {
        document.getElementById('no_pooling_rides').style.display = "block";
    } else {
        let estCost = parseInt(document.getElementById('fare').value);
        let finalCost = estCost + estCost / 2;
        finalCost = Math.ceil(finalCost / 2);
        let div = document.getElementById('estimatedValues');
        div.innerHTML = "<b>Estimated Fare : </b><span>Rs." + finalCost + "</span>";
    }
}

function findNearestRide() {
    if (closestRide.length == 1) {
        document.getElementById('nearest_ride').value = closestRide[0].id;
        console.log(closestRide[0]);
    }
    if (closestRide.length > 1) {
        const closest = closestRide.reduce(
            (acc, loc) =>
                acc.pickUpDistance < loc.pickUpDistance
                    ? acc
                    : loc
        )
        document.getElementById('nearest_ride').value = closest.id;
        console.log(closest);
    }
}