// Vector class
class Vector {
    constructor(x,y,z) {
        this.set(x,y,z);
    } // end constructor

    // sets the components of a vector
    set(x,y,z) {
      if ((typeof(x) !== "number") || (typeof(y) !== "number") || (typeof(z) !== "number"))
          throw "vector component not a number";
      else
          this.x = x; this.y = y; this.z = z;
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

    length() {
      return Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2) + Math.pow(this.z, 2));
    }

    toConsole(prefix) {
        console.log(prefix+"["+this.x+","+this.y+","+this.z+"]");
    } // end to console

    // static dot method
    static dot(v1,v2) {
      if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
          throw "Vector.dot: non-vector parameter";
      else
          return(v1.x*v2.x + v1.y*v2.y + v1.z*v2.z);
    } // end dot static method

    // static cross method
    static cross(v1,v2) {
        try {
            if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
                throw "Vector.cross: non-vector parameter";
            else
                return new Vector(
                  v1.y * v2.z - v1.z * v2.y,
                  v1.z * v2.x - v1.x * v2.z,
                  v1.x * v2.y - v1.y * v2.x
                );
        } // end try

        catch(e) {
            console.log(e);
            return(NaN);
        }
    } // end cross static method

    // static add method
    static add(v1,v2) {
      if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
          throw "Vector.add: non-vector parameter";
      else
          return(new Vector(v1.x+v2.x,v1.y+v2.y,v1.z+v2.z));
    } // end add static method

    // static subtract method, v1-v2
    static subtract(v1,v2) {
        if (!(v1 instanceof Vector) || !(v2 instanceof Vector))
            throw "Vector.subtract: non-vector parameter";
        else {
            var v = new Vector(v1.x-v2.x,v1.y-v2.y,v1.z-v2.z);
            //v.toConsole("Vector.subtract: ");
            return(v);
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
      if (!(v instanceof Vector))
          throw "Vector.normalize: parameter not a vector";
      else {
          var lenDenom = 1/Math.sqrt(Vector.dot(v,v));
          return(Vector.scale(lenDenom,v));
      }

    } // end scale static method

} // end Vector class
