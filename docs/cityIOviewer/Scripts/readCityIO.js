$(window).on("load", readCityIO);

// setInterval(function () {
//   readCityIO();
// }, 2000);

/////////////////////////////////////////////////
///////////////URL //////////////////////////////
/////////////////////////////////////////////////

function readCityIO() {

  var cityIOurl = "https://cityio.media.mit.edu/api/table/citymatrix_volpe";

  /////////////////////////////////////////////////
  ///////////////jquary////////////////////////////
  /////////////////////////////////////////////////

  $.ajax({
    url: cityIOurl,
    dataType: 'JSONP',
    callback: 'jsonData',
    type: 'GET',
    success: function (data) {
      //call viz methods here 
      // drawJSON(data);
      threeModel(data);
      console.log(new Date(data.timestamp)); //print date of cityIO data

    },
    error: function () {
      console.log('ERROR');
    }
  });
}


/////////////////////////////////////////////////
//////////////////////FETCH - NO JSONP///////////
/////////////////////////////////////////////////

//   var myHeaders = new Headers();
//   var myInit = {
//     method: 'GET',
//     dataType: 'JSONP',
//     // headers: myHeaders,
//     // mode: 'no-cors',
//     cache: 'default'
//   };
//   fetch(cityIOurl, myInit).then(function (response) {
//       var contentType = response.headers.get("content-type");
//       // console.log(response, Response.url, contentType, Response.status);
//       if (contentType && contentType.includes("application/json")) {
//         return response.json();
//       } else {
//         throw new TypeError("Oops, we haven't got JSON!");
//       }
//     })
//     .then(function (json) {
//       drawJSON(json);
//     })
//     .catch(function (error) {
//       console.log(error);
//     });
// }
//////////////////////////////////////////////////
// P5 JSON Method ////////////////////////////////
//////////////////////////////////////////////////

// function setup() {
//   createCanvas(10, 10);
// }
// function mousePressed() {
//   loadJSON("https://cityio.media.mit.edu/api/table/p/citymatrix_volpe", drawJSON, 'jsonp');
// }
// for (var i = 0; i < parsedJSON.grid.length; i++) {
// console.log(parsedJSON.grid[i].type);
// }
// var parsedJSON = null;