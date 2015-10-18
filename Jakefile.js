var makeGis = require("./makeGis");

// jakejs functions:
/* global desc */
/* global task */
/* global file */

desc("The default task builds everything...");
task("default", ["2DNavigationLinesA-E.geojson"], function (params) {
    console.log("Starting build...");
});

desc("Update the 2D survey geojson");
file("2DNavigationLinesA-E.geojson", ["source/2D_Seismic/2DNavigationLinesA-E.txt"], function() {
    makeGis.make2DSurveyGeoJson();
});
