// import scripts
importScripts("https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.0.2/sha.js");

//URL for work unit manager
var workUnitManagerURLRef = "http://ueks277167ba.ethan2-0.koding.io:5002";

//the "main" function used to start tasks
var startTask = function (workUnitManagerURL) {
  //"global" variables
  //cached POW request-response given from the server
  var rawServerPOW = {};

  //solved POW
  var solvedPOW = {};

  //cached work unit
  var rawServerWorkUnit = {};

  //cached work unit response
  var workUnitResponse = "";

  //getting POW
  fetch(workUnitManagerURL + "/proofofwork/get").then(function(response) {
    //gets the initial POW from the server as json
    return response.json();
  }).then(function(response) {
    //takes the POW and caches it
    rawServerPOW = response;

    console.log(rawServerPOW);
    return rawServerPOW;
  }).then(function(response) {
    //solving POW so we know they did real work
    var suffix = 0;
    var sha = new jsSHA("SHA-384", "TEXT");
    sha.update(response.prefix.toString() + suffix.toString());
    //repeatedly try hashed values of suffix and prefix until the hash starts with 0000
    while(sha.getHash("HEX").indexOf("0000") !== 0) {
      suffix ++;
      sha = new jsSHA("SHA-384", "TEXT");
      sha.update(response.prefix.toString() + suffix.toString());
    }

    //store the solved POW
    solvedPOW = {
      "prefix" : response.prefix,
      "mac" : response.mac,
      "time" : response.time,
      "suffix" : suffix
    };

    console.log(solvedPOW);
    return solvedPOW;
  }).then(function(response) {

    //get the work unit from the server
    fetch(workUnitManagerURL + "/workunit/get", {

      method : 'post',
      headers : {
        'Accept' : 'application/json',
        'Content-Type' : 'application/json'
      },
      //add solved POW for validation
      body : JSON.stringify(solvedPOW)

    }).then(function(response){
      //gets the initial response as JSON
      return response.json();
    }).then(function(response){
      //cache the work unit
      rawServerWorkUnit = response;

      console.log(rawServerWorkUnit);
      return rawServerWorkUnit;

    }).then(function(response) {
      //solve the work unit

      //sandbox the web worker
      //eval string for sandboxing
      var sandboxEvalString = "";

      //sandboxing
      //whitelist so that we only delete evile things
      var whitelist = ["Math", "JSON", "importScripts", "console", "postMessage", "jsSHA"];

      for(var name in self) {
        if(whitelist.indexOf(name) == -1) {
          sandboxEvalString += "var " + name + " = null;";
        }
      }
      sandboxEvalString += "var XMLHttpRequest = null;";

      //sandbox
      sandboxEvalString = btoa(sandboxEvalString);
      sandboxEvalString = "data:application/json;base64," + sandboxEvalString;
      importScripts(sandboxEvalString);

      return rawServerWorkUnit;
    }).then(function(response) {
      //compute the work unit
      importScripts(workUnitManagerURL + "/js/" + rawServerWorkUnit.job_uuid);

      //cache the response
      workUnitResponse = run(rawServerWorkUnit.workunit_data);

      return workUnitResponse;
    }).then(function(response){
      //post the work unit to the main thread since fetch API doesn't exist (sandboxed)
      postMessage({
        "job_uuid" : rawServerWorkUnit.job_uuid,
        "workunit_id" : rawServerWorkUnit.workunit_id,
        "response" : workUnitResponse,
        "proof_of_work" : solvedPOW
      });

      return workUnitResponse;
    }).catch(function(error) {
      console.error(error);
      return error;
    });

  }).catch(function(error) {
    console.error(error);
    return error;
  });

};

//run everything!
startTask(workUnitManagerURLRef);
