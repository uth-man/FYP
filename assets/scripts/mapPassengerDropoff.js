let map;
let pickupMarker;
let allDropoffMarkers = [];
let allRoutes = []
// lat lng of pickup location
let pickLat = document.getElementById('pickLat').value
let pickLng = document.getElementById('pickLng').value

// lat lng of dropoff location
let dropLat = document.getElementById('dropLat');
let dropLng = document.getElementById('dropLng');
function initMap() {

    // adding pick up point
    addPickup();

    let searchInput = document.getElementById('search');

    // adding search suggestions
    new google.maps.places.SearchBox(searchInput);


    //------------------- ADDING MARKER ON SEARCH OF LOCATION ------------------------

    searchInput.addEventListener('change', () => {
        setTimeout(() => {

            // get request to geocoding api
            axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: searchInput.value,
                    key: 'AIzaSyBuWZhosWcom_vVhXGyFwUidpmhPf9z7FA'
                }
            }).then((response) => {
                searchInput.value = response.data.results[0].formatted_address;
                addDropoff(response.data.results[0].geometry.location);


            }).catch((error) => {
                console.log(error);

            })

        }, 1000)

    })
    //------------------- ADDING ON CLICK LOCATION ------------------------
    map.addListener('click', (e) => {
        let location = e.latLng.lat().toString() + "," + e.latLng.lng().toString();


        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                latlng: location,
                key: 'AIzaSyBuWZhosWcom_vVhXGyFwUidpmhPf9z7FA'
            }
        }).then((response) => {
            searchInput.value = response.data.results[0].formatted_address;
            let coords = { lat: e.latLng.lat(), lng: e.latLng.lng() }
            addDropoff(coords);


        }).catch((error) => {
            console.log(error);

        })

    })
}



//Adding Drop off point
function addDropoff(coords) {

    if (!allDropoffMarkers.length == 0) {
        allDropoffMarkers.forEach(m => {
            m.setMap(null)
        })
    }
    let marker = new google.maps.Marker();
    marker.setPosition(coords);
    marker.setMap(map)

    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent("dropoff point");
    infoWindow.open(map, marker)

    dropLat.value = coords.lat;
    dropLng.value = coords.lng;

    // Drawing Routes

    drawRoutes();
    calculateDistance();

    // Add marker to an array
    allDropoffMarkers.push(marker)
}

function drawRoutes() {
    if (!allRoutes.length == 0) {
        allRoutes.forEach(r => {
            r.setMap(null)
        })
    }
    let directionsService = new google.maps.DirectionsService();
    let directionsDisplay = new google.maps.DirectionsRenderer();

    directionsDisplay.setMap(map);

    directionsService.route({
        origin: pickLat + ',' + pickLng,
        destination: dropLat.value + ',' + dropLng.value,
        travelMode: 'DRIVING'
    }, (response, status) => {

        if (status === "OK") {
            directionsDisplay.setDirections(response);

            // Replacing previous markers with new A and B marks
            pickupMarker.setMap(null)
            if (!allDropoffMarkers.length == 0) {
                allDropoffMarkers.forEach(drop => {
                    drop.setMap(null)
                })
            }

        } else {
            console.log("Direction request failed due to \n" + status)
        }
    })
    allRoutes.push(directionsDisplay)
}

function calculateDistance() {
    let distanceMatrixService = new google.maps.DistanceMatrixService();
    distanceMatrixService.getDistanceMatrix({
        origins: [pickLat + ',' + pickLng],
        destinations: [dropLat.value + ',' + dropLng.value],
        travelMode: 'DRIVING',
        unitSystem: google.maps.UnitSystem.metric,
        avoidHighways: false,
        avoidTolls: false
    }, (response, status) => {
        if (status === "OK") {

            let estDistance = response.rows[0].elements[0].distance.text;
            let estDuration = response.rows[0].elements[0].duration.text;

            let estFare = estimateFare(estDistance, estDuration);

            appendEstimatedValues(estDistance, estDuration, estFare);

        }
    })
}

function estimateFare(estDistance, estDuration) {

    let xDis = parseFloat(estDistance);
    let xDur = parseFloat(estDuration)

    // let estFare = xDis * xDur + (4 * xDis) + xDur;
    let estFare = 80 * (xDis / 3) + xDur;
    let estFareRound = Math.ceil(estFare);
    if (estFareRound < 100)
        return (100);
    else
        return (estFareRound)
}

function appendEstimatedValues(estDistance, estDuration, estFare) {

    // remove previous innerHTML
    let div = document.getElementById('estimatedValues');
    div.innerHTML = "";

    // estimated distance
    let pDistance = document.createElement('p');
    pDistance.innerHTML = '<b>Estimated Distance : </b><strong>' + estDistance + "</strong>";

    // estimated duration
    let pDuration = document.createElement('p');
    pDuration.innerHTML = '<b>Estimated Duration : </b><strong>' + estDuration + "</strong>";

    // estimated fare
    let pFare = document.createElement('p');
    pFare.innerHTML = "<b>Estimated Fare : </b><span>Rs." + estFare + "</span>"

    // Append all estimates
    div.appendChild(pDistance);
    div.appendChild(pDuration)
    div.appendChild(pFare)
}

// Adding Pick up point
function addPickup() {

    let location = {

        lat: parseFloat(pickLat),
        lng: parseFloat(pickLng)
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
    }
    map = new google.maps.Map(document.getElementById('map'), options);
    setPickupMark(location);
}


function setPickupMark(coords) {
    pickupMarker = new google.maps.Marker();
    pickupMarker.setPosition(coords);
    pickupMarker.setMap(map);
    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent("pickup point");
    infoWindow.open(map, pickupMarker)
}