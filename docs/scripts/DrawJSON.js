var svgContainer;
var grid;

// draw to SVG container 
function drawJSON(json) {
    circleGrid(json);
    treeMap(json);
    pieChart(json);
}

/////////////////////////////////////////////////
///////////////d3 Grid Visulazation /////////////
/////////////////////////////////////////////////

function circleGrid(json) {

    grid = json.grid

    // this loop pushes value data from json.object field to each 
    // x,y gridcell so that d3 could use this data
    grid.forEach(function (cell, index) {
        delete cell.rot; //removes useless data 
        if (cell.type > -1 && cell.type < 6) { //building types in data 
            cell.value = json.objects.density[cell.type]; //make 'Value' term for Desity, so d3plus will fill good 
        } else {
            cell.value = 1; //if this cell is not a type, give it an arb. value
        }
    });

    ///////////////////////////////////////////////////////

    //Draw CS grid 
    // load SVG container on load of page 
    svgContainer = d3.select("#d3Div1").append("svg");
    var circles = svgContainer.selectAll("circle")
        .data(grid)
        .enter()
        .append("circle");

    var circlesLocation = circles
        .attr("cx", function (d) {
            return 20 + (d.x * 10);
        })
        .attr("cy", function (d) {
            return 20 + (d.y * 10);
        });

    var circlesAttr = circles
        .style("fill", function (d) {
            var color = globalColors[d.type + 2];
            return color;

        }) // set the fill colour 
        .style("stroke", "none")
        .transition()
        .duration(1000)
        .attr("r", function (d) {
            if (d.value > 1) {
                return d.value / 5;
            } else
                return d.value;
        })
}


/////////////////////////////////////////////////
////////////////////////////pie chart //////////
/////////////////////////////////////////////////

function pieChart(json) {
    var pieGrid = json.grid;
    var typeId = [
        'PARKING',
        'PARK',
        'Residential Large',
        'Residential Medium',
        'Residential Small',
        'Office Large',
        'Office Medium',
        'Office Small',
        'ROAD',
        'AMENITIES',
        'Misc'
    ]

    // gridWithTypes.forEach(function (cell, index) {
    //     cell.label = typeId[cell.type]; //make 'Value' term for Desity, so d3plus will fill good 
    // });

    console.log(pieGrid)
    new d3pie("d3Div2", {
        "size": {
            "canvasHeight": document.getElementById("d3Div2").offsetHeight,
            "canvasWidth": document.getElementById("d3Div2").offsetWidth,
            pieInnerRadius: "65%"

        },
        "labels": {
            "lines": {
                "enabled": false
            }
        },

        "data": {
            smallSegmentGrouping: {
                enabled: true,
                value: 1,
                valueType: "percentage",
                label: "Smaller"
            },
            "content": pieGrid
        },
        "misc": {
            "colors": {
                "segments": function (d) {
                    var color = globalColors[d.type];
                    return color;
                },
                "segmentStroke": "#00000000",
                "segmentStroke": "#00000000"
            }
        }
    })
}

/////////////////////////////////////////////////
///////////////d3 plus treemap //////////////////
/////////////////////////////////////////////////
function treeMap(json) {
    var gridWithTypes = json.grid;
    var typeId = [
        'PARKING',
        'PARK',
        'Residential Large',
        'Residential Medium',
        'Residential Small',
        'Office Large',
        'Office Medium',
        'Office Small',
        'ROAD',
        'AMENITIES',
        'MISC'
    ]
    gridWithTypes.forEach(function (cell, index) {
        cell.type = cell.type + 2;
        cell.color = globalColors[cell.type]
        delete cell.x; //removes useless data 
        delete cell.y; //removes useless data 
        delete cell.rot; //removes useless data 
        cell.label = typeId[cell.type]; //make 'Value' term for Desity, so d3plus will fill good 
    });

    //drawing treemap 
    new d3plus.Treemap()
        .select("#d3Div3")
        .data(gridWithTypes)
        .legend(true)
        .groupBy(["label"])
        .shapeConfig({
            fill: function (d) {
                return [d.color];
            }
        })
        .render();
}