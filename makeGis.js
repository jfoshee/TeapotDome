var fs = require("fs");
var assert = require("assert");

function make2DSurveyGeoJson() {
    if (!Array.prototype.last){
        Array.prototype.last = function(){
            return this[this.length - 1];
        };
    };
    
    var coordinateText = fs.readFileSync("source/2D_Seismic/2DNavigationLinesA-E.txt", "ascii");
    // Values start on line 6
    var textLines = coordinateText.split("\r\n").splice(5);
    var columns = {
        lineName: 1,
        shotPointNumber: 22,
        x: 47,
        y: 55
    };
    function getColumn(text, columnIndex){
        text += " ";
        return text.substring(columnIndex, text.indexOf(" ", columnIndex));
    };
    
    var lineCoordinates = [];
    for (var i = 0; i < textLines.length; i++) {
        var text = textLines[i];
        if (text.length < 2) continue;
        var coordinate = {
            name: getColumn(text, columns.lineName),
            shotPointNumber: getColumn(text, columns.shotPointNumber),
            x: getColumn(text, columns.x),
            y: getColumn(text, columns.y)
        };
        lineCoordinates.push(coordinate);
    }
    console.log(lineCoordinates.length + " coordinates loaded");
    assert.equal(lineCoordinates.length, 535, "Should be 535 coordinate lines in file");
    //console.log(lineCoordinates[0]);
    //console.log(lineCoordinates[534]);
    
    var proj4 = require("proj4");
    var epsg32056 = "EPSG:32056";
    var wgs84 = "WGS84"; 
    proj4.defs(epsg32056,"+proj=tmerc +lat_0=40.66666666666666 +lon_0=-107.3333333333333 +k=0.999941177 +x_0=152400.3048006096 +y_0=0 +datum=NAD27 +units=us-ft +no_defs");
    proj4.defs(wgs84, "+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees");
    var conversion = proj4(epsg32056, wgs84);
    
    var convertedCoordinates = [];
    for (var i = 0; i < lineCoordinates.length; i++) {
        var p = conversion.forward(lineCoordinates[i]);
        convertedCoordinates.push(p);
    }
    //console.log(convertedCoordinates[0]);
    //console.log(convertedCoordinates[534]);
    console.log("Coordinates converted to " + wgs84);
    
    function named(name) {
        return function(p) { return p.name === name; }
    }
    
    function shotPointsFor(name) {
        return convertedCoordinates.filter(named(name));
    }
    
    function selectPointCoordinates(p) {
        return [p.x, p.y];
    }
    
    function pointsToLine(coords) {
        return { 
            name: coords[0].name,
            line: coords.map(selectPointCoordinates)
        };
    }
    
    function selectLine(name) {
        var coords = shotPointsFor(name);
        var line = pointsToLine(coords);
        return line;
    }
    //console.log(selectLine("A"));
    
    
    // TODO: Break dependence on hard-coded names
    var lines = [
        selectLine("A"),
        selectLine("B"),
        selectLine("C"),
        selectLine("D"),
        selectLine("E"),
        shotPointsFor("A")[0],
        shotPointsFor("B")[0],
        shotPointsFor("C")[0],
        shotPointsFor("D")[0],
        shotPointsFor("E")[0],
        shotPointsFor("A").last(),
        shotPointsFor("B").last(),
        shotPointsFor("C").last(),
        shotPointsFor("D").last(),
        shotPointsFor("E").last()
    ];
    assert.equal(lines[0].line.length, 1 + 302 - 100, "Line A shotpoints");
    assert.equal(lines[1].line.length, 1 + 182 - 100, "Line B shotpoints");
    assert.equal(lines[4].line.length, 1 + 162 - 103, "Line E shotpoints");
        
    var GeoJSON = require('geojson');
    // var g = GeoJSON.parse(convertedCoordinates, {Point: ['y', 'x']});
    var g = GeoJSON.parse(lines, { Point: ['y', 'x'], 'LineString': 'line'} );
    //console.log(g.features[0]);
    assert.equal(g.features[0].geometry.coordinates.length, 203);
    fs.writeFileSync("2DNavigationLinesA-E.geojson", JSON.stringify(g, null, 2));
    console.log("2DNavigationLinesA-E.geojson updated. Features: " + g.features.length);
}

module.exports = {
    make2DSurveyGeoJson: make2DSurveyGeoJson
};
