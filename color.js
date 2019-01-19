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

  clamp(limit) {
    this[0] = Math.min(limit,this[0]); // clamp max value to 1
    this[1] = Math.min(limit,this[1]); // clamp max value to 1
    this[2] = Math.min(limit,this[2]); // clamp max value to 1
    return this;
  }

  scale3(factor) {
    this[0] *= factor;
    this[1] *= factor;
    this[2] *= factor;
    return this;
  }
} // end color class
