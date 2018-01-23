var svgContainer;
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

// draw to SVG container 
function drawJSON(json) {
    // circleGrid(json);
    pieChart(json);
    treeMap(json);
}

/////////////////////////////////////////////////
///////////////d3 plus treemap //////////////////
/////////////////////////////////////////////////
function treeMap(json) {
    gridWithTypes = JSON.parse(JSON.stringify(json.grid));
    gridWithTypes.forEach(function (cell, index) {
        //building types in data 
        if (cell.type > -1 && cell.type < 6) {
            //make 'Value' term for Desity, so d3plus will fill good 
            cell.value = json.objects.density[cell.type];
        } else {
            //if this cell is not a type, give it an arb. value
            cell.value = 1;
        }
        cell.type = cell.type + 2;
        //removes useless data 
        delete cell.x;
        delete cell.y;
        delete cell.rot;
        //make 'Value' term for Desity, so d3plus will fill good 
        cell.label = typeId[cell.type];
        cell.color = globalColors[cell.type]
    });

    console.log(gridWithTypes);

    //drawing treemap 
    new d3plus.Treemap()
        .select("#temp")
        .data(gridWithTypes)
        .legend(true)
        .groupBy(["label"])
        .padding(5)
        .shapeConfig({
            fill: function (d) {
                return [d.color];
            }
        })
        .render();
}


/////////////////////////////////////////////////
///////////////d3 Grid Visulazation /////////////
/////////////////////////////////////////////////
function circleGrid(json) {

    d3Grid = JSON.parse(JSON.stringify(json.grid));

    // this loop pushes value data from json.object field to each 
    // x,y gridcell so that d3 could use this data
    d3Grid.forEach(function (cell, index) {
        delete cell.rot; //removes useless data 
        if (cell.type > -1 && cell.type < 6) { //building types in data 
            cell.value = json.objects.density[cell.type]; //make 'Value' term for Desity, so d3plus will fill good 
        } else {
            cell.value = 1; //if this cell is not a type, give it an arb. value
        }
    });

    ///////////////////////////////////////////////////////

    var divHeight = document.getElementById("d3Div").offsetHeight;
    var divWidth = document.getElementById("d3Div").offsetWidth;

    //Draw CS grid 
    // load SVG container on load of page 
    svgContainer = d3.select("#d3Div").append("svg");
    var circles = svgContainer.selectAll("circle")
        .data(d3Grid)
        .enter()
        .append("circle");


    var circlesLocation = circles
        .attr("cx", function (d) {
            return 0.9 * divHeight / Math.sqrt(d3Grid.length) * (d.x);
        })
        .attr("cy", function (d) {
            return 0.9 * divWidth / Math.sqrt(d3Grid.length) * (d.y);
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
    var resCount = 0,
        officeCount = 0

    pieGrid = JSON.parse(JSON.stringify(json.grid));
    pieGrid.forEach(function (cell, index) {
        delete cell.rot; //removes useless data 
        delete cell.x; //removes useless data 
        delete cell.y; //removes useless data 
        // delete cell.value; //removes useless data 
        cell.label = typeId[cell.type + 2]; //make 'Value' term for Desity, so d3plus will fill good 

        if (cell.type > 0 && cell.type < 3) {
            resCount = resCount + 1;
        } else if (cell.type > 3 && cell.type < 7) {
            officeCount = officeCount + 1;
        }
    });

    var pie = new d3pie("d3Div", {
        "size": {
            "canvasHeight": 200, //document.getElementById("d3Div2").offsetHeight,
            "canvasWidth": 200, //document.getElementById("d3Div2").offsetWidth,
            pieInnerRadius: "65%"
        },
        "labels": {
            "lines": {
                "enabled": true
            },
            "outer": {
                "pieDistance": 4
            },
            "inner": {
                "hideWhenLessThanPercentage": 3
            },
            "mainLabel": {
                "color": "#F6ECD4",
                "fontSize": 10
            },
            "percentage": {
                "color": "#F6ECD4",
                "decimalPlaces": 0
            },
            "value": {
                "color": "#F6ECD4",
                "fontSize": 5
            },
            "truncation": {
                "enabled": true
            }
        },
        "data": {
            content: [{
                    label: "Living",
                    value: resCount,
                    caption: "Living"
                },
                {
                    label: "Working",
                    value: officeCount,
                    caption: "Working"
                }
            ]
        },
        "misc": {
            "colors": {
                "segments": ["#F4827D", "#A3BFA2"],
                "segmentStroke": "#00000000"
            }
        }
    });
}