var SHADER = function() {
  return {
    // color the passed intersection and body
    rayTracing: function(eye, isect,isectId,lights,bodies,c) {
      if (   !(isect instanceof Object) || !(typeof(isectId) === "number")
          || !(lights instanceof Array) || !(bodies instanceof Array))
          throw "shadeIsect: bad parameter passed";
      else if (CONST.RENDER_METHOD == CONST.renderTypes.ISECT_ONLY) {
          var r = bodies[isectId].diffuse[0];
          var g = bodies[isectId].diffuse[1];
          var b = bodies[isectId].diffuse[2];
          c.change(255*r,255*g,255*b,255);
          return;
      } else if (!CONST.REFRACTION || bodies[isectId].alpha === 1) { // if not just rendering intersects
          var body = bodies[isectId]; // ellipsoid intersected by eye
          // console.log("shading pixel");

          // add light for each source
          var Lloc = new Vector(0,0,0);
          for (var l=0; l<lights.length; l++) {

              // add in the ambient light
              c[0] += lights[l].ambient[0] * body.ambient[0]; // ambient term r
              c[1] += lights[l].ambient[1] * body.ambient[1]; // ambient term g
              c[2] += lights[l].ambient[2] * body.ambient[2]; // ambient term b

              // check each other sphere to see if it occludes light
              lights[l].getLoc(Lloc);
              var L = Vector.subtract(Lloc,isect.xyz); // light vector
              // L.toConsole("L: ");
              // console.log("isect: "+isect.xyz.x+", "+isect.xyz.y+", "+isect.xyz.z);

              // if light isn't occluded
              var shadowed = (CONST.RENDER_METHOD == CONST.renderTypes.LIT_SHADOWS) ?
                              GEO.isLightOccluded(L,isect.xyz,isectId,bodies) : false;
              if (!shadowed) {
                L = Vector.normalize(L); // light vector unnorm'd
                  // console.log("no occlusion found");

                  // add in the diffuse light
                  var N = body.calcNormVec(isect); // surface normal
                  lights[l].addDiffuse(N, L, body, c);

                  // add in the specular light
                  var V = Vector.normalize(Vector.subtract(eye,isect.xyz)); // view vector
                  lights[l].addSpecular(N, L, V, body, c);
              } // end if light not occluded
          } // end for lights
          c.scale3(1/lights.length);

          return;
      } else {
        var N = bodies[isectId].calcNormVec(isect); // surface normal
        var V = Vector.normalize(Vector.subtract(eye,isect.xyz)); // view vector
        var refIsect = bodies[isectId].refracVec(N, V, isect);
        var closest = GEO.closestIntersect([refIsect.xyz, refIsect.L], 0, isectId, bodies);
        if (closest.exists)
          SHADER.rayTracing(refIsect.xyz, closest, closest.id, lights, bodies, c);
        c = c;
      } // if not just rendering isect
    },

    pathTracing: function(eye, isect,isectId,lights,bodies,c) {
      if (   !(isect instanceof Object) || !(typeof(isectId) === "number")
          || !(lights instanceof Array) || !(bodies instanceof Array))
          throw "shadeIsect: bad parameter passed";
      else if (bodies[isectId].isLight) {
        bodies[isectId].getColor(c);
      } else if (!CONST.REFRACTION || bodies[isectId].alpha === 1) {
        // add light for each source
        var Lloc = new Vector(0,0,0);
        for (var l=0; l<lights.length; l++) {
          // check each other sphere to see if it occludes light
          lights[l].getLoc(Lloc);
          var L = Vector.subtract(Lloc,isect.xyz); // light vector

          // if light isn't occluded
          if (!GEO.isLightOccluded(L,isect.xyz,isectId,bodies)) {
            var N = bodies[isectId].calcNormVec(isect); // surface normal
            // add in the diffuse light
            if (CONST.BRDFType & CONST.BRDF_TYPES.DIFFUSE)
              lights[l].addDiffuse(N, Vector.normalize(L), bodies[isectId], c);
            // add in the specular light
            if (CONST.BRDFType & CONST.BRDF_TYPES.SPECULAR) {
              var V = Vector.normalize(Vector.subtract(eye,isect.xyz)); // view vector
              lights[l].addSpecular(N, L, V, bodies[isectId], c);
            }
          } // end if light not occluded
        } // end for lights
        c.scale3(1/lights.length);
        // if (isectId > 14) console.log("lid color", c);
      } else {
        var N = bodies[isectId].calcNormVec(isect); // surface normal
        var V = Vector.normalize(Vector.subtract(eye,isect.xyz)); // view vector
        var refIsect = bodies[isectId].refracVec(N, V, isect);
        var closest = GEO.closestIntersect([refIsect.xyz, refIsect.L], 0, isectId, bodies);
        if (closest.exists)
          SHADER.pathTracing(refIsect.xyz, closest, closest.id, lights, bodies, c);
      }
    },

    // N and L should be normalized
    BlinnPhong: function(N, L, eye, isect, body, c) {
      var BRDFDiffuse = 0, BRDFSpecular = 0;
      if (CONST.BRDFType & CONST.BRDF_TYPES.DIFFUSE) {
        BRDFDiffuse = Math.max(0, Vector.dot(L, N));
      }
      if (CONST.BRDFType & CONST.BRDF_TYPES.SPECULAR) {
        var V = Vector.normalize(Vector.subtract(eye,isect.xyz)); // view vector
        var H = Vector.normalize(Vector.add(L,V)); // half vector
        BRDFSpecular = Math.pow(Math.max(0,Vector.dot(N,H)), body.n);
      }
      if (isNaN(BRDFDiffuse) || isNaN(BRDFSpecular)) {
        console.log("NaN:", isect);
      }
      for (var i = 0; i < 3; i++)
        c[i] *= (BRDFDiffuse*body.diffuse[i] + BRDFSpecular*body.specular[i]);
    },

    roulette: function(shader) {
      var recur = function(eye, closest, id, lights, bodies, c) {
        if (!closest.exists) return;

        var rand = Math.random();
        if (!bodies[id].isLight && rand < CONST.ROULETTE_RATE) { // Stop
          var N = bodies[closest.id].calcNormVec(closest); // surface normal
          if (CONST.REFRACTION && bodies[id].alpha < 1) {
            var V = Vector.normalize(Vector.subtract(eye,closest.xyz)); // view vector
            var refIsect = bodies[id].refracVec(N, V, closest);
            closest = GEO.closestIntersect([refIsect.xyz, refIsect.L], 0, id, bodies);
          }
          if (closest.exists && !bodies[closest.id].isLight) {
            var L = GEO.randomDir(N);
            var isect = GEO.closestIntersect([closest.xyz, L],0,closest.id,bodies);
            recur(closest.xyz, isect, isect.id, lights, bodies, c);
            SHADER.BlinnPhong(N, L, eye, closest, bodies[closest.id], c);
          }
        }

        if (closest.exists) shader(eye, closest,closest.id,lights,bodies,c);
      };
      return recur;
    },

    getShader: function(shaderIndex) {
      switch (shaderIndex) {
        case CONST.SHADER_TYPES.RAY_TRACING: return SHADER.rayTracing;
        case CONST.SHADER_TYPES.PATH_TRACING: return SHADER.pathTracing;
        case CONST.SHADER_TYPES.ROULETTE: return SHADER.roulette(SHADER.pathTracing);
        default: return SHADER.pathTracing;
      }
    }
  };
}();
