const socket = io.connect();

let map;

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
console.log(socketId);

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

                                } else {
                                    console.log("=========================");
                                    console.log("No nearest pools")
                                    console.log("=========================");
                                }
                            }
                        })
                    } else {
                        console.log("=========================");
                        console.log("No nearest pools")
                        console.log("=========================");
                    }
                }
            })
        });
    });

}
function distanceCalculator(origin, destination) {

}
function drawMarker(coords, content) {
    let marker = new google.maps.Marker();
    marker.setPosition(coords);
    marker.setMap(map);

    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(content);
    infoWindow.open(map, marker);
}


