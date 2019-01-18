var Ellipsoid = function(body) {
  // Default material
  body.alpha = 1; // alpha compositing for transparent
  body.RI = 1;  // Refrective index

  // calculate t, given start point, end point and Ellipsoid
  var calcT = function(pStart, direction) {
      var ex = pStart.x, ey = pStart.y, ez = pStart.z;
      var dx = direction.x, dy = direction.y, dz = direction.z;
      var a = Math.pow(dx / body.a, 2) + Math.pow(dy / body.b, 2) + Math.pow(dz / body.c, 2);
      var b = 2 * (dx * (ex - body.x) / Math.pow(body.a, 2) + dy * (ey - body.y) / Math.pow(body.b, 2) + dz * (ez - body.z) / Math.pow(body.c, 2));
      var c = Math.pow((ex - body.x) / body.a, 2) + Math.pow((ey - body.y) / body.b, 2) + Math.pow((ez - body.z) / body.c, 2) - 1;
      var delta = b * b - 4 * a * c;
      // if (delta < 0) return [-1, -1];
      return {
        exists: delta >= 0,
        t: delta < 0? [-1, -1]:
          [(-b - Math.sqrt(delta)) / (2 * a), (-b + Math.sqrt(delta)) / (2 * a)],
      };
  }

  // ray ellipsoid intersection
  // if no intersect, return NaN
  // if intersect, return xyz vector and t value
  // intersects in front of clipVal don't count
  body.rayIntersectOrigin = function(ray,clipVal) {
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

  body.rayIntersect = function(ray, clipVal) {
    var isect = calcT(ray[0], ray[1]);
    if (isect.t[0] < clipVal && isect.t[1] < clipVal) isect.exists = false;
    if (isect.exists) {
      isect.t = isect.t[0] < clipVal? isect.t[1] : isect.t[0];
      isect.xyz = Vector.add(ray[0], Vector.scale(isect.t, ray[1]));
    }
    return isect;
  };

  body.calcNormVec = function(isect) {
    return Vector.normalize(new Vector(
      (isect.xyz.x - body.x)/body.a/body.a,
      (isect.xyz.y - body.y)/body.b/body.b,
      (isect.xyz.z - body.z)/body.c/body.c
    )); // surface normal
  }

  return body;
}
