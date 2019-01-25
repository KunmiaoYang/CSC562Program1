// generate n integers in random order
// uses Fisher-Yates shuffle
function randPermutation(n) {
    var array = new Array(n);
    var bagSize = n, temp, randChoice;

    // fill the array
    for (var i=0; i<n; i++)
        array[i] = i;

    // while the bag isn't empty, pick from it
    while (bagSize !== 0) {
        randChoice = Math.floor(Math.random() * bagSize); // pick from bag
        bagSize--; // bag is less one
        temp = array[bagSize]; // remember what was at new bag slot
        array[bagSize] = array[randChoice]; // move old pick to new slot
        array[randChoice] = temp; // copy old element to old slot
    } // end while

    // for (i=0; i<n; i++)
    //    console.log(array[i]);

    return(array);
}

// ray ellipsoid intersection
// if no intersect, return NaN
// if intersect, return xyz vector and t value
// intersects in front of clipVal don't count
function rayEllipsoidIntersect(ray,ellipsoid,clipVal) {
    try {
        if (!(ray instanceof Array) || !(ellipsoid instanceof Object))
            throw "RayEllipsoidIntersect: ray or ellipsoid are not formatted well";
        else if (ray.length != 2)
            throw "RayEllipsoidIntersect: badly formatted ray";
        else { // valid params
            var A = new Vector(ellipsoid.a,ellipsoid.b,ellipsoid.c); // A as a vector
            var dDivA = Vector.divide(ray[1],A); // D/A
            var quadA = Vector.dot(dDivA,dDivA); // dot(D/A,D/A)
            var EmCdivA = Vector.divide(Vector.subtract(ray[0],new Vector(ellipsoid.x,ellipsoid.y,ellipsoid.z)),A); // (E-C)/A
            var quadB = 2 * Vector.dot(dDivA,EmCdivA); // 2 * dot(D/A,(E-C)/A)
            var quadC = Vector.dot(EmCdivA,EmCdivA) - 1; // dot((E-C)/A,(E-C)/A) - 1
            // if (clipVal == 0) {
            //     ray[0].toConsole("ray.orig: ");
            //     ray[1].toConsole("ray.dir: ");
            //     console.log("a:"+a+" b:"+b+" c:"+c);
            // } // end debug case

            var qsolve = solveQuad(quadA,quadB,quadC);
            if (qsolve.length == 0)
                throw "no intersection";
            else if (qsolve.length == 1) {
                if (qsolve[0] < clipVal)
                    throw "intersection too close";
                else {
                    var isect = Vector.add(ray[0],Vector.scale(qsolve[0],ray[1]));
                    //console.log("t: "+qsolve[0]);
                    //isect.toConsole("intersection: ");
                    return({"exists": true, "xyz": isect,"t": qsolve[0]});
                } // one unclipped intersection
            } else if (qsolve[0] < clipVal) {
                if (qsolve[1] < clipVal)
                    throw "intersections too close";
                else {
                    var isect = Vector.add(ray[0],Vector.scale(qsolve[1],ray[1]));
                    //console.log("t2: "+qsolve[1]);
                    //isect.toConsole("intersection: ");
                    return({"exists": true, "xyz": isect,"t": qsolve[1]});
                } // one intersect too close, one okay
            } else {
                var isect = Vector.add(ray[0],Vector.scale(qsolve[0],ray[1]));
                //console.log("t1: "+qsolve[0]);
                //isect.toConsole("intersection: ");
                return({"exists": true, "xyz": isect,"t": qsolve[0]});
            } // both not too close
        } // end if valid params
    } // end try

    catch(e) {
        //console.log(e);
        return({"exists": false, "xyz": NaN, "t": NaN});
    }
} // end raySphereIntersect


// put random points in the ellipsoids from the class github
function drawRandPixelsInInputEllipsoids(context) {
    var inputEllipsoids = RES.getInputEllipsoids();
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    const PIXEL_DENSITY = 0.05;
    var numCanvasPixels = (w*h)*PIXEL_DENSITY;

    if (inputEllipsoids != String.null) {
        var x = 0; var y = 0; // pixel coord init
        var cx = 0; var cy = 0; // init center x and y coord
        var ellipsoidXRadius = 0; // init ellipsoid x radius
        var ellipsoidYRadius = 0; // init ellipsoid y radius
        var numEllipsoidPixels = 0; // init num pixels in ellipsoid
        var c = new Color(0,0,0,0); // init the ellipsoid color
        var n = inputEllipsoids.length; // the number of input ellipsoids
        //console.log("number of ellipses: " + n);

        // Loop over the ellipsoids, draw rand pixels in each
        for (var e=0; e<n; e++) {
            cx = w*inputEllipsoids[e].x; // ellipsoid center x
            cy = h*inputEllipsoids[e].y; // ellipsoid center y
            ellipsoidXRadius = Math.round(w*inputEllipsoids[e].a); // x radius
            ellipsoidYRadius = Math.round(h*inputEllipsoids[e].b); // y radius
            numEllipsoidPixels = inputEllipsoids[e].a*inputEllipsoids[e].b*Math.PI; // projected ellipsoid area
            numEllipsoidPixels *= PIXEL_DENSITY * w * h; // percentage of ellipsoid area to render to pixels
            numEllipsoidPixels = Math.round(numEllipsoidPixels);
            console.log("ellipsoid x radius: "+ellipsoidXRadius);
            console.log("ellipsoid y radius: "+ellipsoidYRadius);
            console.log("num ellipsoid pixels: "+numEllipsoidPixels);
            c.change(
                inputEllipsoids[e].diffuse[0]*255,
                inputEllipsoids[e].diffuse[1]*255,
                inputEllipsoids[e].diffuse[2]*255,
                255); // ellipsoid diffuse color
            for (var p=0; p<numEllipsoidPixels; p++) {
                do {
                    x = Math.random()*2 - 1; // in unit square
                    y = Math.random()*2 - 1; // in unit square
                } while (Math.sqrt(x*x + y*y) > 1) // a circle is also an ellipse
                VIEW.drawPixel(imagedata,
                    cx+Math.round(x*ellipsoidXRadius),
                    cy+Math.round(y*ellipsoidYRadius),c);
                //console.log("color: ("+c.r+","+c.g+","+c.b+")");
                //console.log("x: "+Math.round(w*inputEllipsoids[e].x));
                //console.log("y: "+Math.round(h*inputEllipsoids[e].y));
            } // end for pixels in ellipsoid
        } // end for ellipsoids
        context.putImageData(imagedata, 0, 0);
    } // end if ellipsoids found
} // end draw rand pixels in input ellipsoids

// draw 2d projections read from the JSON file at class github
function drawInputEllipsoidsUsingArcs(context) {
    var inputEllipsoids = RES.getInputEllipsoids();


    if (inputEllipsoids != String.null) {
        var c = new Color(0,0,0,0); // the color at the pixel: black
        var w = context.canvas.width;
        var h = context.canvas.height;
        var n = inputEllipsoids.length;
        //console.log("number of ellipsoids: " + n);

        // Loop over the ellipsoids, draw each in 2d
        for (var e=0; e<n; e++) {
            context.fillStyle =
                "rgb(" + Math.floor(inputEllipsoids[e].diffuse[0]*255)
                +","+ Math.floor(inputEllipsoids[e].diffuse[1]*255)
                +","+ Math.floor(inputEllipsoids[e].diffuse[2]*255) +")"; // diffuse color
            context.save(); // remember previous (non-) scale
            context.translate(w*inputEllipsoids[e].x,h*inputEllipsoids[e].y); // translate ellipsoid to ctr
            context.scale(1, inputEllipsoids[e].b/inputEllipsoids[e].a); // scale by ellipsoid ratio
            context.beginPath();
            context.arc(0,0,Math.round(w*inputEllipsoids[e].a),0,2*Math.PI);
            context.restore(); // undo scale before fill so stroke width unscaled
            context.fill();
            //console.log(context.fillStyle);
            //console.log("x: "+Math.round(w*inputEllipsoids[e].x));
            //console.log("y: "+Math.round(h*inputEllipsoids[e].y));
            //console.log("a: "+Math.round(w*inputEllipsoids[e].a));
            //console.log("b: "+Math.round(h*inputEllipsoids[e].b));
        } // end for ellipsoids
    } // end if ellipsoids found
} // end draw input ellipsoids

// use ray casting with ellipsoids to get pixel colors
function rayCastEllipsoids(context) {
    var inputEllipsoids = RES.getJSONFile(CONST.INPUT_SPHERES_URL,"ellipsoids");
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    // console.log("casting rays");

    if (inputEllipsoids != String.null) {
        var x = 0; var y = 0; // pixel coord init
        var n = inputEllipsoids.length; // the number of spheres
        var Dir = new Vector(0,0,0); // init the ray direction
        var closestT = Number.MAX_VALUE; // init the closest t value
        var c = new Color(0,0,0,0); // init the pixel color
        var isect = {}; // init the intersection
        //console.log("number of ellipsoids: " + n);

        // Loop over the pixels and ellipsoids, intersecting them
        var wx = CONST.WIN_LEFT; // init world pixel xcoord
        var wxd = (CONST.WIN_RIGHT-CONST.WIN_LEFT) * 1/(w-1); // world pixel x differential
        var wy = CONST.WIN_TOP; // init world pixel ycoord
        var wyd = (CONST.WIN_BOTTOM-CONST.WIN_TOP) * 1/(h-1); // world pixel y differential
        for (y=0; y<h; y++) {
            wx = CONST.WIN_LEFT; // init w
            for (x=0; x<h; x++) {
                closestT = Number.MAX_VALUE; // no closest t for this pixel
                c.change(0,0,0,255); // set pixel to background color
                Dir.copy(Vector.subtract(new Vector(wx,wy,CONST.WIN_Z),CONST.Eye)); // set ray direction
                //Dir.toConsole("Dir: ");
                for (var e=0; e<n; e++) {
                // for (var e=0; e<1; e++) {
                    isect = rayEllipsoidIntersect([CONST.Eye,Dir],inputEllipsoids[e],1);
                    if (isect.exists) // there is an intersect
                        if (isect.t < closestT) { // it is the closest yet
                            closestT = isect.t; // record closest t yet
                            SHADER.rayTracing(isect,e,RES.inputLights,inputEllipsoids,c);
                        } // end if closest yet
                } // end for ellipsoids
                VIEW.drawPixel(imagedata,x,y,c);
                wx += wxd;
                //console.log(""); // blank per pixel
            } // end for x
            wy += wyd;
        } // end for y
        context.putImageData(imagedata, 0, 0);
    } // end if ellipsoids found
} // end ray cast ellipsoids

// use frameless ray casting with spheres to get pixel colors
function framelessRayCastSpheres(context) {
    var inputSpheres = RES.getJSONFile(CONST.INPUT_SPHERES_URL,"spheres");

    if ((inputSpheres != String.null) && (RES.inputLights != String.null)) {
        var n = inputSpheres.length; // the number of spheres
        var w = context.canvas.width;
        var h = context.canvas.height;
        var numPixels = w*h;
        var pixelOrder = randPermutation(numPixels); // rand order for visiting pixels
        var imagedata = context.createImageData(1,1); //  just one pixel at a time
        imagedata.data[3] = 255; // pixels are always opaque
        var intervalID = 0; // the ID returned by the last setInterval call
        var p = 0; // start at first rand pixel
        //console.log("num pixels: "+numPixels);
        //console.log("number of spheres: " + n);

        // update a frame with the next set of random rays
        function framelessUpdate() {
            var endTime = performance.now() + 0.9;
            var pixelLocat; // where the pixel is located on the screen
            var Dir = new Vector(0,0,0); // init the ray direction
            var closestT = Number.MAX_VALUE; // init the closest t value
            var isect = {}; // init the intersection
            var c = new Color(0,0,0,255); // declare the pixel color

            // Loop over the pixels and spheres, intersecting them
            while (performance.now() < endTime) {
                closestT = Number.MAX_VALUE; // no closest t for this pixel
                c.change(0,0,0,255); // set pixel to background color
                pixelLocat = VIEW.getPixelLocat(pixelOrder[p],w,h); // get pixel location
                Dir.copy(Vector.subtract(new Vector(pixelLocat.wx,pixelLocat.wy,CONST.WIN_Z),CONST.Eye)); // set ray direction
                //Dir.toConsole("Dir: ");
                for (var s=0; s<n; s++) { // for each sphere
                    // for (var s=0; s<1; s++) {
                    isect = raySphereIntersect([CONST.Eye,Dir],inputSpheres[s],1);
                    if (isect.exists) // there is an intersect
                        if (isect.t < closestT) { // it is the closest yet
                            closestT = isect.t; // record closest t yet
                            SHADER.rayTracing(isect,s,RES.inputLights,inputSpheres,c);
                        } // end if closest yet
                } // end for spheres
                imagedata.data[0] = c[0];
                imagedata.data[1] = c[1];
                imagedata.data[2] = c[2];
                context.putImageData(imagedata,pixelLocat.x,pixelLocat.y);
                p++; // next pixel
                if (p >= numPixels) { // back to first pixel if finished
                    p = 0;
                    //console.log("restart rand pixel order: p=0");
                } // end if reached max pixels
            } // end while in frame
        } // end frameless update

        // update the current frame using frameless updates
        function frameUpdate() {

                // if frameless update is in progress, interrupt it.
            if (intervalID != 0) // an update is in progress
                window.clearInterval(intervalID);

                // now the end of frame is over, do
            window.setInterval(framelessUpdate,1);
            window.requestAnimationFrame(frameUpdate);
        } // end frameUpdate

        window.requestAnimationFrame(frameUpdate);
    } // end if spheres found
} // end frameless ray cast spheres

var rayTracing = function() {
  // Load resource
  RES.loadBodies();
  switch (CONST.LIGHTS) {
    case CONST.LIGHTS_MODEL.URL:
      RES.loadLights(RES.getJSONFile(CONST.INPUT_LIGHTS_URL,"lights"));
      break;
    case CONST.LIGHTS_MODEL.SINGLE_POINT:
      RES.loadSingleLight();
      break;
    case CONST.LIGHTS_MODEL.DUAL_POINT:
      RES.loadLights();
      break;
    default:
      RES.loadSingleLight();
  }
  RES.loadBounceBodies();

  // Get the canvas and context
  VIEW.canvas = document.getElementById("viewport");
  VIEW.context = VIEW.canvas.getContext("2d");

  VIEW.init(VIEW.context);
  VIEW.eachPixel(VIEW.imagedata, RES.bodies,
    VIEW.rayTracing(new Color(0,0,0,0), SHADER.rayTracing));
  VIEW.context.putImageData(VIEW.imagedata, 0, 0);
};

var inter;
var addBRDF = function(context, shader, sample) {
  var i = 1, total = sample + VIEW.sample;
  var addSample = function() {
    VIEW.eachPixel(VIEW.imagedata, RES.bodies,
                   VIEW.pathTracing(new Color(0,0,0,0), shader, ++VIEW.sample));
    VIEW.context.putImageData(VIEW.imagedata, 0, 0);
    console.log("Sample: ", VIEW.sample, "/", total);
    if (++i > sample) {
      clearInterval(inter);
      alert("Sampling complete!")
    }
  };
  inter = setInterval(addSample, 100);
};
var stop = function() {
  inter = clearInterval(inter);
}

var addSample = function(sample=5) {
  addBRDF(VIEW.context, SHADER.getShader(CONST.PATH_TRACING_SHADER), sample);
};

var pathTracing = function() {
  // Load resource
  RES.loadBodies();
  switch (CONST.LIGHTS) {
    case CONST.LIGHTS_MODEL.URL:
      RES.loadLights(RES.getJSONFile(CONST.INPUT_LIGHTS_URL,"lights"));
      break;
    case CONST.LIGHTS_MODEL.SINGLE_POINT:
      RES.loadSingleLight();
      break;
    case CONST.LIGHTS_MODEL.DUAL_POINT:
      RES.loadLights();
      break;
    case CONST.LIGHTS_MODEL.AREA:
      RES.loadAreaLights();
      break;
    default:
      RES.loadSingleLight();
  }
  RES.loadBounceBodies();

  // Get the canvas and context
  VIEW.canvas = document.getElementById("viewport");
  VIEW.context = VIEW.canvas.getContext("2d");

  VIEW.init(VIEW.context);
  VIEW.eachPixel(VIEW.imagedata, RES.bodies, VIEW.initColorMap);
  VIEW.sample = 0;
  addSample(CONST.SAMPLE_COUNT);
};

/* main -- here is where execution begins after window load */
function main() {
  rayTracing();
}
