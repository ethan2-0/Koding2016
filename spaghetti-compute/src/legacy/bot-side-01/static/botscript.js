importScripts("/static/utils.js");
importScripts("/static/globals.js")

var workunitURL = fetch("http://ueks277167ba.ethan2-0.koding.io:5000/config/workunitURL");

//calling utils
doProcess(workunitURL + "proofofwork/get", workunitURL + "workunit/get", workunitURL + "js/");

//eval string for sandboxing
var sandboxEvalString = "";

//sandboxing
(function() {
  //whitelist so that we only delete evile things
  var whitelist = ["Math", "JSON", "importScripts", "console", "gotScriptURL", "gotWorkUnit"];

  for(var name in self) {
    if(whitelist.indexOf(name) == -1) {
      sandboxEvalString += "var " + name + " = null;";
    }
  }

  sandboxEvalString += "var XMLHttpRequest = null;";
})();

//evaluate the sandbox
eval(sandboxEvalString);

//
(function() {
  //save fetch
  var Fetch = fetch;

  //saving import scripts so that we can run the JS file
  var ImportScripts = importScripts;

  //running sha from data URL
  ImportScripts("https://cdnjs.cloudflare.com/ajax/libs/jsSHA/2.0.2/sha.js");

  //running fetch from data URL
  ImportScripts("data:application/javascript,var%20fetch%20%3D%20null");

  //running script from data URL
  ImportScripts("data:application/javascript,var%20importScripts%20%3D%20null");

  //running script
  console.log("gotScriptURL in botscript")
  console.log(gotScriptURL)
  console.log("gotWorkUnit in botscript");
  console.log(gotWorkUnit.job_uuid)
  ImportScripts(gotScriptURL + gotWorkUnit.job_uuid);

  var result = run(gotWorkUnit.data);

  //return result
  Fetch("/done", {
    method : "post",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body : {

      //response to the server
      "job_uuid" : gotWorkUnit.job_uuid,
      "workunit_id" : gotWorkUnit.workunit_id,
      "response" : result,
      "proof_of_work" : {
        "prefix" : POWResponse.prefix,
        "mac" : POWResponse.mac,
        "suffix" : POWResponse.suffix
      }
    }
  });

})();
