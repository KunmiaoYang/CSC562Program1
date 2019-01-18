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

                    // check each other sphere to see if it occludes light
                    Lloc.set(lights[l].x,lights[l].y,lights[l].z);
                    var L = Vector.normalize(Vector.subtract(Lloc,isect.xyz)); // light vector unnorm'd
                    // L.toConsole("L: ");
                    // console.log("isect: "+isect.xyz.x+", "+isect.xyz.y+", "+isect.xyz.z);

                    // if light isn't occluded
                    var shadowed = (CONST.RENDER_METHOD == CONST.renderTypes.LIT_SHADOWS) ?
                                    GEO.isLightOccluded(L,isect.xyz,isectId,bodies) : false;
                    if (!shadowed) {
                        // console.log("no occlusion found");

                        // add in the diffuse light
                        var isectMCtr = Vector.subtract(isect.xyz,new Vector(body.x,body.y,body.z));
                        var derivCoeffs = new Vector(body.a*body.a,body.b*body.b,body.c*body.c);
                        var derivCoeffs = Vector.divide(new Vector(2,2,2),derivCoeffs);
                        var N = Vector.normalize(Vector.multiply(isectMCtr,derivCoeffs)); // surface normal
                        var diffFactor = Math.max(0,Vector.dot(N,L));
                        if (diffFactor > 0) {
                            c[0] += lights[l].diffuse[0] * body.diffuse[0] * diffFactor;
                            c[1] += lights[l].diffuse[1] * body.diffuse[1] * diffFactor;
                            c[2] += lights[l].diffuse[2] * body.diffuse[2] * diffFactor;
                        } // end nonzero diffuse factor

                        // add in the specular light
                        var V = Vector.normalize(Vector.subtract(CONST.Eye,isect.xyz)); // view vector
                        var H = Vector.normalize(Vector.add(L,V)); // half vector
                        var specFactor = Math.max(0,Vector.dot(N,H));
                        if (specFactor > 0) {
                            var newSpecFactor = specFactor;
                            for (var e=1; e<bodies[isectId].n; e++) // mult by itself if needed
                                newSpecFactor *= specFactor;
                            c[0] += lights[l].specular[0] * body.specular[0] * newSpecFactor; // specular term
                            c[1] += lights[l].specular[1] * body.specular[1] * newSpecFactor; // specular term
                            c[2] += lights[l].specular[2] * body.specular[2] * newSpecFactor; // specular term
                        } // end nonzero specular factor

                    } // end if light not occluded
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
