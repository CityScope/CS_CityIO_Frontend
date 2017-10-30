$(document).ready(function () {

    new d3plus.Geomap()
        .data("https://d3plus.org/data/city_coords.json")
        .groupBy("slug")
        .colorScale("dma_code")
        .colorScaleConfig({
            color: ["red", "orange", "yellow", "green", "blue"]
        })
        .label(function (d) {
            return d.city + ", " + d.region;
        })
        .point(function (d) {
            return [d.longitude, d.latitude];
        })
        // .render();


    var d2 = [{
        "title": "D3plus Tooltip",
        "body": "Check out this cool table:",
        "x": 100,
        "y": 120,
        "label": "Position"
    }];

    new d3plus.Tooltip()
        .data(d2)
        .thead(["Axis", function (d) {
            return d.label;
        }])
        .tbody([
            ["x", function (d) {
                return d.x;
            }],
            ["y", function (d) {
                return d.y;
            }]
        ])
        // .render();
});