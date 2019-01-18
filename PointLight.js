var PointLight = function(light) {
  // extends from base Light
  Light(light);

  light.getLoc = function(Lloc) {
    Lloc.set(light.x,light.y,light.z);
  }

  return light;
}
