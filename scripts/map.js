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
// global data var for API data 
var jsonData;

$(window).on("load", readLocationJson());


function readLocationJson() {
    $.getJSON("locations.json", function (locationsData) {
            vizMap(locationsData)
        })
        .fail(function () {
            console.log("map loc error");
        });
}


function vizMap(locationsData) {
    var map = L.map('map').setView([51.505, -0.09], 1);

    //setup the map API
    L.tileLayer('https://api.mapbox.com/styles/v1/relnox/cj9oqs09o4n4t2rn2ymwrxxug/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag', {
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
        iconUrl: 'img/legoio.png',
        iconSize: [iconSize, iconSize],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        // put different icon for cityIO
        shadowUrl: 'img/shadow.png',
        shadowSize: [iconSize, iconSize],
        shadowAnchor: [0, -20]
    });

    var NoIOIcon = L.icon({
        iconUrl: 'img/lego.png',
        iconSize: [iconSize, iconSize],
        iconAnchor: [0, 0],
        popupAnchor: [0, 0],
        // put different icon for cityIO
        shadowUrl: 'img/shadow.png',
        shadowSize: [iconSize, iconSize],
        shadowAnchor: [0, -10]
    });

    // add icons to cities from locationsData JSON
    for (var i = 0; i < locationsData.length; i++) {
        //check json if this table has cityIO connectivity 
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
        $("#tableImg").empty();
        $("#tableInfo").empty();
        $("#2d").empty();
        $("#3d").empty();

        //find image and text
        var img = new Image();
        boolCityIO = locText = locationsData.find(x => x.city == e.target._popup._content).cityio;
        locText = locationsData.find(x => x.city == e.target._popup._content).text;
        img.src = ('img/' + locationsData.find(x => x.city == e.target._popup._content).image);
        // get name of city from its icon popup 
        var cityName = e.target._popup._content.toString().toLowerCase();
        readCityIO("citymatrix_" + cityName, boolCityIO);

        /////////////////////////////////////////////////
        /////////////// DIV INFO ////////////////////////
        /////////////////////////////////////////////////
        //find inside JSON using only text string 
        var div = document.getElementById('tableInfo');
        div.innerHTML = locText;
        //image  
        var imgDiv = document.getElementById('tableImg');
        imgDiv.appendChild(img);
        img.className = "img-fluid";
        // show modal
        $('#cityio').modal({
            show: true
        });
    }
}

/////////////////////////////////////////////////
//////////////JQuary GET Medthod/////////////////
/////////////////////////////////////////////////

// get table name from map click on icon 
function readCityIO(tableString, boolCityIO) {
    var cityIOurl = "https://cityio.media.mit.edu/api/table/" + tableString;

    // GET method 
    $.ajax({
        url: cityIOurl,
        dataType: 'JSONP',
        callback: 'jsonData',
        type: 'GET',
        success: function (jsonData) {
            //call viz methods here 
            console.log(cityIOurl, new Date(jsonData.timestamp), " ", boolCityIO); //print date of cityIO data
            if (boolCityIO) {
                //Draw 3d 
                threeModel(jsonData);
                //Draw 2d 
                drawJSON(jsonData);
            }
        },
        // or error 
        error: function () {
            console.log('ERROR');
        }
    });
}