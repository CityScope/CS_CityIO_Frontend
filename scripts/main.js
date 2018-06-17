
import * as L from 'leaflet';
window.$ = require('jquery');
import 'bootstrap';
import * as lego from '/img/lego.png';
import * as legoIO from '/img/legoio.png';
import * as shadow from '/img/shadow.png';
import * as threeViz from '../scripts/threeViz'
import * as radar from '../scripts/radar'

////////////////////////////////////////////////////////////////////////////////////

var updateInterval = 1000;

async function getCityIO(cityIOurl) {
    // GET method 
    return $.ajax({
        url: cityIOurl,
        dataType: 'JSONP',
        callback: 'jsonData',
        type: 'GET',
        success: function (d) {
            return d;
        },
        // or error 
        error: function (e) {
            console.log('GET error: ' + e.status.toString());
        }
    });
}

function clearNames(url) {
    return url.toString().replace("https://cityio.media.mit.edu/api/table/", "");

}
////////////////////////////////////////////////////////////////////////////////////

async function getTables() {
    let tableArray = [];
    let cityIOurl = "https://cityio.media.mit.edu/api/tables/list";
    const tables = await getCityIO(cityIOurl);

    for (let i = 0; i < tables.length; i++) {
        let thisTable = await getCityIO(tables[i]);
        console.log(+ i + ' of ' + tables.length + " total tables: " + clearNames(tables[i]));


        //check id API v2 [to replace with proper check later] 
        if (thisTable.header) {
            thisTable = thisTable.header;
            tableArray.push({
                url: tables[i],
                name: thisTable.name,
                lat: thisTable.spatial.latitude,
                lon: thisTable.spatial.longitude
            });
        }
    }
    makeMap(tableArray);
}
////////////////////////////////////////////////////////////////////////////////////

function makeMap(tablesArray) {
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

    // add icons to cities from locationsData JSON
    for (var i = 0; i < tablesArray.length; i++) {
        //clear names of tables 
        let url = tablesArray[i].url;
        url = clearNames(url);
        console.log("mapping only cityIO tables " + i + ') ' + clearNames(url));
        //create map marker 
        let marker = new L.marker(
            [tablesArray[i].lat, tablesArray[i].lon],
            { icon: IOIcon })
            .bindPopup('CityScope: ' + url)
            .addTo(map)
        marker.properties = tablesArray[i];

        marker.on('mouseover', function () {
            this.openPopup();
        });
        marker.on('mouseout', function () {
            this.closePopup();
        });
        marker.on('click', function () {
            //pass the marker data to setup method
            modalSetup(marker);
        });
    }

    // click event handler to creat a chart and show it in the popup
    async function modalSetup(m) {
        //get the binded props 
        let tableMeta = m.properties;
        //get the divs for content 
        var infoDiv = document.getElementById('infoDiv');
        var threeDiv = document.getElementById('threeDiv');
        //put prj name in div 
        infoDiv.innerHTML = m.properties.name;
        //clearing the three div
        threeDiv.innerHTML = "";
        //open up the modal 
        $('#modal').modal('toggle');
        //setup threeJS
        const cityIOjson = await getCityIO(m.properties.url);
        // threeViz.threeViz(cityIOjson);
        radar.radarInit();
        //start interval fix set interval that way: 
        //http://onezeronull.com/2013/07/12/function-is-not-defined-when-using-setinterval-or-settimeout/
        var refreshIntervalId = setInterval(function () { update(tableMeta.url) }, updateInterval);

        //stop update on modal close
        $("#modal").on("hide.bs.modal", function () {
            clearInterval(refreshIntervalId);
        });
    }
}

////////////////////////////////////////////////////////////////////////////////////

async function update(url) {
    const cityIOjson = await getCityIO(url);
    console.log(cityIOjson.timestamp);
    //should fix with THREE setup and Update 
    // threeViz.threeViz(cityIOjson);
    radar.radarUpdate();

}



//////////////////////////////////////////
// APP LOGIC
//////////////////////////////////////////
getTables()
