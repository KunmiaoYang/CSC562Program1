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
        if (occluderIsect.exists && occluderIsect.t <= 1) {
          return true;
        }
      }
      return false;
    }, // end is light occluded
  };
}();
