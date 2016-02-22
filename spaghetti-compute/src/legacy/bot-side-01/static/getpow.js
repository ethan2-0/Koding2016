//Fetch the POW Data, where request URL = /proofofwork/get
var getLatestPOW = function(requestURL) {
  return fetch(requestURL).then(function(response) {
    return JSON.parse(response);
  }).then(function(response) {
    console.log("Response for getpow.js:");
    console.log(response);
    //store the pow
    gotPOW = response;
    console.log(JSON.stringify(gotPOW));

    return gotPOW;
  }).catch(function(error) {
    //if something dies
    console.error("you fool");
    alert("you fool: " + error);

    return error;
  });
};

//Solve the POW
var solvePOW = function(POW) {
  //prepare the POW response in the format required
  POWResponse = {
    "prefix" : POW.prefix,
    "mac" : POW.mac,
    "time" : POW.time,
    "suffix" : 0
  };
  console.log(JSON.stringify(POWResponse));

  //continuously try values of suffix
  var suffix = 0;

  var sha = new jsSHA("SHA-384", "TEXT");
  sha.update(prefix.toString() + suffix.toString());
  var hash = sha.getHash("HEX");

  while(hash.indexOf("0000") !== 0) {
    console.log(hash);
    suffix ++;
    sha.update(prefix.toString() + suffix.toString());
    hash = sha.getHash("HEX");
  }

  //update the POW response once done
  POWResponse.suffix = suffix;
  console.log(JSON.stringify(POWResponse));
  return POWResponse;
};

//Chain the POW Fetch and Solve
var doChainedPOW = function(requestURL) {
  return getLatestPOW(requestURL).then(function(response) {
    //solve the pow after getting it
    var POWResponse = solvePOW(response);
    console.log(JSON.stringify(POWResponse));

    return POWResponse;
  }).catch(function(error) {
    //if something dies again
    console.error("you fool");
    alert("you fool: " + error);

    return error;
  });
};
