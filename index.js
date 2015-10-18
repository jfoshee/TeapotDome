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
console.log(lineCoordinates.pop());
