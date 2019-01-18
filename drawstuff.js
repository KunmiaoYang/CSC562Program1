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

// draw a pixel at x,y using color
function drawPixel(imagedata,x,y,color) {
    try {
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
    } // end try

    catch(e) {
        console.log(e);
    }
} // end drawPixel

// draw random pixels
function drawRandPixels(context) {
    var c = new Color(0,0,0,0); // the color at the pixel: black
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    const PIXEL_DENSITY = 0.01;
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
} // end draw random pixels


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
                drawPixel(imagedata,
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
                    isect = GEO.rayEllipsoidIntersect([CONST.Eye,Dir],inputEllipsoids[e],1);
                    if (isect.exists) // there is an intersect
                        if (isect.t < closestT) { // it is the closest yet
                            closestT = isect.t; // record closest t yet
                            c = SHADER.rayTracing(isect,e,RES.inputLights,inputEllipsoids);
                        } // end if closest yet
                } // end for ellipsoids
                drawPixel(imagedata,x,y,c);
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
                            c = SHADER.rayTracing(isect,s,RES.inputLights,inputSpheres);
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

// use ray casting with bodies to get pixel colors
function rayCastBodies(context, shader) {
    var inputBodies =
      RES.getJSONFile(CONST.INPUT_SPHERES_URL,"ellipsoids").map(GEO.createEllipsoid);
    var w = context.canvas.width;
    var h = context.canvas.height;
    var imagedata = context.createImageData(w,h);
    // console.log("casting rays");
    console.log("bodies", inputBodies);

    if (inputBodies != String.null) {
        var x = 0; var y = 0; // pixel coord init
        var n = inputBodies.length; // the number of spheres
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
                    isect = inputBodies[e].rayIntersect([CONST.Eye,Dir],1);
                    if (isect.exists && // there is an intersect
                        isect.t < closestT) { // it is the closest yet
                            closestT = isect.t; // record closest t yet
                            c = shader(isect,e,RES.inputLights,inputBodies);
                        } // end if closest yet
                } // end for ellipsoids
                drawPixel(imagedata,x,y,c);
                wx += wxd;
                //console.log(""); // blank per pixel
            } // end for x
            wy += wyd;
        } // end for y
        context.putImageData(imagedata, 0, 0);
    } // end if ellipsoids found
} // end ray cast bodies

/* main -- here is where execution begins after window load */
function main() {

    // Get the canvas and context
    var canvas = document.getElementById("viewport");
    var context = canvas.getContext("2d");

    // Create the image
    //drawRandPixels(context);
      // shows how to draw pixels

    //drawRandPixelsInInputSpheres(context);
      // shows how to draw pixels and read input file

    //drawInputSpheresUsingArcs(context);
      // shows how to read input file, but not how to draw pixels

    rayCastBodies(context, SHADER.rayTracing);

    //framelessRayCastSpheres(context);
}
