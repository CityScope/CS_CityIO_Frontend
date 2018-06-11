import * as threeViz from '../scripts/threeViz'
import * as radarViz from '../scripts/radarViz'


export function getCityIO() {
    var cityIOurl = "https://cityio.media.mit.edu/api/table/CityScopeJS";
    console.log(cityIOurl);

    // GET method 
    $.ajax({
        url: cityIOurl,
        dataType: 'JSONP',
        callback: 'jsonData',
        type: 'GET',
        success: function (jsonData) {
            //call viz methods here 
            console.log("cityIO read at: ", new Date(jsonData.timestamp)); //print date of cityIO data
            ///
            threeViz.threeViz(jsonData);
            radarViz.initRadar(jsonData);
        },
        // or error 
        error: function () {
            console.log('ERROR');
        }
    });
}

