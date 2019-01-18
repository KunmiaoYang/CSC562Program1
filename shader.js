var SHADER = function() {
  return {
    // color the passed intersection and body
    rayTracing: function(isect,isectId,lights,bodies) {
        try {
            if (   !(isect instanceof Object) || !(typeof(isectId) === "number")
                || !(lights instanceof Array) || !(bodies instanceof Array))
                throw "shadeIsect: bad parameter passed";
            else if (CONST.RENDER_METHOD == CONST.renderTypes.ISECT_ONLY) {
                var r = bodies[isectId].diffuse[0];
                var g = bodies[isectId].diffuse[1];
                var b = bodies[isectId].diffuse[2];
                return(new Color(255*r,255*g,255*b,255));
            } else { // if not just rendering intersects
                var c = new Color(0,0,0,255); // init the ellipsoid color to black
                var body = bodies[isectId]; // ellipsoid intersected by eye
                // console.log("shading pixel");

                // add light for each source
                var lightOccluded = false; // if an occluder is found
                var Lloc = new Vector(0,0,0);
                for (var l=0; l<lights.length; l++) {

                    // add in the ambient light
                    c[0] += lights[l].ambient[0] * body.ambient[0]; // ambient term r
                    c[1] += lights[l].ambient[1] * body.ambient[1]; // ambient term g
                    c[2] += lights[l].ambient[2] * body.ambient[2]; // ambient term b

                    lights[l].castLight(isect, isectId, bodies, Lloc, c);
                } // end for lights

                c[0] = 255 * Math.min(1,c[0]); // clamp max value to 1
                c[1] = 255 * Math.min(1,c[1]); // clamp max value to 1
                c[2] = 255 * Math.min(1,c[2]); // clamp max value to 1

                return(c);
            } // if not just rendering isect
        } // end throw

        catch(e) {
            console.log(e);
            return(Object.null);
        }
    },
  };
}();
