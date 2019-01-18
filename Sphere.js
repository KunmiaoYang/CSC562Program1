var Sphere = function(body) {
  // Default material
  body.alpha = 1; // alpha compositing for transparent
  body.RI = 1;  // Refrective index

  // calculate t, given start point, end point and Ellipsoid
  var calcT = function(pStart, direction) {
      var ex = pStart.x, ey = pStart.y, ez = pStart.z;
      var dx = direction.x, dy = direction.y, dz = direction.z;
      var a = Math.pow(dx, 2) + Math.pow(dy, 2) + Math.pow(dz, 2);
      var b = 2 * (dx * (ex - body.x) + dy * (ey - body.y) + dz * (ez - body.z));
      var c = Math.pow((ex - body.x), 2) + Math.pow((ey - body.y), 2) + Math.pow((ez - body.z), 2) - Math.pow(body.r, 2);
      var delta = b * b - 4 * a * c;
      // if (delta < 0) return [-1, -1];
      return {
        exists: delta >= 0,
        t: delta < 0? [-1, -1]:
          [(-b - Math.sqrt(delta)) / (2 * a), (-b + Math.sqrt(delta)) / (2 * a)],
      };
  };

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
      isect.xyz.x - body.x,
      isect.xyz.y - body.y,
      isect.xyz.z - body.z
    )); // surface normal
  };

  return body;
}
