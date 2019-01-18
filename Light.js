var Light = function(light) {
  light.addDiffuse = function(N, L, body, c) {
    // add in the diffuse light
    var diffFactor = Math.max(0,Vector.dot(N,L));
    if (diffFactor > 0) {
      c[0] += light.diffuse[0] * body.diffuse[0] * diffFactor;
      c[1] += light.diffuse[1] * body.diffuse[1] * diffFactor;
      c[2] += light.diffuse[2] * body.diffuse[2] * diffFactor;
    } // end nonzero diffuse factor
  }

  light.addSpecular = function(N, L, V, body, c) {
    // add in the specular light
    var H = Vector.normalize(Vector.add(L,V)); // half vector
    var specFactor = Math.max(0,Vector.dot(N,H));
    if (specFactor > 0) {
      var newSpecFactor = Math.pow(specFactor, body.n);
      c[0] += light.specular[0] * body.specular[0] * newSpecFactor; // specular term
      c[1] += light.specular[1] * body.specular[1] * newSpecFactor; // specular term
      c[2] += light.specular[2] * body.specular[2] * newSpecFactor; // specular term
    }
  }

  light.BRDF = light.addDiffuse;

  return light;
}
