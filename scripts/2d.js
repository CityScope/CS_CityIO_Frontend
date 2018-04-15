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
    // pieChart(json);
    treeMap(json);
}

/////////////////////////////////////////////////
///////////////d3 plus treemap //////////////////
/////////////////////////////////////////////////
function treeMap(json) {

    //drawing treemap 
    google.charts.load('current', {
        'packages': ['treemap']
    });

    google.charts.setOnLoadCallback(drawChart);


    function drawChart() {

        var data = new google.visualization.DataTable();
        // Declare columns
        data.addColumn('string', 'label');
        data.addColumn('number', 'value');

        // Data prep
        gridWithTypes = JSON.parse(JSON.stringify(json.grid));
        gridWithTypes.forEach(function (cell, index) {
            //building types in data 
            if (cell.type > -1 && cell.type < 6) {
                //make 'Value' term for Desity
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
            //make 'Value' term for Desity
            cell.label = typeId[cell.type];
            cell.color = globalColors[cell.type];
            delete cell.type;
            // Add data
            data.addRows([
                [cell.label, cell.value]
            ]);
        });

        console.log(data)

        // draw
        tree = new google.visualization.TreeMap(document.getElementById('2d'));
        tree.draw(data, {
            minColor: '#f00',
            midColor: '#ddd',
            maxColor: '#0d0',
            headerHeight: 15,
            fontColor: 'black',
            showScale: true
        });
    }
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
}