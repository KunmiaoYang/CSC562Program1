var VIEW = function() {
  return {
    // given a pixel position, calculate x and y pixel and world coords
    getPixelLocat: function(pixelNum, w, h) {
        var y = Math.floor(pixelNum/w);
        var x = pixelNum - y*w;
        var wx = CONST.WIN_LEFT + x/w * (CONST.WIN_RIGHT - CONST.WIN_LEFT);
        var wy = CONST.WIN_TOP + y/h * (CONST.WIN_BOTTOM - CONST.WIN_TOP);

        //console.log("pixelNum: "+pixelNum+", x:"+x+", y:"+y+", wx:"+wx+", wy:"+wy);

        return ({"x": x, "y": y, "wx": wx, "wy": wy});
    },
  };
}();
