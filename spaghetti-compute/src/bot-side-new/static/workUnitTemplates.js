//imported scripts
importScripts("https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.0.2/sha.js");
importScripts("https://cdnjs.cloudflare.com/ajax/libs/fetch/0.11.0/fetch.min.js");

//POW Request Object
var POWRequest = function(POWRequestURL, callback) {
  var thiz = this;
  thiz.requestURL = POWRequestURL;
  console.log("Here 1");
  thiz.getPOW();
  thiz.callback = callback;
};

//Get a POW
POWRequest.prototype.getPOW = function() {
  console.log("Here 2");
  console.log("Calling callback");
  var thiz = this;
  return fetch(thiz.requestURL).then(function(response){
    return response.json();
  }).then(function(response){
    console.log("Here 3");
    console.log("Calling callback");
    thiz.rawData = response;
    console.log(thiz.rawData);
    thiz.callback();
    return thiz.rawData;
  }).catch(function(error) {
    console.error(error);
    return error;
  });
};

//POW Response Object
var POWResponse = function(POWResponseURL, dataToSolve) {
  var thiz = this;
  thiz.responseURL = POWResponseURL;
  thiz.dataToSolve = dataToSolve;
  thiz.solvedData = thiz.solveData();
};

//Solve POW Function
POWResponse.prototype.solveData = function() {
  var thiz = this;
  var suffix = 0;

  var sha = new jsSHA("SHA-384", "TEXT");
  sha.update(thiz.dataToSolve.prefix.toString() + suffix.toString());
  var hash = sha.getHash("HEX");

  while(hash.indexOf("0000") !== 0) {
    suffix ++;
    sha.update(thiz.dataToSolve.prefix.toString() + suffix.toString());
    hash = sha.getHash("HEX");
  }

  thiz.solvedData = {
    "prefix" : thiz.dataToSolve.prefix,
    "mac" : thiz.dataToSolve.mac,
    "time" : thiz.dataToSolve.time,
    "suffix" : suffix
  };
  return thiz.solvedData;
};

//Work Unit Request
var WorkUnitRequest = function(workUnitRequestURL, JSRequestURL, postOptions) {
  var thiz = this;
  thiz.requestURL = workUnitRequestURL;
  thiz.JSRequestURL = JSRequestURL;
  thiz.workUnitRawData = thiz.getWorkUnit();
  thiz.JSResponse = thiz.computeJS();
  thiz.postOptions = postOptions;
};

//Request A Work Unit From The Server
WorkUnitRequest.prototype.getWorkUnit = function() {
  var thiz = this;
  return fetch(thiz.requestURL, thiz.postOptions).then(function(response){
    return response.json();
  }).then(function(response){
    thiz.rawData = response;
<<<<<<< HEAD
=======
    thiz.workUnitRawData = response;
    hackyStuff.wuid = response["workunit_id"]
    thiz.computeJS();
>>>>>>> b54891fc0af62fa0cfda41305fd811039f81148e
    return thiz.rawData;
  }).catch(function(error) {
    console.error(error);
    return error;
  });
};

//Compute JS Associated With Work Unit
WorkUnitRequest.prototype.computeJS = function() {
  var thiz = this;
  importScripts(thiz.JSRequestURL + thiz.workUnitRawData.job_uuid);
<<<<<<< HEAD
  thiz.JSResponse = run(thiz.workUnitRawData.workunit_data);
=======
  // TODO: This is a security front-door
  var res = run(thiz.workUnitRawData.workunit_data);

  console.log("Hi steve");

  fetch("http://d0a65e8c.ngrok.io/done", {
    "method": "post",
    "headers": {
      "Accept": "application/json",
      "Content-Type": "application/json"
    },
    "body": JSON.stringify({
      "job_uuid": thiz.workUnitRawData.job_uuid,
      "workunit_id": hackyStuff.wuid,
      "response": res + "",
      "proof_of_work": {
        "prefix": hackyStuff.prefix,
        "suffix": hackyStuff.suffix,
        "time": hackyStuff.time,
        "mac": hackyStuff.mac
      }
    })
  }).then(function(response) {
    return respsonse.text();
  }).then(function(text) {
    console.log("Yay! Posted it!", text);
  })

>>>>>>> b54891fc0af62fa0cfda41305fd811039f81148e
};

//Work Unit Response
var WorkUnitResponse = function(workUnitResponseURL, postOptions) {
  var thiz = this;
  thiz.responseURL = workUnitResponseURL;
  thiz.postOptions = postOptions;
};

//Send the Stuff
WorkUnitResponse.prototype.sendWorkUnit = function() {
  var thiz = this;
  return fetch(thiz.responseURL, thiz.postOptions).catch(function(error) {
    console.error(error);
    return error;
  });
};
