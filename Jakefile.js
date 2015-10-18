var makeGis = require("./makeGis");

/* global desc */
/* global task */

desc("The default task builds everything...");
task("default", function (params) {
  console.log("Starting build...");
  makeGis.make2DSurveyGeoJson();
});
