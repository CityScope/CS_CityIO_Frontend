$(window).on("load", vizMap);

function vizMap() {
    var mymap = L.map('map').setView([51.505, -0.09], 2);

    L.tileLayer('https://api.mapbox.com/styles/v1/relnox/cj48hwknh1sil2rlac9pf319n/tiles/512/{z}/{x}/{y}?access_token=pk.eyJ1IjoicmVsbm94IiwiYSI6ImNpa2VhdzN2bzAwM2t0b2x5bmZ0czF6MzgifQ.KtqxBH_3rkMaHCn_Pm3Pag', {
        maxZoom: 15,
        minZoom: 2,
    }).addTo(mymap);


    // var div = L.DomUtil.create('div', 'viz');
    // // Create marker bind popup with content and add to map;
    // L.marker([51.5, -2]).addTo(mymap)
    //     .bindPopup(div).openPopup();
    // // Create img element and append to div
    // // var img = L.DomUtil.create('img', 'my-img', div);
    // var img = L.DomUtil.create(readCityIO(), div);
    // img.src = 'http://placehold.it/100x100';


    var markers = new L.FeatureGroup();
    // single marker on the map
    var m = new L.Marker([50.5, 30.51]);
    // click event handler to creat a chart and show it in the popup
    m.on("click", function () {
        var div =
            $('<div id="popup"><svg/></div>')[0];
        m.bindPopup(div);
        m.openPopup();
        readCityIO()
        // var svg = d3.select("div svg")
        //     .attr("width", 200)
        //     .attr("height", 200);

        // svg.append("circle")
        //     .style("stroke", "gray")
        //     .style("fill", "white")
        //     .attr("r", 100)
        //     .attr("cx", 100)
        //     .attr("cy", 100)
        //     .on("mouseover", function () {
        //         d3.select(this).style("fill", "aliceblue");
        //     })
        //     .on("mouseout", function () {
        //         d3.select(this).style("fill", "white");
        //     });
    });
    markers.addLayer(m);
    mymap.addLayer(markers);



}