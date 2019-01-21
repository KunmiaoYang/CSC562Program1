var Ellipsoid = function(body) {
  // Default material
  body.alpha = 1; // alpha compositing for transparent
  body.RI = 1;  // Refractive index

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
  body.rayIntersect = function(ray, clipVal) {
    var isect = calcT(ray[0], ray[1]);
    if (isect.t[0] < clipVal && isect.t[1] < clipVal) isect.exists = false;
    if (isect.exists) {
      isect.t = isect.t[0] < clipVal? isect.t[1] : isect.t[0];
      isect.xyz = Vector.add(ray[0], Vector.scale(isect.t, ray[1]));
    }
    return isect;
  }; // end rayEllipsoidIntersect

  body.calcNormVec = function(isect) {
    return Vector.normalize(new Vector(
      (isect.xyz.x - body.x)/body.a/body.a,
      (isect.xyz.y - body.y)/body.b/body.b,
      (isect.xyz.z - body.z)/body.c/body.c
    )); // surface normal
  };

  return body;
}
