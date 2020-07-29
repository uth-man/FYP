
let map;
let pickupMark = [];
function initMap() {
    // Set Current Location on Map
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(p => {
            let currentPosition = { lat: p.coords.latitude, lng: p.coords.longitude }
            map.setCenter(currentPosition);
            addPickupMarker(currentPosition, '<strong>pick-up point</strong>');
        })

    }
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        draggableCursor: "default",
        disableDefaultUI: true,
    })
    map.addListener('click', (e) => {
        let coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        addPickupMarker(coords, 'pick-up point')
    })
    function addPickupMarker(coords, content) {
        if (!pickupMark.length == 0) {
            pickupMark.forEach(m => {
                m.setMap(null);
            })
        }
        //map.setCenter(coords)
        let marker = new google.maps.Marker();
        marker.setPosition(coords);
        marker.setMap(map);

        // marker.setIcon({
        //     url: "https://img.icons8.com/plasticine/100/000000/standing-man.png",
        //     scaledSize: new google.maps.Size(50, 50)
        // })

        if (content) {
            let infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(content);
            infoWindow.open(map, marker)
        }
        pickupMark.push(marker);
    }



}