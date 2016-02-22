importScripts("/static/workUnitTemplates.js");

//urls
var URLS = {
  "POWRequest" : "http://bff00d44.ngrok.io/proofofwork/get",
  "POWResponse" : "http://bff00d44.ngrok.io/proofofwork/check",
  "WURRequestURL" : "http://bff00d44.ngrok.io/workunit/get",
  "JSWURRequestURL" : "http://bff00d44.ngrok.io/js/",
  "WURResponseURL" : "http://d0a65e8c.ngrok.io/done"
};
var hackyStuff = {};

//compute
//POW Request
var powrequest = new POWRequest(URLS.POWRequest, function() {
  //POW Response
  var powresponse = new POWResponse(
    URLS.POWResponse,
    powrequest.rawData
  );

  //sandboxing the web worker
  var whitelist = ["fetch", "Math", "JSON", "console", "importScripts", "URLS", "WorkUnitRequest", "WorkUnitResponse", "hackyStuff"];
  var sandboxEvalString = "";

  (function() {

    for(var name in self) {
      if(whitelist.indexOf(name) == -1) {
        sandboxEvalString += "var " + name + " = null;";
      }
    }

    sandboxEvalString += "var XMLHttpRequest = null;";
  })();

  importScripts("data:application/javascript;base64," + btoa(sandboxEvalString));

  //Work Unit Request
  var wurrequest = new WorkUnitRequest(URLS.WURRequestURL, URLS.JSWURRequestURL, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(
      powresponse.solvedData
    )
  });


  hackyStuff.prefix = powresponse.solvedData.prefix;
  hackyStuff.mac = powresponse.solvedData.mac;
  hackyStuff.time = powresponse.solvedData.time;
  hackyStuff.suffix = powresponse.solvedData.suffix;
  hackyStuff.jobuuid = wurrequest.workUnitRawData.job_uuid;
  hackyStuff.workunit_id = wurrequest.workUnitRawData.workunit_id;
  hackyStuff.response = wurrequest.workUnitRawData.JSResponse;

  //Work Unit Response
  var wurresponse = new WorkUnitResponse(
    "http://d0a65e8c.ngrok.io/done",
    {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "job_uuid": wurrequest.workUnitRawData.job_uuid,
        "workunit_id": wurrequest.workUnitRawData.workunit_id,
        "response": wurrequest.JSResponse,
        "proof_of_work": {
          "prefix": powresponse.solvedData.prefix,
          "mac": powresponse.solvedData.mac,
          "time": powresponse.solvedData.time,
          "suffix": powresponse.solvedData.suffix
        }
      })
    }
  );

  //send it in!
  wurresponse.sendWorkUnit();
});
