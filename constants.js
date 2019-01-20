/* constants and globals */
var CONST = function() {
  var renderTypes = {
          ISECT_ONLY: 1, // render white if intersect in pixel
          LIT: 2, // render lit color if intersect in pixel
          LIT_SHADOWS: 3 // render lit/shadowed color in intersect in pixel
      };
  var BRDF_TYPES = {
    DIFFUSE: 2,
    SPECULAR: 4,
  };
  return {
    WIN_Z: 0,
    WIN_LEFT: 0, WIN_RIGHT: 1,
    WIN_BOTTOM: 0, WIN_TOP: 1,
    INPUT_ELLIPSOIDS_URL:
        "https://ncsucgclass.github.io/prog1/ellipsoids.json",
    INPUT_SPHERES_URL:
      "https://ncsucg4games.github.io/prog1/spheres.json",
        //"https://pages.github.ncsu.edu/bwatson/introcg-prog1-2017/ellipsoids.json",
    INPUT_LIGHTS_URL:
      "https://ncsucg4games.github.io/prog1/lights.json",
        //"https://pages.github.ncsu.edu/bwatson/introcg-prog1-2017/lights.json",
    renderTypes: renderTypes,
    RENDER_METHOD: renderTypes.LIT_SHADOWS, // show intersections unlit in white
    Eye: new Vector(0.5,0.5,-0.5), // set the eye position
    BRDF_TYPES: BRDF_TYPES,
    BRDFType: BRDF_TYPES.DIFFUSE | BRDF_TYPES.SPECULAR,
    SAMPLE_COUNT: 10,
    ROULETTE_RATE: 0.5,
  };
}();
