/////////////////////////////////////////////////
//////////////JQuary GET Medthod/////////////////
/////////////////////////////////////////////////

$(window).on("load", readCityIO);
var data;

function readCityIO() {
  table = "citymatrix_volpe";
  var cityIOurl = "https://cityio.media.mit.edu/api/table/" + table;


  $.ajax({
    url: cityIOurl,
    dataType: 'JSONP',
    callback: 'jsonData',
    type: 'GET',
    success: function (data) {
      //call viz methods here 
      console.log(new Date(data.timestamp)); //print date of cityIO data
      drawJSON(data);
      threeModel(data);
    },
    error: function () {
      console.log('ERROR');
    }
  });
}