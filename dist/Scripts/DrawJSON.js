var svgContainer;
var typePie

$(document).ready(function () {

    // load SVG container on load of page 
    svgContainer = d3.select("#viz").append("svg")
        .attr("width", 400)
        .attr("height", 400);

    // setup the pie outside of json loop
    typePie = new d3plus.Pie()
        .select("#viz");
});

// draw to SVG container 
function drawJSON(json) {

    /////////////////////////////////////////////////
    ///////////////d3 Grid Visulazation /////////////
    /////////////////////////////////////////////////

    //Data prep for d3
    var grid = json.grid;
    // this loop push value data from json.object to each 
    // gridcell so d3 could us this data
    grid.forEach(function (cell, index) {
        delete cell.rot; //removes useless data 
        if (cell.type > -1 && cell.type < 6) { //building types in data 
            cell.value = json.objects.density[cell.type]; //make 'Value' term for Desity, so d3plus will fill good 
        } else {
            cell.value = 2; //if this cell is not a type, give it an arb. value
        }
    });

    //Draw CS grid 

    var rgbScale = d3.scale.linear()
        .domain([0, 30])
        .range([0, 255]);
    var rgbScaleRev = d3.scale.linear()
        .domain([0, 30])
        .range([255, 0]);

    var circles = svgContainer.selectAll("circle")
        .data(grid)
        .enter()
        .append("circle");

    var circlesLocation = circles
        .attr("cx", function (d) {
            return 20 + (d.x * 20);
        })
        .attr("cy", function (d) {
            return 20 + (d.y * 20);
        });

        
    var circlesAttr = circles
        .style("fill", function (d) {
            return d3.rgb(rgbScale(d.value), rgbScaleRev(d.value), 0);
        }) // set the fill colour 
        .style("stroke", "none")
        .transition()
        .duration(1000)
        .attr("r", function (d) {
            return d.value / 2;
        })

    /////////////////////////////////////////////////
    ///////////////d3 plus ratio pie chart //////////
    /////////////////////////////////////////////////
    
    typePie
        // .Select(["#viz"])
        .groupBy("x")
        .data(grid);
    typePie.innerRadius(100);
    typePie.padPixel(2);
    typePie.render();
}