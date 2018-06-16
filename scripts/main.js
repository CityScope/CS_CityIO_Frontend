
import * as L from 'leaflet';
window.$ = require('jquery');
import 'bootstrap';
import * as lego from '/img/lego.png';
import * as legoIO from '/img/legoio.png';
import * as shadow from '/img/shadow.png';
import * as threeViz from '../scripts/threeViz'
import * as radarViz from '../scripts/radarViz'

/*logic: run call to cityIO for all tables. 
get only header and parse only API v2.
On icon click, render table grid 
*/

// console.log([Object.keys(images)[0]]);

/////////////////////

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


async function getTables() {
    let tableArray = [];
    let cityIOurl = "https://cityio.media.mit.edu/api/tables/list";
    const tables = await getCityIO(cityIOurl);
    console.log(tables.length + " total CS tables");

    for (let i = 0; i < tables.length; i++) {
        let thisTable = await getCityIO(tables[i]);

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
    vizMap(tableArray);

    // let urls = d.toString();
    // urls = urls.replace("https://cityio.media.mit.edu/api/tables/", "");
    // console.log(urls);
    // // console.log("cityIO read at: ", new Date(jsonData.timestamp)); //print date of cityIO data
    // ///
    // // threeViz.threeViz(jsonData);
    // // radarViz.initRadar(jsonData);
}

function vizMap(tablesArray) {
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
        new L.marker([tablesArray[i].lat, tablesArray[i].lon], { icon: IOIcon })
            .title(tablesArray[i].name)
            // .bindPopup(tablesArray[i].name)
            .addTo(map).on('click', onClick);
    }

    // click event handler to creat a chart and show it in the popup
    function onClick(e) {
        console.log(e);

        var infoDiv = document.getElementById('infoDiv');
        var threeDiv = document.getElementById('threeDiv');
        //clearing the divs 
        threeDiv.innerHTML = "";

        $('#modal').modal('toggle');

        //find inside JSON using only text string 
        infoDiv.innerHTML = tablesArray[i].name;
        // vizSetup.getCityIO();



    }
}
//////////////////////////////////////////
// APP LOGIC
//////////////////////////////////////////

getTables()
// decalre json location data globally 
