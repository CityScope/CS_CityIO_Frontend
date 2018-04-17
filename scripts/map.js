import * as L from 'leaflet';
window.$ = require('jquery');
import 'bootstrap';


import * as lego from '/img/lego.png';
import * as legoIO from '/img/legoio.png';
import * as shadow from '/img/shadow.png';
import images from '../img/*';
import * as jsonData from "/locations.json";


// global holder for theme colors 
var globalColors = [
    '#ED5066',
    '#F4827D',
    '#F4B99E',
    '#FDCAA2',
    '#F6ECD4',
    '#CCD9CE',
    '#A5BBB9',
    '#A3BFA2',
    '#80ADA9',
    '#668a87',
    '#405654',
    '#263C3A',
    '#263C3A',
    '#14181a'
];

// decalre json location data globally 
vizMap(jsonData);
function vizMap(locationsData) {
    var map = L.map('map').setView([51.505, -0.09], 1);
    // setup the map API
    L.tileLayer(
        'https://api.mapbox.com/styles/v1/relnox/cjg1ixe5s2ubp2rl3eqzjz2ud/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag'
        , {
            maxZoom: 15,
            minZoom: 2,
        }).addTo(map);
    //hide leaflet link
    document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';
    document.getElementsByClassName('leaflet-top leaflet-left')[0].style.display = 'none';
    //lock map to relevant area view 
    map.setMaxBounds(map.getBounds());
    ///////////////Map icons///////////////////////
    // create a costum map icon [cityIO or non]
    var iconSize = 40;
    var IOIcon = L.icon({
        iconUrl: legoIO.default,
        iconSize: [iconSize, iconSize],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        shadowUrl: shadow.default,
        shadowSize: [iconSize, iconSize],
        shadowAnchor: [0, -20]
    });
    // put different icon for cityIO
    var NoIOIcon = L.icon({
        iconUrl: lego.default,
        iconSize: [iconSize, iconSize],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        shadowUrl: shadow.default,
        shadowSize: [iconSize, iconSize],
        shadowAnchor: [0, -20]
    });
    // obj to array 
    let locDat = Object.keys(locationsData);
    // add icons to cities from locationsData JSON
    for (var i = 0; i < locDat.length - 1; i++) {
        //check json if this table has cityIO connectivity 
        if (locationsData[i].cityio) {
            let marker = new L.marker([locationsData[i].latitude, locationsData[i].longitude], {
                icon: IOIcon
            }).bindPopup(locationsData[i].city).addTo(map).on('click', onClick);
        } else {
            let marker = new L.marker([locationsData[i].latitude, locationsData[i].longitude], {
                icon: NoIOIcon,
            }).bindPopup(locationsData[i].city).addTo(map).on('click', onClick);
        }
    }
    // click event handler to creat a chart and show it in the popup
    function onClick(e) {
        document.getElementById('imgDiv').innerHTML = "";

        $('#modal').modal('toggle');

        for (var i = 0; i < locDat.length - 1; i++) {
            //compare the map icon to the json data 
            if (e.latlng.lat == locationsData[i].latitude) {
                //find image and text
                var img = new Image();
                var path = images[locationsData[i].image]
                img.src = path;
                var imgDiv = document.getElementById('imgDiv');
                imgDiv.appendChild(img);
                img.className = "img-fluid";

                //find inside JSON using only text string 
                var infoDiv = document.getElementById('infoDiv');
                infoDiv.innerHTML = locationsData[i].text;
            }
        }
    }
}
