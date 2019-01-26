var UI = function() {
  var updateParameter = function() {
    CONST.LIGHTS = parseInt($('input.lights:checked').prop('value'));
    CONST.TRANSPARENT = ($('input.transparent:checked').length > 0);
    CONST.INPUT_LIGHTS_URL = $('input#lightUrl').prop('value');
    CONST.INPUT_SPHERES_URL = $('input#sphereUrl').prop('value');
    CONST.SAMPLE_COUNT = parseInt($('input#sample').prop('value'));
    RES.transparentSphere.x = parseFloat($('#x').prop('value'));
    RES.transparentSphere.y = parseFloat($('#y').prop('value'));
    RES.transparentSphere.z = parseFloat($('#z').prop('value'));
    RES.transparentSphere.r = parseFloat($('#r').prop('value'));
  };
  return {
    init: function() {
      $('#lightsModel' + CONST.LIGHTS).prop('checked', 'true');
      $('#lightUrl').prop('value', CONST.INPUT_LIGHTS_URL);
      $('#sphereUrl').prop('value', CONST.INPUT_SPHERES_URL);
      $('#x').prop('value', RES.transparentSphere.x);
      $('#y').prop('value', RES.transparentSphere.y);
      $('#z').prop('value', RES.transparentSphere.z);
      $('#r').prop('value', RES.transparentSphere.r);
      if (CONST.TRANSPARENT) {
        $('#transparent').prop('checked', 'true');
        $('.transSphParam').show();
      } else {
        $('.transSphParam').hide();
      }
    },
    updateParameter: updateParameter,
    handleAddSample: function() {
      CONST.SAMPLE_COUNT = parseInt($('input#sample').prop('value'));
      addSample(CONST.SAMPLE_COUNT);
    },
    handleRayTracing: function() {
      updateParameter();
      rayTracing();
    },
    handlePathTracing: function() {
      updateParameter();
      pathTracing();
    },
    updateSample: function(cur, total) {
      $('#curSample').text('Sample: ' + cur + '/' + total);
    },
    enableButton: function() {
      if (CONST.task === 1)
        $('button#addSample').prop('disabled', false);
      $('button#rayTracing').prop('disabled', false);
      $('button#pathTracing').prop('disabled', false);
    },
    disableButton: function() {
      $('button#addSample').prop('disabled', true);
      $('button#rayTracing').prop('disabled', true);
      $('button#pathTracing').prop('disabled', true);
    },
  }
}();
