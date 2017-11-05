$(window).on("load", vizMap);

var locationsData;

function readTextFile(file, callback) {
    var rawFile = new XMLHttpRequest();
    rawFile.overrideMimeType("application/json");
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function () {
        if (rawFile.readyState === 4 && rawFile.status == "200") {
            callback(rawFile.responseText);
        }
    }
    rawFile.send(null);
}
readTextFile("locations.json", function (text) {
    locationsData = JSON.parse(text);
    console.log(locationsData);
});

function vizMap() {

    var mymap = L.map('map').setView([51.505, -0.09], 2);

    //setup the map API
    L.tileLayer('https://api.mapbox.com/styles/v1/relnox/cj9lgc0d51kw02rqksabdwqqn/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag', {
        maxZoom: 15,
        minZoom: 2,
    }).addTo(mymap);

    //hide leaflet link
    document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';

    /////////////////////////////////////////////////
    ///////////////Map icons  ///////////////////////
    /////////////////////////////////////////////////

    // create a costum map icon
    var iconSize = 30;
    var legoIcon = L.icon({
        iconUrl: 'img/lego.png',
        iconSize: [iconSize, iconSize],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        shadowUrl: 'img/shadow.png',
        shadowSize: [iconSize, iconSize],
        shadowAnchor: [0, -20]
    });

    //add this icon to marker 
    var markers = new L.FeatureGroup();
    // single marker on the map
    var m = new L.Marker([60.5, 30.51], {
        icon: legoIcon
    });

    // click event handler to creat a chart and show it in the popup
    m.on("click", function () {
        // var div =
        //     $('<div id="popup"><svg/></div>')[0];
        // m.bindPopup(div, popupOptions);
        // m.openPopup();
    });
    markers.addLayer(m);
    mymap.addLayer(markers);



}