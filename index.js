var fs = require("fs");


var coordinateText = fs.readFileSync("source/2D_Seismic/2DNavigationLinesA-E.txt", "ascii");
// Values start on line 6
var textLines = coordinateText.split("\r\n").splice(5);
var columns = {
    lineName: 1,
    shotPointNumber: 22,
    x: 47,
    y: 55
};
var getColumn = function(text, columnIndex){
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
console.log(lineCoordinates[0]);
console.log(lineCoordinates[534]);

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
console.log(convertedCoordinates[0]);
console.log(convertedCoordinates[534]);

var GeoJSON = require('geojson');
var g = GeoJSON.parse(convertedCoordinates, {Point: ['y', 'x']});
console.log(g.features[0]);
fs.writeFileSync("2DNavigationLinesA-E.geojson", JSON.stringify(g));
