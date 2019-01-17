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
    // ray ellipsoid intersection
    // if no intersect, return NaN
    // if intersect, return xyz vector and t value
    // intersects in front of clipVal don't count
    rayEllipsoidIntersect: function(ray,ellipsoid,clipVal) {
        try {
            if (!(ray instanceof Array) || !(ellipsoid instanceof Object))
                throw "RayEllipsoidIntersect: ray or ellipsoid are not formatted well";
            else if (ray.length != 2)
                throw "RayEllipsoidIntersect: badly formatted ray";
            else { // valid params
                var A = new Vector(ellipsoid.a,ellipsoid.b,ellipsoid.c); // A as a vector
                var dDivA = Vector.divide(ray[1],A); // D/A
                var quadA = Vector.dot(dDivA,dDivA); // dot(D/A,D/A)
                var EmCdivA = Vector.divide(Vector.subtract(ray[0],new Vector(ellipsoid.x,ellipsoid.y,ellipsoid.z)),A); // (E-C)/A
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
    }, // end raySphereIntersect
    // returns true if passed light is occluded from passed intersect/ellipsoid
    // by passed array of ellipsoids
    isLightOccluded: function(L,isectPos,isectEllipsoid,ellipsoids) {
        var e=0; // which ellipsoid
        var lightOccluded = false; // if light is occluded
        var occluderIsect = {}; // occluder intersect details
        // console.log("testing for occlusions");

        // check each ellipsoid up to intersected ellipsoid to see if it occludes
        while ((!lightOccluded) && (e<isectEllipsoid)) {
            occluderIsect = GEO.rayEllipsoidIntersect([isectPos,L],ellipsoids[e],0);
            if (!occluderIsect.exists) { // no intersection
                e++; // on to next ellipsoid
            } else if (occluderIsect.t > 1) { // light in front of intersection
                e++; // on to next sphere
            } else {
                lightOccluded = true;
                // console.log("occlusion found from ellipsoid "+isectEllipsoid+" to "+e);
            } // end if occlusion found
        } // while all ellipsoids up to one intersected by eye

        // check each ellipsoid after intersected ellipsoid to see if it occludes
        e = isectEllipsoid+1;
        while ((!lightOccluded) && (e<ellipsoids.length)) {
            occluderIsect = GEO.rayEllipsoidIntersect([isectPos,L],ellipsoids[e],0);
            // console.log("oisect: "+occluderIsect);
            if (!occluderIsect.exists) { // no intersection
                e++; // on to next ellipsoid
            } else if (occluderIsect.t > 1) { // light in front of intersection
                e++; // on to next ellipsoid
            } else {
                lightOccluded = true;
                // console.log("occlusion found from ellipsoid "+isectEllipsoid+" to "+e);
            } // end if occlusion found
        } // while all ellipsoids after one intersected by eye

        return(lightOccluded);
    }, // end is light occluded
  };
}();
