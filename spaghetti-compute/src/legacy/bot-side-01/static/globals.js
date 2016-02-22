//POW Stuff:
//Latest POW, cached
var gotPOW = {};

//Latest POW response
var POWResponse = {};

//Work Unit Stuffs:
//Latest Work Unit, cached in JSON format
var gotWorkUnit = {};

//Scripts:
var gotScriptURL = "";

var oldGotPOW = gotPOW;
var oldPOWResponse = POWResponse;
var oldGotWorkUnit = gotWorkUnit;
var oldGotScriptURL = gotScriptURL;

setInterval(function() {
  if (gotPOW != oldGotPOW) {
    oldGotPOW = gotPOW;
    console.log("gotPOW modified to " + gotPOW);
  }

  if (POWResponse != oldPOWResponse) {
    oldPOWResponse = POWResponse;
    console.log("POWResponse modified to " + POWResponse);
  }

  if (gotWorkUnit != oldGotWorkUnit) {
    oldGotWorkUnit = gotWorkUnit;
    console.log("gotWorkUnit modified to " + gotWorkUnit);
  }

  if (gotScriptURL != oldGotScriptURL) {
    oldGotScriptURL = gotScriptURL;
    console.log("gotScriptURL modified to " + gotScriptURL);
  }
}, 1000);
