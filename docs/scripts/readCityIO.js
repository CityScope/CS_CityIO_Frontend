/////////////////////////////////////////////////
//////////////JQuary GET Medthod/////////////////
/////////////////////////////////////////////////

// global data var for API data 
var jsonData;

// get table name from map click on icon 
function readCityIO(tableString) {
  var cityIOurl = "https://cityio.media.mit.edu/api/table/" + tableString;

  // GET method 
  $.ajax({
    url: cityIOurl,
    dataType: 'JSONP',
    callback: 'jsonData',
    type: 'GET',
    success: function (jsonData) {
      //call viz methods here 
      console.log(cityIOurl);
      console.log(new Date(jsonData.timestamp)); //print date of cityIO data
      //Draw 3d 
      threeModel(jsonData);
      //Draw 2d 
      drawJSON(jsonData);

    },
    // or error 
    error: function () {
      console.log('ERROR');
    }
  });
}