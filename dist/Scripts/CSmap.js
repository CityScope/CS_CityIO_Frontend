$(window).on("load", vizMap);

function vizMap() {


    var mymap = L.map('map').setView([51.505, -0.09], 2);

    // Set bounds to New York, New York
    var bounds = [
        [-74.04728500751165, 40.68392799015035], // Southwest coordinates
        [-73.91058699000139, 40.87764500765852] // Northeast coordinates
    ];

    //setup the map API
    L.tileLayer('https://api.mapbox.com/styles/v1/relnox/cj9hhvimr9xwq2rqnsyikfr0w/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag', {
        maxZoom: 15,
        minZoom: 2,
        maxBounds: bounds // Sets bounds as max

    }).addTo(mymap);

    //hide leaflet link
    document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';

    // create a costum map icon
    var legoIcon = L.icon({
        iconUrl: '/img/lego.png',
        iconSize: [50, 50],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        shadowUrl: '/img/shadow.png',
        shadowSize: [50, 50],
        shadowAnchor: [0, -20]
    });

    //add this icon to marker 
    var markers = new L.FeatureGroup();
    // single marker on the map
    var m = new L.Marker([60.5, 30.51], {
        icon: legoIcon
    });
    //setup popup options for clicking on marker 
    var popupOptions = {
        'maxWidth': '200',
        'maxHeight': '200'

    }
    // click event handler to creat a chart and show it in the popup
    m.on("click", function () {
        var div =
            $('<div id="popup"><svg/></div>')[0];
        m.bindPopup(div, popupOptions);
        m.openPopup();
        readCityIO()

    });
    markers.addLayer(m);
    mymap.addLayer(markers);



}