var Triangle = function(p1, p2, p3, material) {
  var edge1 = new Vector(p2[0] - p1[0], p2[1] - p1[1], p2[2] - p1[2]);
  var edge2 = new Vector(p3[0] - p1[0], p3[1] - p1[1], p3[2] - p1[2]);
  var normVec = Vector.normalize(Vector.cross(edge1, edge2));
  var calcT = function(pStart, direction) {
    var a = p1[0] - p2[0], d = p1[0] - p3[0], g = direction.x, j = p1[0] - pStart.x,
        b = p1[1] - p2[1], e = p1[1] - p3[1], h = direction.y, k = p1[1] - pStart.y,
        c = p1[2] - p2[2], f = p1[2] - p3[2], i = direction.z, l = p1[2] - pStart.z;
    var M = a*(e*i - h*f) + b*(g*f - d*i) + c*(d*h - e*g);
    var t = - (f*(a*k - j*b) + e*(j*c - a*l) + d*(b*l - k*c))/M;
    var beta = (j*(e*i - h*f) + k*(g*f - d*i) + l*(d*h - e*g))/M;
    var gamma = (i*(a*k - j*b) + h*(j*c - a*l) + g*(b*l - k*c))/M;
    return {
      exists: beta >= 0 && beta <= 1 && gamma >= 0 & gamma <= 1 && beta + gamma <= 1,
      t: t
    };
  };
  return {
    p1: p1,
    p2: p2,
    p3: p3,
    ambient: material.ambient,
    diffuse: material.diffuse,
    specular: material.specular,
    n: 1,
    normVec: normVec,
    rayIntersect: function(ray, clipVal) {
      var isect = calcT(ray[0], ray[1]);
      if (isect.t < clipVal) isect.exists = false;
      isect.xyz = isect.exists? 
        Vector.add(ray[0], Vector.scale(isect.t, ray[1])): NaN;
      return isect;
    },
    calcNormVec: function(point) {
      return normVec;
    }
  }
}
