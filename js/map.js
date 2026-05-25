

let mapInstance = null;
let mapMarkers = [];
let activeInfoWindow = null;


const MAP_THEME_STYLE = [
    {
        "elementType": "geometry",
        "stylers": [
            { "color": "#F5F7FA" }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            { "visibility": "off" }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#64748B" }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            { "color": "#F5F7FA" }
        ]
    },
    {
        "featureType": "administrative.land_parcel",
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#94A3B8" }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            { "color": "#E2E8F0" }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#475569" }
        ]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [
            { "color": "#FFFFFF" }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#64748B" }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry",
        "stylers": [
            { "color": "#CBD5E1" }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#475569" }
        ]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            { "color": "#C1D9F0" } 
        ]
    },
    {
        "featureType": "water",
        "elementType": "labels.text.fill",
        "stylers": [
            { "color": "#94A3B8" }
        ]
    }
];


const GHAT_GEOLOCATIONS = {
    "ghat-antarvedi": { lat: 16.326, lng: 81.728 },
    "ghat-bhadrachalam": { lat: 17.670, lng: 80.887 },
    "ghat-pushkar": { lat: 17.000, lng: 81.776 },
    "ghat-pattiseema": { lat: 17.155, lng: 81.605 },
    "ghat-dharmapuri": { lat: 18.950, lng: 79.088 }
};

const REQUESTED_GHATS = [
    { id: "ghat-antarvedi", name: "Antarvedi Confluence Ghat", district: "Konaseema - Antarvedi", risk: "safe", occupancy: 2500, capacity: 8000 },
    { id: "ghat-bhadrachalam", name: "Bhadrachalam Main Ghat", district: "Bhadradri Kothagudem - Bhadrachalam", risk: "busy", occupancy: 6500, capacity: 8000 },
    { id: "ghat-pushkar", name: "Pushkar Ghat", district: "East Godavari - Rajamahendravaram", risk: "critical", occupancy: 9500, capacity: 9000 },
    { id: "ghat-pattiseema", name: "Pattiseema Ghat", district: "Eluru - Pattiseema", risk: "busy", occupancy: 5200, capacity: 7000 },
    { id: "ghat-dharmapuri", name: "Dharmapuri Lakshmi Narasimha Ghat", district: "Jagtial - Dharmapuri", risk: "moderate", occupancy: 4200, capacity: 7000 }
];


window.initMap = function() {
    const mapElement = document.getElementById("map");
    if (!mapElement) {
        console.error("Map container element not found in DOM.");
        return;
    }

    
    mapInstance = new google.maps.Map(mapElement, {
        center: { lat: 16.578, lng: 82.006 },
        zoom: 8,
        styles: MAP_THEME_STYLE,
        disableDefaultUI: true, 
        zoomControl: true,      
        fullscreenControl: false,
        streetViewControl: false,
        mapTypeControl: false
    });

    
    renderGoogleMapMarkers();

    
    document.addEventListener("DOMContentLoaded", () => {
        
    });
};


function renderGoogleMapMarkers() {
    
    mapMarkers.forEach(m => m.setMap(null));
    mapMarkers = [];

    REQUESTED_GHATS.forEach(ghat => {
        const coords = GHAT_GEOLOCATIONS[ghat.id];
        if (!coords) return;

        
        
        let markerColor = "#10B981"; 
        if (ghat.risk === "busy") markerColor = "#EA580C"; 
        else if (ghat.risk === "moderate") markerColor = "#3B82F6"; 
        else if (ghat.risk === "critical") markerColor = "#DC2626"; 

        
        const markerIcon = {
            path: google.maps.SymbolPath.CIRCLE,
            fillColor: markerColor,
            fillOpacity: 1,
            scale: 9,
            strokeColor: "#FFFFFF",
            strokeWeight: 2,
        };

        const marker = new google.maps.Marker({
            position: coords,
            map: mapInstance,
            title: ghat.name,
            icon: markerIcon
        });

        
        mapMarkers.push(marker);

        
        const occupancyPct = ((ghat.occupancy / ghat.capacity) * 100).toFixed(1);
        const statusLabel = ghat.risk.toUpperCase();
        
        const contentHTML = `
            <div style="font-family: 'Inter', sans-serif; padding: 6px; min-width: 180px;">
                <h4 style="margin: 0 0 4px 0; font-weight: 700; color: var(--text-primary); font-size: 0.88rem;">${ghat.name}</h4>
                <p style="margin: 0 0 6px 0; font-size: 0.72rem; color: var(--text-muted); font-weight: 500;">${ghat.district}</p>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-light); padding-top: 6px; margin-top: 4px;">
                    <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary);">Occupancy:</span>
                    <strong style="font-size: 0.75rem; color: var(--text-primary);">${occupancyPct}%</strong>
                </div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-top: 4px;">
                    <span style="font-size: 0.75rem; font-weight: 600; color: var(--text-secondary);">Risk Level:</span>
                    <span style="font-size: 0.65rem; font-weight: 700; color: ${markerColor}; text-transform: uppercase;">${statusLabel}</span>
                </div>
            </div>
        `;

        const infoWindow = new google.maps.InfoWindow({
            content: contentHTML
        });

        
        marker.addListener("click", () => {
            if (activeInfoWindow) {
                activeInfoWindow.close();
            }

            infoWindow.open(mapInstance, marker);
            activeInfoWindow = infoWindow;

            
            if (window.showSystemBanner) {
                window.showSystemBanner(`Marker Selected: ${ghat.name} - Occupancy ${occupancyPct}%`);
            }
        });
    });
}
