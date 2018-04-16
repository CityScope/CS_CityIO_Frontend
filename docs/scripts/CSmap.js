$(window).on("load", readLocationJson());

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
var locationsData;

function readLocationJson() {
    $.getJSON("locations.json", function (locationsData) {
        vizMap(locationsData)
    })
        .fail(function () {
            console.log("error");
        });
}


function vizMap(locationsData) {

    var map = L.map('map').setView([51.505, -0.09], 2);


    //setup the map API
    L.tileLayer('https://api.mapbox.com/styles/v1/relnox/cjg1ixe5s2ubp2rl3eqzjz2ud/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag', {
        maxZoom: 15,
        minZoom: 2,
    }).addTo(map);

    //hide leaflet link
    document.getElementsByClassName('leaflet-control-attribution')[0].style.display = 'none';
    document.getElementsByClassName('leaflet-top leaflet-left')[0].style.display = 'none';

    map.setMaxBounds(map.getBounds());


    /////////////////////////////////////////////////
    ///////////////Map icons  ///////////////////////
    /////////////////////////////////////////////////

    // create a costum map icon
    var iconSize = 55;
    var IOIcon = L.icon({
        iconUrl: 'img/legoio.png',
        iconSize: [iconSize, iconSize],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        shadowUrl: 'img/shadow.png', // put different icon for cityIO
        shadowSize: [iconSize, iconSize],
        shadowAnchor: [0, -20]
    });
    var NoIOIcon = L.icon({
        iconUrl: 'img/lego.png',
        iconSize: [iconSize, iconSize],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        shadowUrl: 'img/shadow.png', // put different icon for cityIO
        shadowSize: [iconSize, iconSize],
        shadowAnchor: [0, -20]
    });

    // add ocns to cities from locationsData JSON
    for (var i = 0; i < locationsData.length; i++) {
        if (locationsData[i].cityio) {
            marker = new L.marker([locationsData[i].latitude, locationsData[i].longitude], {
                icon: IOIcon
            }).bindPopup(locationsData[i].city).addTo(map).on('click', onClick);
        } else {
            marker = new L.marker([locationsData[i].latitude, locationsData[i].longitude], {
                icon: NoIOIcon
            }).bindPopup(locationsData[i].city).addTo(map).on('click', onClick);
        }
    }
    // click event handler to creat a chart and show it in the popup
    function onClick(e) {

        // clear all divs for new data 
        $("#tableInfoDiv").empty();
        $("#tableImgDiv").empty();
        $("#d3Div1").empty();
        $("#d3Div2").empty();
        $("#d3Div3").empty();
        $("#threeDiv").empty();

        if (document.getElementById("tmpbg")) {
            document.getElementById("tmpbg").outerHTML = "";
            delete document.getElementById("tmpbg");
        }

        //Find  if this is a cityIO table yes/no
        var cityIObool = locationsData.find(x => x.city == e.target._popup._content).cityio;
        locText = locationsData.find(x => x.city == e.target._popup._content).text;
        var img = new Image();
        img.src = ('img/' + locationsData.find(x => x.city == e.target._popup._content).image);

        //and then use it to initate data in viz divs
        if (cityIObool) {
            // get name of city from its icon popup 
            var cityName = e.target._popup._content.toString().toLowerCase();

            if (cityName.length < 1) { // to allow a nameless table 
                readCityIO("citymatrix");
            } else {
                readCityIO("citymatrix_" + cityName);
            }

            /////////////////////////////////////////////////
            ///////////////CITYIO DIV INFO //////////////////
            /////////////////////////////////////////////////

            //find inside JSON using only text string 
            var div = document.getElementById('tableInfoDiv');
            div.innerHTML += locText;

            //image  
            var imgDiv = document.getElementById('tableImgDiv');
            imgDiv.appendChild(img);

        } else {

            /////////////////////////////////////////////////
            ///////////////Non-IO DIV INFO ///////////////////
            /////////////////////////////////////////////////

            //find inside JSON using only text string 
            var div = document.getElementById('threeDiv');
            div.innerHTML += locText;

            //image  
            var imgDiv = document.getElementById('tableImgDiv');
            imgDiv.appendChild(img);

        }

    }
}