var GEO = function() {
  return {
    // Solve quadratic. Return empty array if no solutions,
    // one t value if one solution, two if two solutions.
    solveQuad: function(a,b,c) {
      var discr = b*b - 4*a*c;
      // console.log("a:"+a+" b:"+b+" c:"+c);

      if (discr < 0) { // no solutions
          // console.log("no roots!");
          return([]);
      } else if (discr == 0) { // one solution
          // console.log("root: "+(-b/(2*a)));
          return([-b/(2*a)]);
      } else { // two solutions
          var denom = 0.5/a;
          var term1 = -b;
          var term2 = Math.sqrt(discr);
          var tp = denom * (term1 + term2);
          var tm = denom * (term1 - term2);
          // console.log("root1:"+tp+" root2:"+tm);
          if (tm < tp)
              return([tm,tp]);
          else
              return([tp,tm]);
      }
    }, // end solveQuad
    // returns true if passed light is occluded from passed intersect/ellipsoid
    // by passed array of bodies
    isLightOccluded: function(L,isectPos,isect,bodies) {
      for (var e = 0, occluderIsect = {}; e < bodies.length; e++) {
        if (e == isect) continue;
        occluderIsect = bodies[e].rayIntersect([isectPos,L],0);
        if (occluderIsect.exists && occluderIsect.t < 1) {
          return true;
        }
      }
      return false;
    }, // end is light occluded
    closestIntersect: function(ray, clipVal, from, bodies) {
      var closest = {
        exists: false,
        t: Number.MAX_VALUE, // no closest t for this pixel
      }
      //Dir.toConsole("Dir: ");
      for (var e=0, n = bodies.length, isect = {}; e<n; e++) {
        if (e == from) continue;
        isect = bodies[e].rayIntersect(ray, clipVal);
        if (isect.exists && isect.t > 0 &&// there is an intersect
            isect.t <= closest.t) { // it is the closest yet
          closest.t = isect.t; // record closest t yet
          closest.exists = true;
          closest.xyz = isect.xyz;
          closest.id = e;
          // c = shader(isect,e,RES.inputLights,RES.bodies);
        } // end if closest yet
      } // end for ellipsoids
      return closest;
    },
    randomDir: function(n) {
      // http://mathworld.wolfram.com/SpherePointPicking.html
      var cosPhi = 2*Math.random() - 1;
      var sinPhi = Math.sqrt(1 - cosPhi*cosPhi);
      var thi = 2*Math.PI*Math.random();
      var v = new Vector(
        sinPhi*Math.cos(thi),
        cosPhi,
        sinPhi*Math.sin(thi)
      );
      if (Vector.dot(n, v) < 0) {
        v.x = -v.x;
        v.y = -v.y;
        v.z = -v.z;
      }
      return v;
    },
    // N and V should be normalized first, check it before function call
    refracVec: function(N, V, refracIndex) {
      var cos1 = Vector.dot(N, V);
      if (1 === refracIndex || 1 === cos1 || 0 === cos1) return Vector.scale(-1, V);

      var sin2 = Math.sqrt(1 - Math.pow(cos1,2))/refracIndex;
      var cos2 = Math.sqrt(1 - Math.pow(sin2,2));
      return new Vector(
        N.x*(cos1/refracIndex-cos2)-V.x/refracIndex,
        N.y*(cos1/refracIndex-cos2)-V.y/refracIndex,
        N.z*(cos1/refracIndex-cos2)-V.z/refracIndex
      );
    },
  };
}();
