var RES = function() {
  var box = [
    {
      "material": {"ambient": [0.1,0,0], "diffuse": [0.9,0,0], "specular": [0,0,0], "n":17},
      "vertices": [[0,0,0],[0,1,0],[1,1,0],[1,0,0],[0,0,1],[0,1,1],[1,1,1],[1,0,1]],
      "triangles": [
        [0,4,7],[7,3,0],
      ]
    },
    {
      "material": {"ambient": [0,0,0.1], "diffuse": [0,0,0.9], "specular": [0,0,0], "n":17},
      "vertices": [[0,0,0],[0,1,0],[1,1,0],[1,0,0],[0,0,1],[0,1,1],[1,1,1],[1,0,1]],
      "triangles": [
        [4,5,6],[6,7,4],
        [5,1,2],[2,6,5]
      ]
    },
    {
      "material": {"ambient": [0,0,0.1], "diffuse": [0,0,0.9], "specular": [0,0,0], "n":17},
      "vertices": [[0,0,0],[0,1,0],[0,0,1],[0,1,1]],
      "triangles": [[0,1,3],[3,2,0]]
    },
    {
      "material": {"ambient": [0,0,0.1], "diffuse": [0,0,0.9], "specular": [0,0,0], "n":17},
      "vertices": [[1,1,0],[1,0,0],[1,1,1],[1,0,1]],
      "triangles": [[0,1,3],[3,2,0]]
    },
  ];

  var lid = {
      "material": {"ambient": [0,0,0.1], "diffuse": [0,0,0.9], "specular": [0,0,0], "n":17},
      "vertices": [[0,0,0],[0,1,0],[1,1,0],[1,0,0]],
      "triangles": [[3,0,1],[1,2,3]]
    };

  // get the JSON file from the passed URL
  var getJSONFile = function(url,descr) {
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
  }; // end get input json file

  var parseEllipsoids = function(bodies) {
    var ellipsoids = getJSONFile(CONST.INPUT_ELLIPSOIDS_URL,"ellipsoids").map(Ellipsoid);
    for (var i = 0; i < ellipsoids.length; i++)
      bodies.push(ellipsoids[i]);
  }

  var parseSpheres = function(bodies) {
    var spheres = getJSONFile(CONST.INPUT_SPHERES_URL,"spheres").map(Sphere);
    for (var i = 0; i < spheres.length; i++)
      bodies.push(spheres[i]);
  }

  var parseTriangles = function(input, bodies) {
    var count = input.triangles.length;
    var triangles = new Array(count);
    for(var i = 0; i < count; i++)
        bodies.push(Triangle(
          input.vertices[input.triangles[i][0]],
          input.vertices[input.triangles[i][1]],
          input.vertices[input.triangles[i][2]],
          input.material));
  };

  return {
    bodies: [],
    bounceBodies: [],
    // inputLights: getJSONFile(CONST.INPUT_LIGHTS_URL,"lights").map(PointLight),
    inputLights: [
      // {"x": 0.5, "y": 0.5, "z": -0.5, "ambient": [0,1,0], "diffuse": [0,1,0], "specular": [0,1,0]},
      {"x": 0.5, "y": 1, "z": 0.5, "ambient": [1,1,1], "diffuse": [1,1,1], "specular": [1,1,1]},
      // {"x": 2, "y": 4, "z": -0.5, "ambient": [1,1,1], "diffuse": [1,1,1], "specular": [1,1,1]}
    ].map(PointLight),
    getJSONFile: getJSONFile,
    loadBodies: function(bodies, bounceBodies) {
      // parseEllipsoids(bodies);
      parseSpheres(bodies);
      for (var i = 0; i < box.length; i++)
        parseTriangles(box[i], bodies);

      for (var i = 0; i < bodies.length; i++)
        bounceBodies.push(bodies[i]);
      parseTriangles(lid, bounceBodies);

      // parseTriangles(lid, bodies);
    },
  };
}();
