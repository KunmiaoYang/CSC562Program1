var Ellipsoid = function(body) {
  // ray ellipsoid intersection
  // if no intersect, return NaN
  // if intersect, return xyz vector and t value
  // intersects in front of clipVal don't count
  body.rayIntersect = function(ray,clipVal) {
      try {
          if (!(ray instanceof Array) || !(body instanceof Object))
              throw "RayEllipsoidIntersect: ray or ellipsoid are not formatted well";
          else if (ray.length != 2)
              throw "RayEllipsoidIntersect: badly formatted ray";
          else { // valid params
              var A = new Vector(body.a,body.b,body.c); // A as a vector
              var dDivA = Vector.divide(ray[1],A); // D/A
              var quadA = Vector.dot(dDivA,dDivA); // dot(D/A,D/A)
              var EmCdivA = Vector.divide(Vector.subtract(ray[0],new Vector(body.x,body.y,body.z)),A); // (E-C)/A
              var quadB = 2 * Vector.dot(dDivA,EmCdivA); // 2 * dot(D/A,(E-C)/A)
              var quadC = Vector.dot(EmCdivA,EmCdivA) - 1; // dot((E-C)/A,(E-C)/A) - 1
              // if (clipVal == 0) {
              //     ray[0].toConsole("ray.orig: ");
              //     ray[1].toConsole("ray.dir: ");
              //     console.log("a:"+a+" b:"+b+" c:"+c);
              // } // end debug case

              var qsolve = GEO.solveQuad(quadA,quadB,quadC);
              if (qsolve.length == 0)
                  throw "no intersection";
              else if (qsolve.length == 1) {
                  if (qsolve[0] < clipVal)
                      throw "intersection too close";
                  else {
                      var isect = Vector.add(ray[0],Vector.scale(qsolve[0],ray[1]));
                      //console.log("t: "+qsolve[0]);
                      //isect.toConsole("intersection: ");
                      return({"exists": true, "xyz": isect,"t": qsolve[0]});
                  } // one unclipped intersection
              } else if (qsolve[0] < clipVal) {
                  if (qsolve[1] < clipVal)
                      throw "intersections too close";
                  else {
                      var isect = Vector.add(ray[0],Vector.scale(qsolve[1],ray[1]));
                      //console.log("t2: "+qsolve[1]);
                      //isect.toConsole("intersection: ");
                      return({"exists": true, "xyz": isect,"t": qsolve[1]});
                  } // one intersect too close, one okay
              } else {
                  var isect = Vector.add(ray[0],Vector.scale(qsolve[0],ray[1]));
                  //console.log("t1: "+qsolve[0]);
                  //isect.toConsole("intersection: ");
                  return({"exists": true, "xyz": isect,"t": qsolve[0]});
              } // both not too close
          } // end if valid params
      } // end try

      catch(e) {
          //console.log(e);
          return({"exists": false, "xyz": NaN, "t": NaN});
      }
  } // end rayEllipsoidIntersect

  body.calcNormVec = function(isect) {
    return Vector.normalize(new Vector(
      (isect.xyz.x - body.x)/body.a/body.a,
      (isect.xyz.y - body.y)/body.b/body.b,
      (isect.xyz.z - body.z)/body.c/body.c
    )); // surface normal
  }

  return body;
}
