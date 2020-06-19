let map;
let markers = [];
let initialCurrentLocation;
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
                // console.log(coords); 

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
        draggableCursor: 'default'

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
        marker.setIcon(icon)

        markers.push(marker)
    }

}