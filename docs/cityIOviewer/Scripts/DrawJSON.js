var svgContainer;
var typePie

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
            cell.value = 1; //if this cell is not a type, give it an arb. value
        }
    });

    //Draw CS grid 
    // load SVG container on load of page 
    svgContainer = d3.select("#d3Div1").append("svg");

    var rgbScale = d3.scale.linear()
        .domain([0, 30])
        .range([0, 255]);
    var rgbScaleRev = d3.scale.linear()
        .domain([0, 30])
        .range([255, 0]);

    var circles = svgContainer.selectAll("circle")
        // .attr("width", 20)
        // .attr("height", 20)
        .data(grid)
        .enter()
        .append("circle");

    var circlesLocation = circles
        .attr("cx", function (d) {
            return 5 + (d.x * 10);
        })
        .attr("cy", function (d) {
            return 5 + (d.y * 10);
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

    // setup the pie outside of json loop
    typePie = new d3plus.Pie();
    typePie
        .select("#d3Div2")
        .groupBy("x")
        .data(grid)
        .legend(false)
        .shapeConfig({
            function (d) {
                return d = "white";
            }
        });
    typePie.innerRadius(50);
    typePie.padPixel(1);
    typePie.render();
}