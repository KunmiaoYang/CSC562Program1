var CeilingSquareLight = function(light) {
  Light(light);

  light.getLoc = function(Lloc) {
    Lloc.set(
      (light.xLim[1] - light.xLim[0])*Math.random() + light.xLim[0],
      light.y,
      (light.zLim[1] - light.zLim[0])*Math.random() + light.zLim[0]
    );
  };

  light.body = {
    isLight: true,
    rayIntersect: function(ray, clipVal) {
      var isect = {exists: false, t: NaN, xyz: NaN};
      if (ray[1].y === 0) return isect;
      isect.t = (light.y - ray[0].y)/ray[1].y;
      isect.xyz = Vector.add(ray[0], Vector.scale(isect.t, ray[1]));
      isect.exists = isect.t >= clipVal &&
        isect.xyz.x >= light.xLim[0] && isect.xyz.x <= light.xLim[1] &&
        isect.xyz.z >= light.zLim[0] && isect.xyz.z <= light.zLim[1];
      return isect;
    },
    getColor: function(c) {
      for (var i = 0; i < 3; i++)
        c[i] = light.diffuse[i];
    },
  };

  return light;
};
