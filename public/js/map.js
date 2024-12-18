
let mapToken1 = mapToken;
let styleUrl = 'https://api.maptiler.com/maps/streets/style.json?key=' + mapToken1;

const map = new maplibregl.Map({
    container: 'map',
    style:
        styleUrl,
    center: coordinates,
    zoom: 8
});

const marker = new maplibregl.Marker({color: 'red'})
    .setLngLat(coordinates)
    .addTo(map);
