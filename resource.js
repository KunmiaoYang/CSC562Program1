var RES = function() {
  return {
    // get the JSON file from the passed URL
    getJSONFile: function(url,descr) {
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
    }, // end get input json file
    // get the input ellipsoids from the standard class URL
    getInputEllipsoids: function() {
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
  };
}();
