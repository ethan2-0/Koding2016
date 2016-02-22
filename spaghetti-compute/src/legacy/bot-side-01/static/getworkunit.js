importScripts("/static/globals.js");

//Settings for posting POW:
var postSettings = {
  method : "post",
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },
  body : JSON.stringify(POWResponse),
  mode : "cors"
};

//Function to fetch the work unit data:
//requestURL = /workunit/get
var getLatestWorkUnit = function(requestURL) {
  return fetch(requestURL, postSettings).then(function(response) {
    console.log("response from getLatestWorkUnit in getworkunit.js");
    console.log(response);
    return JSON.parse(response);
  }).then(function(response) {

    //store the response in gotWorkUnit
    gotWorkUnit = response;
    console.log(gotWorkUnit);

    return gotWorkUnit;

  }).catch(function(error) {
    //if something dies
    console.error("you fool");
    alert("you fool: " + error);

    return error;
  });
};
