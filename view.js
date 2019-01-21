var VIEW = function() {
  // draw a pixel at x,y using color
  var drawPixel = function(imagedata,x,y,color) {
    if ((typeof(x) !== "number") || (typeof(y) !== "number"))
        throw "drawpixel location not a number";
    else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
        throw "drawpixel location outside of image";
    else if (color instanceof Color) {
        var pixelindex = (y*imagedata.width + x) * 4;
        imagedata.data[pixelindex] = color[0];
        imagedata.data[pixelindex+1] = color[1];
        imagedata.data[pixelindex+2] = color[2];
        imagedata.data[pixelindex+3] = color[3];
    } else
        throw "drawpixel color is not a Color";
  }; // end drawPixel

  var addColor = function(imagedata,x,y,colorMap,color) {
    if ((typeof(x) !== "number") || (typeof(y) !== "number"))
        throw "pixel location not a number";
    else if ((x<0) || (y<0) || (x>=imagedata.width) || (y>=imagedata.height))
        throw "pixel location outside of image";
    else if (color instanceof Color) {
      var pixelindex = (y*imagedata.width + x) * 4;
      for (var i = 0; i < 3; i++) {
        colorMap[x][y][i] = Math.min(1, colorMap[x][y][i] + color[i]);
        imagedata.data[pixelindex + i] = colorMap[x][y][i] * 255;
      }
    } else
        throw "drawpixel color is not a Color";
  };

  return {
    canvas: {},
    context: {},
    imagedata: {},
    colorMap: [],
    init: function(context) {
      VIEW.imagedata = context.createImageData(context.canvas.width,context.canvas.height);
    },
    // draw a pixel at x,y using color
    drawPixel: drawPixel,
    // draw random pixels
    drawRandPixels: function(context) {
        var c = new Color(0,0,0,0); // the color at the pixel: black
        var w = context.canvas.width;
        var h = context.canvas.height;
        var imagedata = context.createImageData(w,h);
        var PIXEL_DENSITY = 0.01;
        var numPixels = (w*h)*PIXEL_DENSITY;

        // Loop over 1% of the pixels in the image
        for (var x=0; x<numPixels; x++) {
            c.change(Math.random()*255,Math.random()*255,
                Math.random()*255,255); // rand color
            drawPixel(imagedata,
                Math.floor(Math.random()*w),
                Math.floor(Math.random()*h),
                    c);
        } // end for x
        context.putImageData(imagedata, 0, 0);
    }, // end draw random pixels
    // given a pixel position, calculate x and y pixel and world coords
    getPixelLocat: function(pixelNum, w, h) {
        var y = Math.floor(pixelNum/w);
        var x = pixelNum - y*w;
        var wx = CONST.WIN_LEFT + x/w * (CONST.WIN_RIGHT - CONST.WIN_LEFT);
        var wy = CONST.WIN_TOP + y/h * (CONST.WIN_BOTTOM - CONST.WIN_TOP);

        //console.log("pixelNum: "+pixelNum+", x:"+x+", y:"+y+", wx:"+wx+", wy:"+wy);

        return ({"x": x, "y": y, "wx": wx, "wy": wy});
    },
    eachPixel: function(imagedata, bodies, callback) {
      var w = imagedata.width;
      var h = imagedata.height;
      // console.log("casting rays");

      if (bodies != String.null) {
        // Loop over the pixels and ellipsoids, intersecting them
        var wx = CONST.WIN_LEFT; // init world pixel xcoord
        var wxd = (CONST.WIN_RIGHT-CONST.WIN_LEFT) * 1/(w-1); // world pixel x differential
        var wy = CONST.WIN_TOP; // init world pixel ycoord
        var wyd = (CONST.WIN_BOTTOM-CONST.WIN_TOP) * 1/(h-1); // world pixel y differential
        for (var y=0, x; y<h; y++, wy += wyd) {
            wx = CONST.WIN_LEFT; // init w
            for (x=0; x<h; x++, wx += wxd) {
              callback(imagedata,x,y,wx,wy);
            } // end for x
        } // end for y
      }
    },
    rayTracing: function(c, shader) {
      return function(imagedata,x,y,wx,wy) {
        c.change(0,0,0,255); // set pixel to background color
        var Dir = Vector.subtract(new Vector(wx,wy,CONST.WIN_Z),CONST.Eye); // set ray direction
        var closest = GEO.closestIntersect([CONST.Eye,Dir],1,-1,RES.bodies);
        if (closest.exists) shader(closest,closest.id,RES.inputLights,RES.bodies,c);
        if (!VIEW.colorMap[x]) VIEW.colorMap[x] = [];
        VIEW.colorMap[x][y] = c.clamp(1).copy();
        drawPixel(imagedata,x,y,c.scale3(255));
      };
    },
    pathTracing: function(c, shader, sample) {
      return function(imagedata,x,y,wx,wy) {
        c.change(0,0,0,255); // set pixel to background color
        var Dir = Vector.subtract(new Vector(wx,wy,CONST.WIN_Z),CONST.Eye); // set ray direction
        var closest = GEO.closestIntersect([CONST.Eye,Dir],1,-1,RES.bodies);
        if (closest.exists) {
          var N = RES.bodies[closest.id].calcNormVec(closest); // surface normal
          var L = GEO.randomDir(N);
          var isect = GEO.closestIntersect([closest.xyz, L],0,closest.id,RES.bounceBodies);
          if (isect.exists) {
            shader(isect,isect.id,RES.inputLights,RES.bounceBodies,c);
            SHADER.Lambertian(N, L, RES.bodies[closest.id], c);
          } else console.log("missing",isect);
        }
        addColor(imagedata,x,y,VIEW.colorMap,c.scale3(8/sample));
      };
    },
  };
}();
