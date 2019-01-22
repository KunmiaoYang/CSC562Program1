var RES = function() {
  var a = 0.4, d = 0.4, s = 0.2;
      // "material": {"ambient": [a,a,a], "diffuse": [d,d,d], "specular": [s,s,s], "n":17},
      // "material": {"ambient": [a,0,0], "diffuse": [d,0,0], "specular": [s,0,0], "n":17},
      // "material": {"ambient": [0,0,a], "diffuse": [0,0,d], "specular": [0,0,s], "n":17},
  var box = [
    {
      "material": {"ambient": [a,a,a], "diffuse": [d,d,d], "specular": [s,s,s], "n":17},
      "vertices": [[0,0,0],[0,1,0],[1,1,0],[1,0,0],[0,0,1],[0,1,1],[1,1,1],[1,0,1]],
      "triangles": [
        [0,4,7],[7,3,0],
      ]
    },
    {
      "material": {"ambient": [a,a,a], "diffuse": [d,d,d], "specular": [s,s,s], "n":17},
      "vertices": [[0,0,0],[0,1,0],[1,1,0],[1,0,0],[0,0,1],[0,1,1],[1,1,1],[1,0,1]],
      "triangles": [
        [4,5,6],[6,7,4],
        [5,1,2],[2,6,5]
      ]
    },
    {
      "material": {"ambient": [a,0,0], "diffuse": [d,0,0], "specular": [s,0,0], "n":17},
      "vertices": [[0,0,0],[0,1,0],[0,0,1],[0,1,1]],
      "triangles": [[0,1,3],[3,2,0]]
    },
    {
      "material": {"ambient": [0,0,a], "diffuse": [0,0,d], "specular": [0,0,s], "n":17},
      "vertices": [[1,1,0],[1,0,0],[1,1,1],[1,0,1]],
      "triangles": [[0,1,3],[3,2,0]]
    },
  ];

  var lid = {
    "material": {"ambient": [a,a,a], "diffuse": [d,d,d], "specular": [s,s,s], "n":17},
    "vertices": [[0,0,0],[0,1,0],[1,1,0],[1,0,0]],
    "triangles": [[3,0,1],[1,2,3]]
  };

  var marble = {
    "ambient": [0.1,0.0,0.0], "diffuse": [0.6,0.0,0.0], "specular": [0.3,0.3,0.3], "n": 3,
    "x": 0.25, "y": 0.1, "z": 0.3, "r":0.1, "alpha": 0,
  };

  var pointLights = [
    // {"x": 0.5, "y": 0.5, "z": -0.5, "ambient": [0,1,0], "diffuse": [0,1,0], "specular": [0,1,0]},
    {"x": 0.5, "y": 1.0, "z": 0.5, "ambient": [1,1,1], "diffuse": [1,1,1], "specular": [1,1,1]},
    // {"x": 2, "y": 4, "z": -0.5, "ambient": [1,1,1], "diffuse": [1,1,1], "specular": [1,1,1]}
  ];

  var ceilingSquareLights = [
    {xLim: [0.4, 0.6], zLim: [0.4, 0.6], y: 1.0, ambient: [1,1,1], diffuse: [1,1,1], specular: [1,1,1]},
  ];

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
    inputLights: [],
    getJSONFile: getJSONFile,
    loadBodies: function() {
      RES.bodies = [];
      // RES.bodies[0] = Sphere(marble);
      RES.bounceBodies = [];

      // parseEllipsoids(bodies);
      parseSpheres(RES.bodies);
      for (var i = 0; i < box.length; i++)
        parseTriangles(box[i], RES.bodies);

      // RES.bodies[0].alpha = 0;
      // RES.bodies[0].RI = 1.6;

      for (var i = 0; i < RES.bodies.length; i++)
        RES.bounceBodies.push(RES.bodies[i]);
      parseTriangles(lid, RES.bounceBodies);

      // parseTriangles(lid, bodies);
    },
    loadLights: function(input = pointLights) {
      // RES.inputLights = getJSONFile(CONST.INPUT_LIGHTS_URL,"lights").map(PointLight);
      RES.inputLights = input.map(PointLight);
    },
    loadAreaLights: function(input = ceilingSquareLights) {
      RES.inputLights = [];
      var lights = input.map(CeilingSquareLight);
      for (var i = 0, n = lights.length; i < n; i++) {
        RES.inputLights.push(lights[i]);
        RES.bodies.push(lights[i].body);
        RES.bounceBodies.push(lights[i].body);
      }
    },
  };
}();
