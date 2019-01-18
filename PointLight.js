var PointLight = function(light) {
  light.castLight = function(isect, isectId, bodies, Lloc, c) {
    // check each other sphere to see if it occludes light
    Lloc.set(light.x,light.y,light.z);
    var L = Vector.normalize(Vector.subtract(Lloc,isect.xyz)); // light vector unnorm'd
    // L.toConsole("L: ");
    // console.log("isect: "+isect.xyz.x+", "+isect.xyz.y+", "+isect.xyz.z);

    // if light isn't occluded
    if (CONST.RENDER_METHOD == CONST.renderTypes.LIT_SHADOWS &&
        GEO.isLightOccluded(L,isect.xyz,isectId,bodies))
        return;

    // add in the diffuse light
    var N = bodies[isectId].calcNormVec(isect); // surface normal
    var diffFactor = Math.max(0,Vector.dot(N,L));
    if (diffFactor > 0) {
        c[0] += light.diffuse[0] * bodies[isectId].diffuse[0] * diffFactor;
        c[1] += light.diffuse[1] * bodies[isectId].diffuse[1] * diffFactor;
        c[2] += light.diffuse[2] * bodies[isectId].diffuse[2] * diffFactor;
    } // end nonzero diffuse factor

    // add in the specular light
    var V = Vector.normalize(Vector.subtract(CONST.Eye,isect.xyz)); // view vector
    var H = Vector.normalize(Vector.add(L,V)); // half vector
    var specFactor = Math.max(0,Vector.dot(N,H));
    if (specFactor > 0) {
        var newSpecFactor = specFactor;
        for (var e=1; e<bodies[isectId].n; e++) // mult by itself if needed
            newSpecFactor *= specFactor;
        c[0] += light.specular[0] * bodies[isectId].specular[0] * newSpecFactor; // specular term
        c[1] += light.specular[1] * bodies[isectId].specular[1] * newSpecFactor; // specular term
        c[2] += light.specular[2] * bodies[isectId].specular[2] * newSpecFactor; // specular term
    } // end nonzero specular factor
  }

  return light;
}
