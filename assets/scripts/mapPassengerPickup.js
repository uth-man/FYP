let socket = io.connect();

let map;
let pickupMark = [];

socket.on('_passenger_pool_loc', params => {

    let marker = new google.maps.Marker();
    marker.setPosition(params.coords);
    marker.setMap(map);
    let infoWindow = new google.maps.InfoWindow();
    infoWindow.setContent(`<b>${params.name}</b><br/>${params.phone}`);
    infoWindow.open(map, marker)

})

function initMap() {

    // Set Current Location on Map
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(p => {
            let currentPosition = { lat: p.coords.latitude, lng: p.coords.longitude }
            map.setCenter(currentPosition);
            addPickupMarker(currentPosition, '<strong>pick-up point</strong>');
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
    });


    // Onclick Marker
    map.addListener('click', (e) => {
        let coords = { lat: e.latLng.lat(), lng: e.latLng.lng() };
        addPickupMarker(coords, 'pick-up point')
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

    // Form
    let form = document.getElementById('search_form');

    // Search bar auto-complete using &libraries=places in url
    let input = document.getElementById('search');

    // using places API
    new google.maps.places.SearchBox(input);


    input.addEventListener('change', (e) => {
        e.preventDefault();

        setTimeout(() => {
            console.log(input.value);
            //get request to Geocoding API
            axios.get('https://maps.googleapis.com/maps/api/geocode/json', {
                params: {
                    address: input.value,
                    key: 'AIzaSyBuWZhosWcom_vVhXGyFwUidpmhPf9z7FA'
                }


            }).then((response) => {
                console.log(response.data.results[0].formatted_address);

                let formattedAddress = response.data.results[0].formatted_address;
                let coords = response.data.results[0].geometry.location;

                input.value = formattedAddress;
                addPickupMarker(coords, '<strong>pick-up point</strong>', coords)

            }).catch((err) => {
                console.log(err);

            });
        }, 1000)

    })

    // Append Marker to pickupMark[]
    function addPickupMarker(coords, content, mapCenterLocation) {
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
        if (mapCenterLocation) {
            map.setCenter(mapCenterLocation)
        }
        let lattitude = document.getElementById('lat');
        let longitude = document.getElementById('lng');
        lattitude.value = coords.lat;
        longitude.value = coords.lng;

        pickupMark.push(marker);
    }

}