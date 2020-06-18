let map;
let markers = [];

function initMap() {

    // Set Current Location on Map
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(p => {
            let currentPosition = { lat: p.coords.latitude, lng: p.coords.longitude }
            map.setCenter(currentPosition);
            addMarker(currentPosition, currentLocationImage, '<strong>pick-up point</strong>');
            let latlng = p.coords.latitude + "," + p.coords.longitude;

            //get request to reverse Geocoding API
            axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    latlng: latlng,
                    key: 'AIzaSyBuWZhosWcom_vVhXGyFwUidpmhPf9z7FA'
                }
            }).then((response) => {
                let formattedAddress = response.data.results[0].formatted_address;
                input.value = formattedAddress;
            }).catch((err) => {
                console.log(err);

            });
        })

    }
    map = new google.maps.Map(document.getElementById("map"), {
        zoom: 16,
        draggableCursor: "default"
    });
    let currentLocationImage = {
        url: "https://img.icons8.com/plasticine/100/000000/standing-man.png",
        scaledSize: new google.maps.Size(50, 50)
    }



    // Onclick Marker
    map.addListener('click', (e) => {
        let coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        addMarker(coords, currentLocationImage, 'pick-up point')
        let latlng = e.latLng.lat() + "," + e.latLng.lng()

        //get request to reverse Geocoding API
        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                latlng: latlng,
                key: 'AIzaSyBuWZhosWcom_vVhXGyFwUidpmhPf9z7FA'
            }
        }).then((response) => {
            let formattedAddress = response.data.results[0].formatted_address;
            input.value = formattedAddress;
        }).catch((err) => {
            console.log(err);

        });

    })

    // Append Marker to markers[]
    function addMarker(coords, icon, content, mapCenterLocation) {
        if (!markers.length == 0) {
            markers.forEach(m => {
                m.setMap(null);
            })
        }
        //map.setCenter(coords)
        let marker = new google.maps.Marker();
        marker.setPosition(coords);
        marker.setMap(map);
        if (icon) {
            marker.setIcon(icon)
        }
        if (content) {
            let infoWindow = new google.maps.InfoWindow();
            infoWindow.setContent(content);
            infoWindow.open(map, marker)
        }
        if (mapCenterLocation) {
            map.setCenter(mapCenterLocation)
        }
        markers.push(marker);
    }

    // Search bar auto-complete using &libraries=places in url
    let input = document.getElementById('search');
    // Form
    let form = document.getElementById('search_form');
    // using places API
    new google.maps.places.SearchBox(input);

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        //get request to Geocoding API
        axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
            params: {
                address: input.value,
                key: 'AIzaSyBuWZhosWcom_vVhXGyFwUidpmhPf9z7FA'
            }
        }).then((response) => {
            let formattedAddress = response.data.results[0].formatted_address;
            let coords = response.data.results[0].geometry.location;

            input.value = formattedAddress;
            addMarker(coords, currentLocationImage, '<strong>pick-up point</strong>', coords)

        }).catch((err) => {
            console.log(err);

        });

    })


}