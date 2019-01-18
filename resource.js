var RES = function() {
  // get the JSON file from the passed URL
  function getJSONFile(url,descr) {
      try {
          if ((typeof(url) !== "string") || (typeof(descr) !== "string"))
              throw "getJSONFile: parameter not a string";
          else {
              var httpReq = new XMLHttpRequest(); // a new http request
              httpReq.open("GET",url,false); // init the request
              httpReq.send(null); // send the request
              var startTime = Date.now();
              while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
                  if ((Date.now()-startTime) > 3000)
                      break;
              } // until its loaded or we time out after three seconds
              if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
                  throw "Unable to open "+descr+" file!";
              else
                  return JSON.parse(httpReq.response);
          } // end if good params
      } // end try

      catch(e) {
          console.log(e);
          return(String.null);
      }
  } // end get input json file
  return {
    getJSONFile: getJSONFile,
    // get the input ellipsoids from the standard class URL
    getInputEllipsoids: function() {
      // TODO: delete test ellipsoids
      return [
        {"x": 0.5, "y": 0.5, "z": 0.5, "a":0.2, "b":0.3, "c":0.1, "ambient": [0.1,0.1,0.1], "diffuse": [0.6,0.6,0.0], "specular": [0.3,0.3,0.3], "n":9},
        {"x": 0.75, "y": 0.75, "z": 0.5, "a":0.2, "b":0.15, "c":0.1, "ambient": [0.1,0.1,0.1], "diffuse": [0.0,0.0,0.6], "specular": [0.3,0.3,0.3], "n":5},
        {"x": 0.75, "y": 0.25, "z": 0.5, "a":0.15, "b":0.2, "c":0.1, "ambient": [0.1,0.1,0.1], "diffuse": [0.6,0.0,0.6], "specular": [0.3,0.3,0.3], "n":7},
      ];
        // load the ellipsoids file
        var httpReq = new XMLHttpRequest(); // a new http request
        httpReq.open("GET",CONST.INPUT_ELLIPSOIDS_URL,false); // init the request
        httpReq.send(null); // send the request
        var startTime = Date.now();
        while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
            if ((Date.now()-startTime) > 3000)
                break;
        } // until its loaded or we time out after three seconds
        if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
            console.log*("Unable to open input ellipses file!");
            return String.null;
        } else
            return JSON.parse(httpReq.response);
    }, // end get input ellipsoids
    // inputLights: getJSONFile(CONST.INPUT_LIGHTS_URL,"lights").map(PointLight),
    inputLights: [
      // {"x": 2, "y": 2, "z": 0.5, "ambient": [1,1,1], "diffuse": [1,1,1], "specular": [1,1,1]}
      {"x": 2, "y": 2, "z": -0.5, "ambient": [1,1,1], "diffuse": [1,1,1], "specular": [1,1,1]}
      // {"x": 2, "y": 4, "z": -0.5, "ambient": [1,1,1], "diffuse": [1,1,1], "specular": [1,1,1]}
    ].map(PointLight),
  };
}();
