//some helper functions that join together stuff

importScripts("/static/globals.js");
importScripts("/static/getpow.js");
importScripts("/static/getworkunit.js");

//the big function that processes everything
var doProcess = function(POWRequestURL, workUnitRequestURL, scriptRequestURL) {
  //yay big chain o' promisois
  return doChainedPOW(POWRequestURL).then(function(response) {
    return getLatestWorkUnit(workUnitRequestURL).then(function(response){
      gotScriptURL = scriptRequestURL;
    });
  }).catch(function(error) {
    //in case we die together, in hormonnnny
    console.error("you fool");
    alert("you fool: " + error);

    return error;
  });
};
