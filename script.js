proj4.defs('EPSG:3059', '+proj=tmerc +lat_0=56.0 +lon_0=24.0 +k=1.0 +x_0=500000 +y_0=500000 +datum=WGS84 +units=m +no_defs');

// sākuma skats
var map = L.map('map').setView([56.9467, 24.1203], 7);  // Central point for Latvia

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

// geojson dati no faila
fetch('dati.json')
    .then(response => response.json()) 
    .then(data => {
        data.features.forEach(feature => {
            const coordinates = feature.geometry.coordinates;
            const placeName = feature.properties.PLACENAME;
            const regCode = feature.properties.REG_CODE;
            const lvmDistrict = feature.properties.LVM_DISTRI;
            const blockKey = feature.properties.BLOCKKEY;

            // koord konverts
            const convertedCoords = proj4('EPSG:3059', 'EPSG:4326', [coordinates[0], coordinates[1]]);
            
            // drop pins
            const marker = L.marker([convertedCoords[1], convertedCoords[0]])  // [latitude, longitude]
                .addTo(map); 

            const popupContent = `
                <h3>${placeName}</h3>
                <p><strong>Region Code:</strong> ${regCode}</p>
                <p><strong>LVM District:</strong> ${lvmDistrict}</p>
                <p><strong>Block Key:</strong> ${blockKey}</p>
            `;

            // drop pina popups
            marker.bindPopup(popupContent);
        });
    })
    .catch(error => {
        console.error('Error loading or parsing dati.json:', error);
    });
