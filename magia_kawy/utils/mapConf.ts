import colorPalette from "@/utils/colorPalette";

// Map layout configuration
const mapConf = [
    {
        "featureType": "administrative.country",
        "elementType": "geometry",
        "stylers": [
            { "visibility": "on" },
            { "color": colorPalette.accent }
        ]
    },
    {
        "featureType": "administrative.province",
        "elementType": "geometry",
        "stylers": [
            { "visibility": "off" }
        ]
    },
    {
        "featureType": "administrative.locality",
        "elementType": "geometry",
        "stylers": [
            { "visibility": "off" }
        ]
    },
    {
        "featureType": "administrative.neighborhood",
        "elementType": "geometry",
        "stylers": [
            { "visibility": "off" }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "geometry",
        "stylers": [
            { "visibility": "off" }
        ]
    },
    {
        "featureType": "road",
        "elementType": "all",
        "stylers": [
            { "visibility": "off" }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "all",
        "stylers": [
            { "visibility": "off" }
        ]
    },
    {
        "featureType": "water",
        "elementType": "all",
        "stylers": [
            { "color": colorPalette.background }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "all",
        "stylers": [
            { "color": colorPalette.accent_light }
        ]
    }
];
export default mapConf;