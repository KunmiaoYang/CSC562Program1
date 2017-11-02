/* classes */ 

// Color class
class Color {
    constructor(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this[0] = r; this[1] = g; this[2] = b; this[3] = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color constructor

        // Color change method
    change(r,g,b,a) {
        try {
            if ((typeof(r) !== "number") || (typeof(g) !== "number") || (typeof(b) !== "number") || (typeof(a) !== "number"))
                throw "color component not a number";
            else if ((r<0) || (g<0) || (b<0) || (a<0)) 
                throw "color component less than 0";
            else if ((r>255) || (g>255) || (b>255) || (a>255)) 
                throw "color component bigger than 255";
            else {
                this[0] = r; this[1] = g; this[2] = b; this[3] = a; 
            }
        } // end try
        
        catch (e) {
            console.log(e);
        }
    } // end Color change method
} // end color class

// Vector class
class Vector { 
    constructor(x,y,z) {
        this.set(x,y,z);
    } // end constructor
    
    // sets the components of a vector
    set(x,y,z) {
        try {
            if ((typeof(x) !== "number") || (typeof(y) !== "number") || (typeof(z) !== "number"))
                throw "vector component not a number";
            else
                this.x = x; this.y = y; this.z = z; 
        } // end try
        
        catch(e) {
            console.log(e);
        }
    } // end vector set
    
    // copy the passed vector into this one
    copy(v) {
        try {
            if (!(v instanceof Vector))
                throw "Vector.copy: non-vector parameter";
            else
                this.x = v.x; this.y = v.y; this.z = v.z;
        } // end try
        
        catch(e) {
            console.log(e);
        }
    }
    
    toConsole(prefix) {
        console.log(prefix+"["+this.x+","+this.y+","+this.z+"]");
    } // end to console
    
    // static dot method
    static dot(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.dot: non-vector parameter";
            else
                return(v1.x*v2.x + v1.y*v2.y + v1.z*v2.z);
        } // end try
        
        catch(e) {
            console.log(e);
            return(NaN);
        }
    } // end dot static method
    
    // static add method
    static add(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.add: non-vector parameter";
            else
                return(new Vector(v1.x+v2.x,v1.y+v2.y,v1.z+v2.z));
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end add static method

    // static subtract method, v1-v2
    static subtract(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.subtract: non-vector parameter";
            else {
                var v = new Vector(v1.x-v2.x,v1.y-v2.y,v1.z-v2.z);
                //v.toConsole("Vector.subtract: ");
                return(v);
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end subtract static method

    // static divide method, v1.x/v2.x etc
    static divide(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.divide: non-vector parameter";
            else {
                var v = new Vector(v1.x/v2.x,v1.y/v2.y,v1.z/v2.z);
                //v.toConsole("Vector.divide: ");
                return(v);
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end divide static method

    // static divide method, v1.x/v2.x etc
    static multiply(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.multiply: non-vector parameter";
            else {
                var v = new Vector(v1.x*v2.x,v1.y*v2.y,v1.z*v2.z);
                //v.toConsole("Vector.divide: ");
                return(v);
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end multiply static method

    // static scale method
    static scale(c,v) {
        try {
            if (!(typeof(c) === "number") || !(v instanceof Vector))
                throw "Vector.scale: malformed parameter";
            else
                return(new Vector(c*v.x,c*v.y,c*v.z));
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end scale static method
    
    // static normalize method
    static normalize(v) {
        try {
            if (!(v instanceof Vector))
                throw "Vector.normalize: parameter not a vector";
            else {
                var lenDenom = 1/Math.sqrt(Vector.dot(v,v));
                return(Vector.scale(lenDenom,v));
            }
        } // end try
        
        catch(e) {
            console.log(e);
            return(new Vector(NaN,NaN,NaN));
        }
    } // end scale static method
    
} // end Vector class


/* utility functions */

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

// get the JSON file from the passed URL
function getJSONFile(url,descr) {
    try {
        if ((typeof(url) !== "string") || (typeof(descr) !== "string"))
            throw "getJSONFile: parameter not a string";
        else {
            var httpReq = new XMLHttpRequest(); // a new http request
            httpReq.open("GET",url,false); // init the request
            httpReq.send(null); // send the request
            var startTime = Date.now();
            while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
                if ((Date.now()-startTime) > 3000)
                    break;
            } // until its loaded or we time out after three seconds
            if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE))
                throw "Unable to open "+descr+" file!";
            else
                return JSON.parse(httpReq.response); 
        } // end if good params
    } // end try    
    
    catch(e) {
        console.log(e);
        return(String.null);
    }
} // end get input json file

// Solve quadratic. Return empty array if no solutions, 
// one t value if one solution, two if two solutions.
function solveQuad(a,b,c) {
    var discr = b*b - 4*a*c; 
    // console.log("a:"+a+" b:"+b+" c:"+c);

    if (discr < 0) { // no solutions
        // console.log("no roots!");
        return([]); 
    } else if (discr == 0) { // one solution
        // console.log("root: "+(-b/(2*a)));
        return([-b/(2*a)]);
    } else { // two solutions
        var denom = 0.5/a;
        var term1 = -b;
        var term2 = Math.sqrt(discr)
        var tp = denom * (term1 + term2);
        var tm = denom * (term1 - term2);
        // console.log("root1:"+tp+" root2:"+tm);
        if (tm < tp)
            return([tm,tp]);
        else
            return([tp,tm]);
    } 
} // end solveQuad
    
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

// get the input ellipsoids from the standard class URL
function getInputEllipsoids() {
    const INPUT_ELLIPSOIDS_URL = 
        "https://ncsucgclass.github.io/prog1/ellipsoids.json";
        
    // load the ellipsoids file
    var httpReq = new XMLHttpRequest(); // a new http request
    httpReq.open("GET",INPUT_ELLIPSOIDS_URL,false); // init the request
    httpReq.send(null); // send the request
    var startTime = Date.now();
    while ((httpReq.status !== 200) && (httpReq.readyState !== XMLHttpRequest.DONE)) {
        if ((Date.now()-startTime) > 3000)
            break;
    } // until its loaded or we time out after three seconds
    if ((httpReq.status !== 200) || (httpReq.readyState !== XMLHttpRequest.DONE)) {
        console.log*("Unable to open input ellipses file!");
        return String.null;
    } else
        return JSON.parse(httpReq.response); 
} // end get input ellipsoids

// put random points in the ellipsoids from the class github
function drawRandPixelsInInputEllipsoids(context) {
    var inputEllipsoids = getInputEllipsoids();
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
    var inputEllipsoids = getInputEllipsoids();
    
    
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

// returns true if passed light is occluded from passed intersect/ellipsoid
// by passed array of ellipsoids
function isLightOccluded(L,isectPos,isectEllipsoid,ellipsoids) {
    var e=0; // which ellipsoid
    var lightOccluded = false; // if light is occluded
    var occluderIsect = {}; // occluder intersect details
    // console.log("testing for occlusions");
    
    // check each ellipsoid up to intersected ellipsoid to see if it occludes
    while ((!lightOccluded) && (e<isectEllipsoid)) { 
        occluderIsect = rayEllipsoidIntersect([isectPos,L],ellipsoids[e],0);
        if (!occluderIsect.exists) { // no intersection
            e++; // on to next ellipsoid
        } else if (occluderIsect.t > 1) { // light in front of intersection
            e++; // on to next sphere
        } else {
            lightOccluded = true;
            // console.log("occlusion found from ellipsoid "+isectEllipsoid+" to "+e);
        } // end if occlusion found
    } // while all ellipsoids up to one intersected by eye
    
    // check each ellipsoid after intersected ellipsoid to see if it occludes
    e = isectEllipsoid+1;
    while ((!lightOccluded) && (e<ellipsoids.length)) { 
        occluderIsect = rayEllipsoidIntersect([isectPos,L],ellipsoids[e],0);
        // console.log("oisect: "+occluderIsect);
        if (!occluderIsect.exists) { // no intersection
            e++; // on to next ellipsoid
        } else if (occluderIsect.t > 1) { // light in front of intersection
            e++; // on to next ellipsoid
        } else {
            lightOccluded = true;
            // console.log("occlusion found from ellipsoid "+isectEllipsoid+" to "+e);
        } // end if occlusion found
    } // while all ellipsoids after one intersected by eye
    
    return(lightOccluded);
} // end is light occluded

// color the passed intersection and ellipsoid
function shadeIsect(isect,isectEllipsoid,lights,ellipsoids) {
    try {
        if (   !(isect instanceof Object) || !(typeof(isectEllipsoid) === "number") 
            || !(lights instanceof Array) || !(ellipsoids instanceof Array))
            throw "shadeIsect: bad parameter passed";
        else if (RENDER_METHOD == renderTypes.ISECT_ONLY) {
            var r = ellipsoids[isectEllipsoid].diffuse[0];
            var g = ellipsoids[isectEllipsoid].diffuse[1];
            var b = ellipsoids[isectEllipsoid].diffuse[2];
            return(new Color(255*r,255*g,255*b,255));
        } else { // if not just rendering intersects
            var c = new Color(0,0,0,255); // init the ellipsoid color to black
            var ellipsoid = ellipsoids[isectEllipsoid]; // ellipsoid intersected by eye
            // console.log("shading pixel");

            // add light for each source
            var lightOccluded = false; // if an occluder is found
            var Lloc = new Vector(0,0,0);
            for (var l=0; l<lights.length; l++) {

                // add in the ambient light
                c[0] += lights[l].ambient[0] * ellipsoid.ambient[0]; // ambient term r
                c[1] += lights[l].ambient[1] * ellipsoid.ambient[1]; // ambient term g
                c[2] += lights[l].ambient[2] * ellipsoid.ambient[2]; // ambient term b
                
                // check each other sphere to see if it occludes light
                Lloc.set(lights[l].x,lights[l].y,lights[l].z);
                var L = Vector.normalize(Vector.subtract(Lloc,isect.xyz)); // light vector unnorm'd
                // L.toConsole("L: ");
                // console.log("isect: "+isect.xyz.x+", "+isect.xyz.y+", "+isect.xyz.z);
                
                // if light isn't occluded
                var shadowed = (RENDER_METHOD == renderTypes.LIT_SHADOWS) ? 
                                isLightOccluded(L,isect.xyz,isectEllipsoid,ellipsoids) : false;
                if (!shadowed) {
                    // console.log("no occlusion found");
                    
                    // add in the diffuse light
                    var isectMCtr = Vector.subtract(isect.xyz,new Vector(ellipsoid.x,ellipsoid.y,ellipsoid.z));
                    var derivCoeffs = new Vector(ellipsoid.a*ellipsoid.a,ellipsoid.b*ellipsoid.b,ellipsoid.c*ellipsoid.c);
                    var derivCoeffs = Vector.divide(new Vector(2,2,2),derivCoeffs);
                    var N = Vector.normalize(Vector.multiply(isectMCtr,derivCoeffs)); // surface normal 
                    var diffFactor = Math.max(0,Vector.dot(N,L));
                    if (diffFactor > 0) {
                        c[0] += lights[l].diffuse[0] * ellipsoid.diffuse[0] * diffFactor;
                        c[1] += lights[l].diffuse[1] * ellipsoid.diffuse[1] * diffFactor;
                        c[2] += lights[l].diffuse[2] * ellipsoid.diffuse[2] * diffFactor;
                    } // end nonzero diffuse factor

                    // add in the specular light
                    var V = Vector.normalize(Vector.subtract(Eye,isect.xyz)); // view vector
                    var H = Vector.normalize(Vector.add(L,V)); // half vector
                    var specFactor = Math.max(0,Vector.dot(N,H)); 
                    if (specFactor > 0) {
                        var newSpecFactor = specFactor;
                        for (var e=1; e<ellipsoids[isectEllipsoid].n; e++) // mult by itself if needed
                            newSpecFactor *= specFactor;
                        c[0] += lights[l].specular[0] * ellipsoid.specular[0] * newSpecFactor; // specular term
                        c[1] += lights[l].specular[1] * ellipsoid.specular[1] * newSpecFactor; // specular term
                        c[2] += lights[l].specular[2] * ellipsoid.specular[2] * newSpecFactor; // specular term
                    } // end nonzero specular factor
                    
                } // end if light not occluded
            } // end for lights
            
            c[0] = 255 * Math.min(1,c[0]); // clamp max value to 1
            c[1] = 255 * Math.min(1,c[1]); // clamp max value to 1
            c[2] = 255 * Math.min(1,c[2]); // clamp max value to 1

            return(c);
        } // if not just rendering isect
    } // end throw
    
    catch(e) {
        console.log(e);
        return(Object.null);
    }
}

// use ray casting with ellipsoids to get pixel colors
function rayCastEllipsoids(context) {
    var inputEllipsoids = getJSONFile(INPUT_SPHERES_URL,"ellipsoids");
    var inputLights = getJSONFile(INPUT_LIGHTS_URL,"lights");
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
        var wx = WIN_LEFT; // init world pixel xcoord
        var wxd = (WIN_RIGHT-WIN_LEFT) * 1/(w-1); // world pixel x differential
        var wy = WIN_TOP; // init world pixel ycoord
        var wyd = (WIN_BOTTOM-WIN_TOP) * 1/(h-1); // world pixel y differential
        for (y=0; y<h; y++) {
            wx = WIN_LEFT; // init w
            for (x=0; x<h; x++) {
                closestT = Number.MAX_VALUE; // no closest t for this pixel
                c.change(0,0,0,255); // set pixel to background color
                Dir.copy(Vector.subtract(new Vector(wx,wy,WIN_Z),Eye)); // set ray direction
                //Dir.toConsole("Dir: ");
                for (var e=0; e<n; e++) {
                // for (var e=0; e<1; e++) {
                    isect = rayEllipsoidIntersect([Eye,Dir],inputEllipsoids[e],1); 
                    if (isect.exists) // there is an intersect
                        if (isect.t < closestT) { // it is the closest yet
                            closestT = isect.t; // record closest t yet
                            c = shadeIsect(isect,e,inputLights,inputEllipsoids); 
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

// given a pixel position, calculate x and y pixel and world coords
function getPixelLocat(pixelNum, w, h) {
    var y = Math.floor(pixelNum/w);
    var x = pixelNum - y*w; 
    var wx = WIN_LEFT + x/w * (WIN_RIGHT - WIN_LEFT);
    var wy = WIN_TOP + y/h * (WIN_BOTTOM - WIN_TOP);
    
    //console.log("pixelNum: "+pixelNum+", x:"+x+", y:"+y+", wx:"+wx+", wy:"+wy);
    
    return ({"x": x, "y": y, "wx": wx, "wy": wy});
}

// use frameless ray casting with spheres to get pixel colors
function framelessRayCastSpheres(context) {
    var inputSpheres = getJSONFile(INPUT_SPHERES_URL,"spheres");
    var inputLights = getJSONFile(INPUT_LIGHTS_URL,"lights");

    if ((inputSpheres != String.null) && (inputLights != String.null)) { 
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
                pixelLocat = getPixelLocat(pixelOrder[p],w,h); // get pixel location
                Dir.copy(Vector.subtract(new Vector(pixelLocat.wx,pixelLocat.wy,WIN_Z),Eye)); // set ray direction
                //Dir.toConsole("Dir: ");
                for (var s=0; s<n; s++) { // for each sphere
                    // for (var s=0; s<1; s++) {
                    isect = raySphereIntersect([Eye,Dir],inputSpheres[s],1); 
                    if (isect.exists) // there is an intersect
                        if (isect.t < closestT) { // it is the closest yet
                            closestT = isect.t; // record closest t yet
                            c = shadeIsect(isect,s,inputLights,inputSpheres); 
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


/* constants and globals */

const WIN_Z = 0;
const WIN_LEFT = 0, WIN_RIGHT = 1;
const WIN_BOTTOM = 0, WIN_TOP = 1; 
const INPUT_SPHERES_URL = 
    "https://ncsucgclass.github.io/prog1/ellipsoids.json";
    //"https://pages.github.ncsu.edu/bwatson/introcg-prog1-2017/ellipsoids.json";
const INPUT_LIGHTS_URL = 
    "https://ncsucgclass.github.io/prog1/lights.json";
    //"https://pages.github.ncsu.edu/bwatson/introcg-prog1-2017/lights.json";
const renderTypes = {
        ISECT_ONLY: 1, // render white if intersect in pixel
        LIT: 2, // render lit color if intersect in pixel
        LIT_SHADOWS: 3 // render lit/shadowed color in intersect in pixel
    }; 
const RENDER_METHOD = renderTypes.LIT_SHADOWS; // show intersections unlit in white
        
var Eye = new Vector(0.5,0.5,-0.5); // set the eye position


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
      
    rayCastEllipsoids(context); 
    
    //framelessRayCastSpheres(context);
}
