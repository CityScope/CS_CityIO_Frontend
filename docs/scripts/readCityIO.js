/////////////////////////////////////////////////
//////////////JQuary GET Medthod/////////////////
/////////////////////////////////////////////////

// global data var for API data 
var data;

// get table name from map click on icon 
function readCityIO(tableString) {
  var cityIOurl = "https://cityio.media.mit.edu/api/table/" + tableString;
  console.log (cityIOurl); 

  // GET method 
  $.ajax({
    url: cityIOurl,
    dataType: 'JSONP',
    callback: 'jsonData',
    type: 'GET',
    success: function (data) {
      //call viz methods here 
      console.log(new Date(data.timestamp)); //print date of cityIO data
      //Draw 3d 
      threeModel(data);
      //Draw 2d 
      drawJSON(data);

    },
    // or error 
    error: function () {
      console.log('ERROR');
    }
  });
}