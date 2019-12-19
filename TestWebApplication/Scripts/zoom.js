// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Seadragon2.js
// Defines the Seadragon namespace.

/*global Seadragon2: true */
/*jshint strict: false */

/**
 *  The global Seadragon namespace. All Seadragon objects are defined within
 *  this namespace, and this is the only global variable created by Seadragon2.
 *  @module Seadragon2
 */

/**
 *  @class Seadragon2
 *  @private
 *  @static
 */
if (typeof Seadragon2 === "undefined") {
    window.Seadragon2 = {};
}

var SD = Seadragon2, // local reference for the global Seadragon object

    /**
     *  The version string of the currently loaded Seadragon Ajax library.
     *  This takes the form "{major}.{minor}.{bugfix}", e.g. "2.0.3".
     *  @property VERSION
     *  @final
     *  @type string
     */
    SD_VERSION = SD.VERSION = "2.0.pre";  // TODO set dynamically during build

// no documentation necessary, I don't think. this is meant only for cases
// where someone alerts or logs the Seadragon object during debugging.
SD.toString = function () {
    return "Seadragon Ajax v" + SD_VERSION +
        "\nCopyright (c) Microsoft Corp.";
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Point.js
// Defines the Seadragon2.Point class.

/*global SD, SDSize */
/*jshint strict: false */

/**
 *  Represents a 2D point. This class encourages immutability -- all instance
 *  methods return a new Point rather than modifying the instance -- but does
 *  not require it or enforce it. All methods of this class that take a Point
 *  argument also support anonymous {x,y} point literals instead.
 *  @class Point
 *  @namespace Seadragon2
 */

var

    /**
     *  Constructs a Point with the given x and y values.
     *  @constructor
     *  @param {number} x The x-value of the point to construct.
     *  @param {number} y The y-value of the point to construct.
     */
    SDPoint = SD.Point = function (x, y) {

        /**
         *  The x-value of this point.
         *  @property x
         *  @type number
         */
        this.x = x || 0;
        
        /**
         *  The y-value of this point.
         *  @property y
         *  @type number
         */
        this.y = y || 0;
    },

    /**
     *  <p>
     *  Returns a Point instance representing the given {x,y} object literal. If the
     *  object is already a Point instance, the same instance is returned. This
     *  allows apps to accept anonymous point literals while still being able to use
     *  all of the Point class's methods.
     *  </p>
     *  <p>
     *  Examples:
     *  </p>
     *  <pre>
     *  var p1 = new Point(10, 20);
     *  var p2 = $(p1);
     *  var p3 = { x: 10, y: 20 };
     *  var p4 = $(p3);
     *  
     *  alert(p1);  // => "(10,20)" via Point.toString()
     *  alert(p2);  // => "(10,20)"
     *  alert(p1 === p2);   // => true (same instance)
     *  alert(p3);  // => "[object Object]"
     *  alert(p4);  // => "(10,20)"
     *  alert(typeof p3.plus);  // => "undefined"
     *  alert(typeof p4.plus);  // => "function"
     *  </pre>
     *  @method $
     *  @static
     *  @param {object} obj An (x,y) object literal representing a point.
     *  @return {Point} A Point instance representing the given object literal.
     */
    SDPoint_$ = SDPoint.$ = function (obj) {
        if (obj instanceof SDPoint) {
            return obj;
        }

        obj = obj || {};
        return new SDPoint(obj.x, obj.y);
    },

    SDPointPrototype = SDPoint.prototype,
    
    SDPoint_origin = new SDPoint(0, 0);

/**
 *  Adds the given point to this point and returns the result.
 *  @method plus
 *  @param {Point} point The point to add.
 *  @return {Point} The resulting point sum.
 */
SDPointPrototype.plus = function (point) {
    return new SDPoint(this.x + point.x, this.y + point.y);
};

/**
 *  Subtracts the given point from this point and returns the result.
 *  @method minus
 *  @param {Point} point The point to subtract.
 *  @return {Point} The resulting point difference.
 */
SDPointPrototype.minus = function (point) {
    return new SDPoint(this.x - point.x, this.y - point.y);
};

/**
 *  Multiplies this point by the given factor and returns the result.
 *  @method times
 *  @param {number} factor The factor to multiply by.
 *  @return {Point} The resulting point product.
 */
SDPointPrototype.times = function (factor) {
    return new SDPoint(this.x * factor, this.y * factor);
};

/**
 *  Divides this point by the given factor and returns the result.
 *  @method divide
 *  @param {number} factor The factor to divide by.
 *  @return {Point} The resulting point quotient.
 */
SDPointPrototype.divide = function (factor) {
    return new SDPoint(this.x / factor, this.y / factor);
};

/**
 *  Returns the (-x,-y) negation of this point.
 *  @method negate
 *  @return {Point} The (-x,-y) negation of this point.
 */
SDPointPrototype.negate = function () {
    return new SDPoint(-this.x, -this.y);
};

/**
 *  Applies the given unary function, e.g. Math.floor() or Math.round(), to the
 *  x- and y-values of this point and returns the result.
 *  @method apply
 *  @param {function} func The unary function to apply. The function should accept a
 *  number and return a number. Examples are Math.floor() and Math.round().
 *  @return {Point} The resulting point.
 */
SDPointPrototype.apply = function (func) {
    return new SDPoint(func(this.x), func(this.y));
};

/**
 *  Calculates the Euclidean distance from the given point to this one and
 *  returns the result.
 *  @method distanceTo
 *  @param {Point} point The other point.
 *  @return {number} The Euclidean distance from the given point to this one.
 */
SDPointPrototype.distanceTo = function (point) {
    var xDiff = this.x - point.x,
        yDiff = this.y - point.y;
    return Math.sqrt(xDiff * xDiff + yDiff * yDiff);
};

/**
 *  Creates and returns a Size instance whose width and height values represent
 *  the x- and y-values of this point, respectively.
 *  @method asSize
 *  @return {Size} A Size instance whose width and height represent the x- and
 *  y-values of this point, respectively.
 */
SDPointPrototype.asSize = function () {
    return new SDSize(this.x, this.y);
};

/**
 *  Returns true if the given object represents the same 2D point as this one.
 *  @method equals
 *  @param {object} other The other object to compare.
 *  @returns {boolean} True if the given object represents the same 2D point as
 *  this one.
 */
SDPointPrototype.equals = function (other) {
    return (this.x === (other.x || 0)) && (this.y === (other.y || 0));
};

/**
 *  Returns a human-readable representation of this point. The returned string
 *  is of the format "({x},{y})", e.g. "(10,20)".
 *  @method toString
 *  @return {string} A human-readable representation of this point.
 */
SDPointPrototype.toString = function () {
    return ["(", this.x, ",", this.y, ")"].join('');
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Size.js
// Defines the Seadragon2.Size class.

/*global SD, SDPoint */
/*jshint strict: false */

/**
 *  Represents a 2D size. This class encourages immutability -- all instance
 *  methods return a new Size rather than modifying the instance -- but does
 *  not require it or enforce it. All methods of this class that take a Size
 *  argument also support anonymous {width,height} size literals instead.
 *  @class Size
 *  @namespace Seadragon2
 */

var

    /**
     *  Constructs a Size with the given width and height values.
     *  @constructor
     *  @param {number} width The width value of the size to construct.
     *  @param {number} height The height value of the size to construct.
     */
    SDSize = SD.Size = function (width, height) {

        /**
         *  The width value of this size.
         *  @property width
         *  @type number
         */
        this.width = width || 0;
        
        /**
         *  The height value of this size.
         *  @property height
         *  @type number
         */
        this.height = height || 0;
    },

    /**
     *  <p>
     *  Returns a Size instance representing the given {width,height} object
     *  literal. If the object is already a Size instance, the same instance is
     *  returned. This allows apps to accept anonymous size literals while still
     *  being able to use all of the Size class's methods.
     *  </p>
     *  <p>
     *  Examples:
     *  </p>
     *  <pre>
     *  var s1 = new Size(10, 20);
     *  var s2 = $(s1);
     *  var s3 = { width: 10, height: 20 };
     *  var s4 = $(s3);
     *  
     *  alert(s1);  // => "(10x20)" via Size.toString()
     *  alert(s2);  // => "(10x20)"
     *  alert(s1 === s2);   // => true (same instance)
     *  alert(s3);  // => "[object Object]"
     *  alert(s4);  // => "(10x20)"
     *  alert(typeof s3.plus);  // => "undefined"
     *  alert(typeof s4.plus);  // => "function"
     *  </pre>
     *  @method $
     *  @static
     *  @param {object} obj A (width,height) object literal representing a size.
     *  @return {Size} A Size instance representing the given object literal.
     */
    SDSize_$ = SDSize.$ = function (obj) {
        if (obj instanceof SDSize) {
            return obj;
        }

        obj = obj || {};
        return new SDSize(obj.width, obj.height);
    },

    SDSizePrototype = SDSize.prototype;

/**
 *  Adds the given size to this size and returns the result.
 *  @method plus
 *  @param {Size} size The size to add.
 *  @return {Size} The resulting size sum.
 */
SDSizePrototype.plus = function (size) {
    return new SDSize(this.width + size.width, this.height + size.height);
};

/**
 *  Subtracts the given size from this size and returns the result.
 *  @method minus
 *  @param {Size} size The size to subtract.
 *  @return {Size} The resulting size difference.
 */
SDSizePrototype.minus = function (size) {
    return new SDSize(this.width - size.width, this.height - size.height);
};

/**
 *  Multiplies this size by the given factor and returns the result.
 *  @method times
 *  @param {number} factor The factor to multiply by.
 *  @return {Size} The resulting size product.
 */
SDSizePrototype.times = function (factor) {
    return new SDSize(this.width * factor, this.height * factor);
};

/**
 *  Divides this size by the given factor and returns the result.
 *  @method divide
 *  @param {number} factor The factor to divide by.
 *  @return {Size} The resulting size quotient.
 */
SDSizePrototype.divide = function (factor) {
    return new SDSize(this.width / factor, this.height / factor);
};

/**
 *  Returns the (-width,-height) negation of this size.
 *  @method negate
 *  @return {Size} The (-width,-height) negation of this size.
 */
SDSizePrototype.negate = function () {
    return new SDSize(-this.width, -this.height);
};

/**
 *  Applies the given unary function, e.g. Math.floor() or Math.round(), to the
 *  width and height values of this size and returns the result.
 *  @method apply
 *  @param {function} func The unary function to apply. The function should accept a
 *  number and return a number. Examples are Math.floor() and Math.round().
 *  @return {Size} The resulting size.
 */
SDSizePrototype.apply = function (func) {
    return new SDSize(func(this.width), func(this.height));
};

/**
 *  Creates and returns a Point instance whose width and height represent the
 *  width and height values of this size, respectively.
 *  @method asPoint
 *  @return {Point} A Point instance whose x- and y-values represent the width
 *  and height values of this size, respectively.
 */
SDSizePrototype.asPoint = function () {
    return new SDPoint(this.width, this.height);
};

/**
 *  Returns true if the given object represents the same 2D size as this one.
 *  @param {object} other
 *  @returns {boolean} True if the given object represents the same 2D size as
 *  this one.
 */
SDSizePrototype.equals = function (other) {
    return (this.width === (other.width || 0)) && (this.height === (other.height || 0));
};

/**
 *  Returns a human-readable representation of this size. The returned string
 *  is of the format "({width}x{height})", e.g. "(10x20)".
 *  @return {string} A human-readable representation of this size.
 */
SDSizePrototype.toString = function () {
    return ["(", this.width, "x", this.height, ")"].join('');
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Rect.js
// Defines the Seadragon2.Rect class.

/*global SD, SDPoint, SDSize */
/*jshint strict: false */

/**
 *  Represents a 2D rectangle. This class encourages immutability -- instance
 *  methods return a new Rect rather than modifying the instance -- but does not
 *  require it or enforce it. All methods of this class that take a Rect
 *  argument also support anonymous {x,y,width,height} size literals instead.
 *  @class Rect
 *  @namespace Seadragon2
 */

var

    /**
     *  Constructs a Rect with the given x, y, width and height values.
     *  @constructor
     *  @param {number} x The x-value of the rect to construct.
     *  @param {number} y The y-value of the rect to construct.
     *  @param {number} width The width value of the rect to construct.
     *  @param {number} height The height value of the rect to construct.
     */
    /*  YUI doc doesn't accept multiple constructors, so we'll leave this one out.
     *  Constructs a Rect with the given top-left point and size.
     *  @constructor
     *  @param {Point} point The top-left point of the rect to construct.
     *  @param {Size} size The size of the rect to construct.
     */
    SDRect = SD.Rect = function (x, y, width, height) {
        if (x && width === undefined && x.x !== undefined) {
            // the first argument has an x property, so it's probably a Point.
            width = y.width;
            height = y.height;
            y = x.y;
            x = x.x;
        }
    
        this.x = x || 0;
        this.y = y || 0;
        this.width = width || 0;
        this.height = height || 0;
    },

    /**
     *  <p>
     *  Returns a Rect instance representing the given {x,y,width,height} object
     *  literal. If the object is already a Rect instance, the same instance is
     *  returned. This allows apps to accept anonymous rect literals while still
     *  being able to use all of the Rect class's methods.
     *  </p>
     *  <p>
     *  Examples:
     *  </p>
     *  <pre>
     *  var r1 = new Rect(10, 20, 30, 40);
     *  var r2 = $(r1);
     *  var r3 = { x: 10, y: 20, width: 30, height: 40 };
     *  var r4 = $(r3);
     *  
     *  alert(r1);  // => "[10,20|30x40]" via Rect.toString()
     *  alert(r2);  // => "[10,20|30x40]"
     *  alert(r1 === r2);   // => true (same instance)
     *  alert(r3);  // => "[object Object]"
     *  alert(r4);  // => "[10,20|30x40]"
     *  alert(typeof r3.getArea);   // => "undefined"
     *  alert(typeof r4.getArea);   // => "function"
     *  </pre>
     *  @method $
     *  @static
     *  @param {object} obj An (x,y,width,height) object literal representing a
     *  rect.
     *  @return {Rect} A Rect instance representing the given object literal.
     */
    SDRect_$ = SDRect.$ = function (obj) {
        if (obj instanceof SDRect) {
            return obj;
        }
    
        return new SDRect(obj.x, obj.y, obj.width, obj.height);
    },

    SDRectPrototype = SDRect.prototype,
    
    // singletons for useful rectangles
    SDRect_unitRect = new SDRect(0, 0, 1, 1),
    SDRect_nullRect = new SDRect(-1, -1, -1, -1);

/**
 *  Returns the area (width x height) of this rect.
 *  @return {number} The area (width x height) of this rect.
 */
SDRectPrototype.getArea = function () {
    return this.width * this.height;
};

/**
 *  Returns the aspect ratio (width / height) of this rect.
 *  @return {number} The aspect ratio (width / height) of this rect.
 */
SDRectPrototype.getAspectRatio = function () {
    return this.width / this.height;
};

/**
 *  Returns the width-normalized height (height / width) of this rect.
 *  @return {number} The width-normalized height (height / width) of this rect.
 */
SDRectPrototype.getNormHeight = function () {
    return this.height / this.width;
};

/**
 *  Returns the top-left point of this rect.
 *  @return {Point} The top-left point of this rect.
 */
SDRectPrototype.getTopLeft = function () {
    return new SDPoint(this.x, this.y);
};

/**
 *  Returns the bottom-right point of this rect.
 *  @return {Point} The bottom-right point of this rect.
 */
SDRectPrototype.getBottomRight = function () {
    return new SDPoint(this.x + this.width, this.y + this.height);
};

/**
 *  Returns the center point of this rect.
 *  @return {Point} The center point of this rect.
 */
SDRectPrototype.getCenter = function () {
    return new SDPoint(this.x + (this.width / 2), this.y + (this.height / 2));
};

/**
 *  Returns the size of this rect.
 *  @return {Size} The size of this rect.
 */
SDRectPrototype.getSize = function () {
    return new SDSize(this.width, this.height);
};

/**
 *  Returns true if this rect contains the given point.
 *  @method contains
 *  @param {Point} point
 *  @return {boolean} True if this rect contains the given point.
 */
/**
 *  Returns true if this rect contains the given rect entirely.
 *  @method contains&nbsp;
 *  @param {Rect} rect
 *  @return {boolean} True if this rect contains the given rect entirely.
 */
SDRectPrototype.contains = function (pointOrRect) {
    var thisRight = this.x + this.width,
        thisBottom = this.y + this.height,
        pointOrRectRight = pointOrRect.x + (pointOrRect.width || 0),
        pointOrRectBottom = pointOrRect.y + (pointOrRect.height || 0);

    return (this.x <= pointOrRect.x) && (this.y <= pointOrRect.y) &&
        (thisRight >= pointOrRectRight) && (thisBottom >= pointOrRectBottom);
};

/**
 *  Returns the union of this rect and the given point. The returned rect is the
 *  smallest possible rect that contains both this rect and the given point.
 *  @method union
 *  @param {Point} point
 *  @return {Rect} The union of this rect and the given point.
 */
/**
 *  Returns the union of this rect and the given rect. The returned rect is the
 *  smallest possible rect that contains both this rect and the given rect.
 *  @method union&nbsp;
 *  @param {Rect} rect
 *  @return {Rect} The union of this rect and the given rect.
 */
SDRectPrototype.union = function (pointOrRect) {
    var minX = Math.min(this.x, pointOrRect.x),
        minY = Math.min(this.y, pointOrRect.y),
        maxRight = Math.max(
            this.x + this.width, pointOrRect.x + (pointOrRect.width || 0)),
        maxBottom = Math.max(
            this.y + this.height, pointOrRect.y + (pointOrRect.height || 0));

    return new SDRect(minX, minY, maxRight - minX, maxBottom - minY);
};

/**
 *  Returns the intersection of this rect and the given point. The result is the
 *  given point if the two intersect, or null if they don't.
 *  @method intersect
 *  @param {Point} point
 *  @return {Point} The given point if the point intersects with this rect,
 *  otherwise null.
 */
/**
 *  Returns the intersection of this rect and the given rect. The resulting rect
 *  can have an empty width and/or an empty height if the intersection is a line
 *  or a single point, but if the two don't intersect, the result is null.
 *  @method intersect&nbsp;
 *  @param {Rect} rect
 *  @return {Rect} The rect representing the intersection of this rect and the
 *  given rect if the two intersect, otherwise null.
 */
SDRectPrototype.intersect = function (pointOrRect) {
    var maxX = Math.max(this.x, pointOrRect.x),
        maxY = Math.max(this.y, pointOrRect.y),
        width = -maxX + Math.min(   // equivalent to minRight - maxX
            this.x + this.width, pointOrRect.x + (pointOrRect.width || 0)),
        height = -maxY + Math.min(  // equivalent to minBottom - maxY
            this.y + this.height, pointOrRect.y + (pointOrRect.height || 0));

    // if the result is a point, explicitly return a point
    if (!width && !height && !(pointOrRect instanceof SDRect)) {
        return new SDPoint(maxX, maxY);
    }

    // if the two don't overlap, explicitly return null
    if (width < 0 || height < 0) {
        return null;
    }

    // otherwise, return the intersecting rect!
    return new SDRect(maxX, maxY, width, height);
};

/**
 *  Scales this rect by the given factor and optionally about the given point
 *  (defaulting to the top-left of this rect) and returns the result.
 *  @param {number} factor The factor to scale by.
 *  @param {Point} aboutPoint? The point to scale about. If not given, the
 *  top-left of this rect is used.
 *  @return {Rect} The resulting scaled rect.
 */
SDRectPrototype.scale = function(factor, aboutPoint) {
    var aboutX = aboutPoint ? aboutPoint.x : this.x,
        aboutY = aboutPoint ? aboutPoint.y : this.y;
    
    return new SDRect(
        aboutX - factor * (aboutX - this.x),
        aboutY - factor * (aboutY - this.y),
        this.width * factor,
        this.height * factor);
};

/**
 *  Translates this rect by the given delta point and returns the result.
 *  @param {Point} deltaPoint The amount to translate this rect by in x and y.
 *  @return {Rect} The resulting translated rect.
 */
SDRectPrototype.translate = function(deltaPoint) {
    return new SDRect(
        this.x + (deltaPoint.x || 0),
        this.y + (deltaPoint.y || 0),
        this.width,
        this.height);
};

/**
 *  Returns true if the given object represents the same 2D rect as this one.
 *  @param {object} other
 *  @returns {boolean} True if the given object represents the same 2D rect as
 *  this one.
 */
SDRectPrototype.equals = function (other) {
    return (this.x === (other.x || 0)) && (this.y === (other.y || 0)) &&
        (this.width === (other.width || 0)) && (this.height === (other.height || 0));
};

/**
 *  Returns a human-readable representation of this rect. The returned string
 *  is of the format "[{x},{y}|{width}x{height}]", e.g. "[10,20|30x40]".
 *  @return {string} A human-readable representation of this rect.
 */
SDRectPrototype.toString = function () {
    return [
        "[", this.x, ",", this.y, "|", this.width, "x", this.height, "]"
    ].join('');
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// String.js
// Defines the Seadragon2.String class.

/*global SD */
/*jshint strict: false, plusplus: false */

var

    /**
     *  A utility class for working with Javascript strings.
     *  @class String
     *  @private
     *  @namespace Seadragon2
     *  @static
     */    
    SDString = SD.String = {},

    // actually three overloads:
    // 1. varargs, e.g. format("{0}{1}", "hello ", "world")
    // 2. dictionary <-- must be object literal! (constructor === Object)
    // 3. array <-- must be array literal! (constructor === Array)
    /**
     *  
     *  @method format
     *  @param {string} str
     *  @param {object*} ...
     *  @return {string} 
     */
    /**
     *  
     *  @method format&nbsp;
     *  @param {string} str
     *  @param {object} args
     *  @return {string} 
     */
    SDString_format = SDString.format = function (str, varargs) {
        var args, i;

        // support both a varargs list, and a single argument that's an object
        // hash or array. (in that case, the string arguments are the hash keys
        // or array indices anyway, so they're just properties of that object.)
        if (arguments.length === 2 && varargs && varargs.constructor &&
            (varargs.constructor === Array || varargs.constructor === Object)) {
            args = varargs;
        } else {
            args = new Array(arguments.length - 1);
            for (i = 0; i < args.length; i++) {
                args[i] = arguments[i + 1];
            }
        }

        // TODO ignore escaped (double) brackets
        return str.replace(/\{[\d\w]+\}/g, function (capture) {
            var key = capture.match(/[\d\w]+/);
            return args[key] || "";
        });
    };

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Debug.js
// Defines the Seadragon2.Debug class.

/*global alert, console, SD, SDString_format */
/*jshint strict: false */

var

    /**
     *  A utility class for logging debugging information, warnings and error
     *  messages. Uses the Javascript console if one is present, otherwise
     *  optionally alerts the messages. Supports string formatting and fail-fast
     *  error throwing, and can be fully enabled or disabled.
     *  @class Debug
     *  @namespace Seadragon2
     *  @static
     */
    SDDebug = SD.Debug = {
    
        /**
         *  Whether messages should be alerted, in the case that there's no Javascript
         *  console. The value corresponds to message importance; 1 is errors only, 2
         *  includes warnings, and 3 includes logs.
         *  @property alert
         *  @type boolean
         *  @default 0
         */
        alert: 0,
        
        /**
         *  Whether any messages should be logged or not. If this is zero, all calls
         *  to all methods of this class do nothing, returning immediately. The value
         *  corresponds to message importance; 1 is errors only, 2 includes warnings,
         *  and 3 includes logs.
         *  @property enabled
         *  @type number
         *  @default 3
         */
        enabled: 3
    },

    /**
     *  Logs the given message, optionally formatted with the given arguments, as
     *  an informational message.
     *  @method log
     *  @param {string} msg The message to log.
     *  @param {object*} ...? Any format arguments to apply to the given message.
     */
    SDDebug_log = SDDebug.log = function (msg, varargs) {
        if (SDDebug.enabled < 3) {
            return;
        }

        if (arguments.length > 1) {
            msg = SDString_format.apply(this, arguments);
        }
            
        if ((typeof console !== "undefined") && console.log) {
            console.log(msg);
        } else if (SDDebug.alert >= 3) {
            alert(msg);
        }
    },

    /**
     *  Logs the given message, optionally formatted with the given arguments, as a
     *  warning message.
     *  @method warn
     *  @param {string} msg The message to log.
     *  @param {object*} ...? Any format arguments to apply to the given message.
     */
    SDDebug_warn = SDDebug.warn = function (msg/*, ...*/) {
        if (SDDebug.enabled < 2) {
            return;
        }

        if (arguments.length > 1) {
            msg = SDString_format.apply(this, arguments);
        }

        if ((typeof console !== "undefined") && console.warn) {
            console.warn(msg);
        } else if (SDDebug.alert >= 2) {
            alert(msg);
        }
    },

    /**
     *  Logs the given message as an error message, and throws either the given
     *  error object or a new, empty one, to provide fail-fast behavior.
     *  @method error
     *  @param {string} msg The message to log.
     *  @param {Error} e? The specific error object to throw. If not supplied, a
     *  new, empty error is thrown.
     */
    SDDebug_error = SDDebug.error = function (msg, e) {
        if (SDDebug.enabled < 1) {
            return;
        }
        
        if ((typeof console !== "undefined") && console.error) {
            console.error(msg);
        } else if (SDDebug.alert >= 1) {
            alert(msg);
        }

        throw e || new Error(msg);
    };

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Object.js
// Defines the Seadragon2.Object class.

/*global SD */
/*jshint strict: false */

var

    /**
     *  A utility class for working with Javascript objects.
     *  @class Object
     *  @namespace Seadragon2
     *  @static
     */    
    SDObject = SD.Object = {},

    /**
     *  Extends the first given object to contain all of the second given object's
     *  properties, and returns the first object. By default, inherited properties
     *  are not copied; specify <code>all</code> to copy them. Note that the first
     *  object is explicitly modified, while the second one is not. Note also that
     *  only shallow copies are possible and that only enumerable properties are
     *  discovered.
     *  @method extend
     *  @param {object} obj The object to extend.
     *  @param {object} other The object whose properties should be copied.
     *  @param {boolean} all? If given, copies all enumerable properties, including
     *  inherited ones.
     *  @return {object} <code>obj</code> after it has been extended with the
     *  properties of <code>other</code>.
     */
    SDObject_extend = SDObject.extend = function (obj, other, all) {
        for (var prop in other) {
            if (all || other.hasOwnProperty(prop)) {
                obj[prop] = other[prop];
            }
        }

        return obj;
    },

    /**
     *  Copies all of the given object's properties into a new object and returns
     *  the new object. By default, inherited properties are not copied; specify
     *  <code>all</code> to copy them. Note that only shallow copies are possible
     *  and that only enumerable properties are discovered. This is equivalent to
     *  extending a new empty object with the given object; that is, this is
     *  equivalent to calling <code>extend({}, obj, all)</code>.
     *  @method clone
     *  @param {object} obj The object to clone.
     *  @param {boolean} all? If given, copies all enumerable properties, including
     *  inherited ones.
     *  @return {object} A new object that is a clone of the given one.
     */
    SDObject_clone = SDObject.clone = function (obj, all) {
        return SDObject_extend({}, obj, all);
    };

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Function.js
// Defines the Seadragon2.Function class.

/*global SD */
/*jshint strict: false, plusplus: false */

var

    /**
     *  A utility class for working with Javascript functions.
     *  @class Function
     *  @namespace Seadragon2
     *  @static
     */
    SDFunction = SD.Function = {},
    
    SDFunction_EMPTY = SDFunction.EMPTY = function () {
        // nothing to do, simply returns undefined
    },

    /**
     *  <p>
     *  Returns a function that, when called, calls the given function, with the
     *  given object bound to the <code>this</code> keyword. That is, the value of
     *  <code>this</code> inside the given function will be the given object. In
     *  addition, the returned function passes along any given arguments, in the
     *  order that they were given.
     *  </p>
     *  @method bind
     *  @param {object} obj The object that the given function should bind to; i.e.
     *  the object that should become <code>this</code>.
     *  @param {function} func The function to bind.
     *  @param {varargs} ...? Any arguments that should be passed to the given
     *  function. They will be prepended to any arguments passsed to the returned
     *  function.
     *  @return {function} A function that, when called, calls the given function
     *  with the given object bound to <code>this</code>, passing along all given
     *  arguments in the order they were given.
     */
    /**
     *  Calls <code>bind</code> with a method on the given object, using the given
     *  method name to get the method. For example, calling
     *  <code>bind(obj, "toString")</code> is equivalent to, but less verbose and
     *  redundant than, calling <code>bind(obj, obj.toString)</code>.
     *  @method bind&nbsp;
     *  @param {object} obj See above.
     *  @param {string} methodName The name of the method on the given object to
     *  bind.
     *  @param {object*} ...? See above.
     *  @return {function} See above.
     */
    SDFunction_bind = SDFunction.bind = function (obj, func, varargs) {
        var args = new Array(arguments.length - 2), i, numArgs = args.length;

        for (i = 0; i < numArgs; i++) {
            args[i] = arguments[i + 2];
        }

        // support string method names also
        if (typeof func === "string") {
            func = obj[func];
        }

        return function () {
            var i, numArguments = arguments.length;

            for (i = 0; i < numArguments; i++) {
                args.push(arguments[i]);
            }

            func.apply(obj, args);
        };
    },

    /**
     *  Returns a function that, when called, will execute the given function
     *  with the given arguments. Similar to bind, but without the first
     *  argument.
     *  @method callback
     *  @param {function} func The function.
     *  @param {object*} ...? Any arguments to pass when calling the function.
     *  @return {function} A new function that encapsulates the call.
     */
    SDFunction_callback = SDFunction.callback = function (func, varargs) {
        // just bind() without the first object arg...
        var numArguments = arguments.length,
            args = new Array(numArguments + 1),
            i;

        // ...so copy the args with the object arg set to null (that gets
        // translated to the global object in Function.apply)...
        args[0] = null;
        for (i = 0; i < numArguments; i++) {
            args[i + 1] = arguments[i];
        }

        //...and call bind() with the expanded args.
        return SDFunction_bind.apply(SDFunction, args);
    },

    /**
     *  Delay execution of the given function by the given timeout.
     *  @method delay
     *  @param {function} func The function
     *  @param {number} msecs The length of delay, in milliseconds.
     *  @return {function} A function that, when executed, will start the
     *  requested timeout.
     */
    SDFunction_delay = SDFunction.delay = function (func, msecs) {
        return function () {
            setTimeout(SDFunction_bind(this, func), msecs);
        };
    };

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Browser.js
// Defines the Seadragon2.Browser class.

/*global SD */
/*jshint strict: false, regexp: false */

/**
 *  
 *  @class Browser
 *  @namespace Seadragon2
 *  @static
 *  @private
 */
var SDBrowser = SD.Browser = {},

    // most common rendering engines
    SDBrowser_TRIDENT = SDBrowser.TRIDENT = "Trident",
    SDBrowser_GECKO = SDBrowser.GECKO = "Gecko",
    SDBrowser_WEBKIT = SDBrowser.WEBKIT = "Webkit",
    SDBrowser_PRESTO = SDBrowser.PRESTO = "Presto",

    // most common browsers
    SDBrowser_IE = SDBrowser.IE = "IE",
    SDBrowser_FF = SDBrowser.FIREFOX = "Firefox",
    SDBrowser_SAFARI = SDBrowser.SAFARI = "Safari",
    SDBrowser_CHROME = SDBrowser.CHROME = "Chrome",
    SDBrowser_OPERA = SDBrowser.OPERA = "Opera",
    
    // convenience properties (they won't necessarily exist on the SDBrowser
    // object, but declaring them as local vars here for internal use):
    SDBrowser_isIE,
    SDBrowser_isFF,
    SDBrowser_isSafari,
    SDBrowser_isChrome,
    SDBrowser_isGecko,
    SDBrowser_isWebkit,
    SDBrowser_isOpera;

// this is a self-contained function so it can be unit-tested...
/**
 *  @method parseUserAgent
 *  @static
 *  @private
 *  @param {string} ua The user-agent string to parse.
 *  @return {Object} An object literal containing name, version, engine and
 *  engineVersion properties.
 */
function SDBrowser_parseUserAgent(ua) {
    var name = null,
        version = null,
        engine = null,
        engineVersion = null,
        ieMatch = /MSIE ([^\s;)]+)/.exec(ua),
        ffMatch = /Firefox\/(\S+)/.exec(ua),
        safariMatch = /Safari\/(\S+)/.exec(ua),
        chromeMatch = /Chrome\/(\S+)/.exec(ua),
        versionMatch = /Version\/(\S+)/.exec(ua),
        tridentMatch = /; Trident\/([^\s;)]+)/.exec(ua),
        geckoMatch = /rv\:([^\s)]+)\) Gecko\//.exec(ua),
        webkitMatch = /WebKit\/(\S+)/.exec(ua);

    if (ieMatch) {
        name = SDBrowser_IE;
        version = ieMatch[1];
        engine = SDBrowser_TRIDENT;

        // all IEs are Trident, but IE7- didn't say so (or the version)
        if (tridentMatch) {
            engineVersion = tridentMatch[1];
        }
    } else if (geckoMatch) {
        engine = SDBrowser_GECKO;
        engineVersion = geckoMatch[1];

        if (ffMatch) {
            name = SDBrowser_FF;
            version = ffMatch[1];
        }
    } else if (webkitMatch) {
        engine = SDBrowser_WEBKIT;
        engineVersion = webkitMatch[1];

        // order here matters; Chrome claims to be Safari
        if (chromeMatch) {
            name = SDBrowser_CHROME;
            version = chromeMatch[1];
        } else if (safariMatch && versionMatch) {
            name = SDBrowser_SAFARI;
            version = versionMatch[1];      // not safariMatch[1]
            engineVersion = safariMatch[1]; // tends to be more detailed
        }
    }

    return {
        name: name,
        version: version,
        engine: engine,
        engineVersion: engineVersion
    };
}

// ...so we'll call the function and copy its values here.
(function () {
    var props = SDBrowser_parseUserAgent(navigator.userAgent),
        name = props.name,
        version = props.version,
        versionInt = parseInt(version),
        versionFloat = parseFloat(version),
        engine = props.engine,
        engineVersion = props.engineVersion,
        engineVersionFloat = parseFloat(engineVersion);
    
    SDBrowser.name = name;
    SDBrowser.version = version;
    SDBrowser.engine = engine;
    SDBrowser.engineVersion = engineVersion;

    if (props.name === SDBrowser_IE) {
        
        SDBrowser_isIE = versionInt;
        
    } else if (props.name === SDBrowser_FF) {
        SDBrowser_isFF = versionInt;
    } else if (props.name === SDBrowser_SAFARI) {
        SDBrowser_isSafari = versionInt;
    } else if (props.name === SDBrowser_CHROME) {
        SDBrowser_isChrome = versionInt;
    }
    
}());

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Math.js
// Defines the Seadragon2.Math class.

/*global SD */
/*jshint strict: false */

var

    /**
     *  A utility class for performing common or advanced mathematical operations.
     *  @class Math
     *  @namespace Seadragon2
     *  @static
     */
	SDMath = SD.Math = {};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Math_clamp.js
// Defines the Seadragon2.Math.clamp() method.

/*global SDMath */
/*jshint strict: false */

var

    // aliases to improve lookup perf and allow minification;
    // other parts of the Seadragon code can reference these also!
    SDMath_max = Math.max,
    SDMath_min = Math.min,

    /**
     *  Returns the given number clamped into the range [min,max].
     *  @method clamp
     *  @param {number} x The number to clamp.
     *  @param {number} min The minimum value the result should be.
     *  @param {number} max The maximum value the result should be.
     *  @return {number}
     */
    SDMath_clamp = SDMath.clamp = function (x, min, max) {
	    return SDMath_max(min, SDMath_min(max, x));
	};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Math_log.js
// Defines the Seadragon2.Math.log(), log2() and log10() methods.

/*global SDMath */
/*jshint strict: false */

var

    // aliases to improve lookup perf and allow minification;
    // other parts of the Seadragon code can reference these also!
    SDMath_ln = Math.log,
    SDMath_LN2 = Math.LN2,
    SDMath_LN10 = Math.LN10,
    SDMath_exp = Math.exp,

    /**
     *  Returns the log of the given number in the given base.
     *  @method log
     *  @param {number} x
     *  @param {number} base
     *  @return {number}
     */
    SDMath_log = SDMath.log = function (x, base) {
	    if (base) {
	        return SDMath_ln(x) / SDMath_ln(base);
	    } else {
            // assume base of E, equivalent to Math.log() then
	        return SDMath_ln(x);
	    }
	},

    /**
     *  Returns the log of the given number in base 2.
     *  @method log2
     *  @param {number} x
     *  @return {number}
     */
    SDMath_log2 = SDMath.log2 = function (x) {
	    return SDMath_ln(x) / SDMath_LN2;
	},

    /**
     *  Returns the log of the given number in base 10.
     *  @method log10
     *  @param {number} x
     *  @return {number}
     */
    SDMath_log10 = SDMath.log10 = function (x) {
	    return SDMath_ln(x) / SDMath_LN10;
	};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Math_morton.js
// Defines the Seadragon2.Math.morton() and reverseMorton() methods.

/*global SDMath, SDPoint */
/*jshint strict: false, plusplus: false, bitwise: false */

var

    /**
     *  Returns the Morton number (z-order) of the 2D point at the
     *  given x- and y-values.
     *  @method morton
     *  @param {number} x The x-value of the 2D point.
     *  @param {number} y The y-value of the 2D point.
     *  @return {number}
     */
    /**
     *  Returns the Morton number (also known as z-order) of the given 2D point. The
     *  point can be a Point instance or an {x,y} point literal.
     *  @method morton&nbsp;
     *  @param {Point} point
     *  @return {number}
     */
    SDMath_morton = SDMath.morton = function (varargs) {
	    var x, y, arg0 = arguments[0], result, position, bit;
	
	    if (typeof arg0 === "object") {
	        x = arg0.x;
	        y = arg0.y;
	    } else {
	        x = arg0;
	        y = arguments[1];
	    }
	
	    result = 0;
	    position = 0;
	    bit = 1;
	
	    while (bit <= x || bit <= y) {
	        if (bit & x) {
	            result |= 1 << (2 * position + 1);
	        }
	        if (bit & y) {
	            result |= 1 << (2 * position);
	        }
	
	        position++;
	        bit = 1 << position;
	    }
	
	    return result;
	},

    /**
     *  Returns the 2D point represented by the given Morton number (z-order).
     *  @method reverseMorton
     *  @param {number} n
     *  @return {Point}
     */
    SDMath_reverseMorton = SDMath.reverseMorton = function (n) {
	    var xBits = [], yBits = [], x = 0, y = 0, i;
	
	    while (n > 0) {
	        yBits.push(n % 2);
	        n = n >> 1;
	        xBits.push(n % 2);
	        n = n >> 1;
	    }
	
	    for (i = 0; i < xBits.length; i++) {
	        x += (1 << i) * xBits[i];
	    }
	
	    for (i = 0; i < yBits.length; i++) {
	        y += (1 << i) * yBits[i];
	    }
	
	    return new SDPoint(x, y);
	};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Math_round.js
// Defines the Seadragon2.Math.round() method.

/*global SDMath */
/*jshint strict: false */

var

    // aliases to improve lookup perf and allow minification;
    // other parts of the Seadragon code can reference these also!
    SDMath_ceil = Math.ceil,
    SDMath_floor = Math.floor,

    /**
     *  Returns the given number rounded to the nearest multiple of the base.
     *  @method round
     *  @param {number} x The number to round.
     *  @param {number} threshold? A value in the range [0,1] that determines when to
     *  round up. The default value is 0.5 to mimic the behavior of Math.round(). A
     *  value closer to 0 makes rounding up more probable while a value closer to 1
     *  makes rounding down more probable.
     *  @param {number} by? The interval size to round to. Default value is 1, but
     *  Math.round(x, .5, 10) would round to the nearest 10, for example.
     *  @return {number} The result of rounding.
     */
    SDMath_round = SDMath.round = function (x, threshold, by) {
        // default values:
        if (typeof by === "undefined") {
            by = 1;
        }
        if (typeof threshold === "undefined") {
            threshold = 0.5;
        }
        
        // There are sometimes precision errors in the modulo operation.
        // e.g. 3.3 % 1 gives 0.2999999999999998, so when threshold=0.3,
        // this incorrectly floors insteads of ceils. we can maybe fix this by
        // deriving a difference and comparing that to an epsilon, but is that
        // really worth it here? 
        
        x /= by;
        
        // Note that we use the positive modulo so that negative numbers are
        // not treated differently.
        if (((x % 1) + 1) % 1 < threshold) {
            return SDMath_floor(x) * by;
        } else {
            return SDMath_ceil(x) * by;
        }
    };

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Uri.js
// Defines the Seadragon2.Uri class.

/*global SD */
/*jshint strict: false */

var

    /**
     *  A utility class for parsing URIs.
     *  @class Uri
     *  @private
     *  @namespace Seadragon2
     *  @static
     */
    SDUri = SD.Uri = {},
    
    /**
     *  The hostname reported for URIs having a file:// protocol. This is because
     *  browsers report an empty hostname for such URIs.
     *  @property FILE_HOSTNAME
     *  @final
     *  @type string
     *  @default localhost
     */
    SDUri_FILE_HOSTNAME = SDUri.FILE_HOSTNAME = "localhost",
    
    /**
     *  The hostname of the currently loaded page.
     *  @property PAGE_HOSTNAME
     *  @final
     *  @private
     *  @type string
     */
    SDUri_PAGE_HOSTNAME = location.hostname || SDUri_FILE_HOSTNAME,

    /**
     *  Parses and returns the hostname of the given URL. If the URL is relative,
     *  its hostname is considered to be the page's hostname. The returned hostname
     *  is always lowercase.
     *  @method getHostname
     *  @param {string} url The URL to parse.
     *  @return {string} The lowercase hostname of the given URL if it's absolute,
     *  otherwise the page's hostname.
     */
    SDUri_getHostname = SDUri.getHostname = function (url) {
        var hostnameMatch = /^http[s]?:\/\/([\w-.]+)/i.exec(url),
            fileMatch;  // don't automatically execute here, it's an edge case
        
        // case 1: it's an absolute http:// or https:// URL, extract the
        // hostname. make sure to lowercase it!
        if (hostnameMatch) {
            return hostnameMatch[1].toLowerCase();
        }
        
        // case 2: it's an absolute file:// URL, return non-empty hostname
        else if ((fileMatch = /^file:\/\//i.exec(url))) {
            return SDUri_FILE_HOSTNAME;
        }
        
        // case 3: it must be a relative URL, return page's hostname
        return SDUri_PAGE_HOSTNAME;
    };

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Xml.js
// Defines the Seadragon2.Xml class.

/*global SD */
/*jshint strict: false */

var

    /**
     *  A utility class for fetching and parsing XML.
     *  @class Xml
     *  @namespace Seadragon2
     *  @static
     */
    SDXml = SD.Xml = {};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Xml_fetch.js
// Defines the Seadragon2.Xml.fetch() method.

/*global SD, SDXml, SDDebug_warn, SDDebug_error, SDFunction_EMPTY, ActiveXObject, XDomainRequest */
/*jshint strict: false */

var

    /**
     *  If the browser supports asynchronous XML requests, asynchronously fetches
     *  the XML at the given URL, calling either the given success callback or the
     *  given failure callback on completion, and returns the browser-specific
     *  XmlHttpRequest object. Otherwise, does nothing and returns null.
     *  @method fetch
     *  @static
     *  @param {string} url The URL of the XML.
     *  @param {function} onSuccess The callback function to use when the XML is
     *  successfully fetched. It will be called with the XmlHttpRequest object set
     *  to "this".
     *  @param {function} onFailure The callback function to use when the XML is
     *  unsuccessfully fetched. It will be called with the XmlHttpRequest object set
     *  to "this".
     *  @param {string} postData Optional. If supplied, this function will do a POST
     *  instead of a GET, and the provided post data will be sent to the server.
     *  @param {string} mimeType Optional. If postData is supplied, then this function
     *  will set the Content-Type request header to the mimeType string if possible.
     *  @return {XmlHttpRequest} The browser-specific XmlHttpRequest object if the
     *  browser supports asynchronous XML requests and the XML is being fetched,
     *  otherwise null.
     */
    SDXml_fetch = SDXml.fetch = (function () {

        // using a closure so that we do the cross-browser (i.e. IE) checks
        // only and exactly once instead of on every request.

        // step 1: create a cross-browser (i.e. IE6) XmlHttpRequest constructor
        var ieOpts = ["Msxml2.XMLHTTP", "Microsoft.XMLHTTP", "Msxml3.XMLHTTP"],
            ieOpt, i, XhrObject, xhrArg,
            hasXDR = typeof XDomainRequest !== "undefined";

        // case 1: W3C standard object
        if (typeof XMLHttpRequest !== "undefined") {
            XhrObject = XMLHttpRequest;
        }

        // case 2: IE6 ActiveX object, but there are multiple options
        else if (typeof ActiveXObject !== "undefined") {
            for (i = 0; i < ieOpts.length; i++) {
                ieOpt = ieOpts[i];
                try {
                    /*jshint nonew: false */
                    new ActiveXObject(ieOpt);
                    /*jshint nonew: true */
                    XhrObject = ActiveXObject;
                    xhrArg = ieOpt;
                    break;
                } catch (e) {
                    SDDebug_warn("Seadragon2.Xml: {0} ActiveX failed.", ieOpt);
                }
            }

            // if no ActiveX worked, we'll fall through to the null function
            if (i >= ieOpts.length) {
                SDDebug_error("Seadragon2.Xml: no ActiveX worked.");
            }
        }

        // case 3: nothing!
        else {
            SDDebug_error("Seadragon2.Xml: no fetching ability.");
        }

        // if nothing, return empty function that signals no request is made
        if (!XhrObject) {
            return SDFunction_EMPTY;
        }

        // note how these functions' closures have no reference to XHR objects;
        // this prevents memory leaks in IE.
        function generateOnXhrReadyStateChange(onSuccess, onFailure) {
            return function () {
                // inside here, "this" refers to the calling XHR object.
                // readyState of 4 means complete
                if (this.readyState !== 4) {
                    return;
                }

                // according to "the" spec (and prototype.js documentation),
                // "success" is defined as empty status or 2xy status.
                // call the appropriate success or failure handler here.
                // Setting xhr to "this" instead of passing it as arg;
                // doing this only for convenience (SDNetwork handler).
                // this may need changing as we port this to other libraries.
                if (this.status === 0 ||
                    (this.status >= 200 && this.status < 300)) {
                    onSuccess.call(this);
                } else {
                    onFailure.call(this);
                }
            };
        }

        // step 2: return the function to actually make the request!
        return function (url, onSuccess, onFailure, postData, mimeType) {
            var xhr = new XhrObject(xhrArg),
                verb = postData ? "POST" : "GET",
                usingXdr = false;

            xhr.onreadystatechange =
                generateOnXhrReadyStateChange(onSuccess, onFailure);

            // remove the fragment, if any (for better caching, but also because
            // IE8- incorrectly send it to the server, resulting in a 404!).
            url = url.replace(/#.*/, '');

            try {
                xhr.open(verb, url, true);     // true for async
            } catch (e) {
                // one possible reason for an exception here is that the request
                // is cross-domain and we're running IE 8 or 9. In that case, we
                // must use XDomainRequest instead of XMLHttpRequest. Note that
                // we can't just use XDRs all the time, since they check the
                // Access-Control-Allow-Origin header even on same-origin requests.
                if (hasXDR) {
                    xhr = new XDomainRequest();
                    xhr.onload = onSuccess;
                    xhr.onerror = onFailure;
                    xhr.timeout = 30000;
                    xhr.ontimeout = function () {};
                    xhr.onprogress = function () {};
                    xhr.open(verb, url);
                    usingXdr = true;
                } else {
                    // we don't know what to do with this exception
                    throw e;
                }
            }

            if (postData && xhr.setRequestHeader) {
                xhr.setRequestHeader("Content-Type", mimeType || "text/plain");
            }

            // I have no clue whatsoever why this makes XDRs work right, but they fail
            // randomly if you don't put them on a new cycle of the event loop like this.
            if (usingXdr) {
                setTimeout(function(){
                    xhr.send(postData || null);     // null for no message body (e.g. POST data)
                }, 0);
            } else {
                xhr.send(postData || null);
            }

            return xhr;
        };

    }());

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Xml_parse.js
// Defines the Seadragon2.Xml.parse() method.

/*global SD, SDXml, SDDebug_error, SDFunction_EMPTY, DOMParser, ActiveXObject */
/*jshint strict: false */

var

    /**
     *  If the browser supports XML, parses the given XML string and returns the
     *  resulting XML Document object. If the browser does not support XML, or if
     *  the given XML string is not well-formed XML, returns null.
     *  @method parse
     *  @static
     *  @param {string} xml The XML string to parse.
     *  @return {XML Document} The resulting XML Document object if the browser
     *  supports XML and the XML was successfully parsed, otherwise null.
     */
    SDXml_parse = SDXml.parse = (function () {
        
        // using a closure so that we do the cross-browser (i.e. IE) checks
        // only and exactly once instead of on every call to this method.
        
        // parsing is very different across browsers (i.e. IE), so returning
        // entirely different functions depending on the browser.
        
        // case 1: W3C DOMParser object
        if (typeof DOMParser !== "undefined") {
            return function (xml) {
                var parser = new DOMParser(),
                    xmlDoc = parser.parseFromString(xml, "text/xml"),
                    xmlRoot = xmlDoc && xmlDoc.documentElement;
                
                // may still silently parse even if not well-formed, but the
                // parsed XML will be <parsererror> XML.
                if (!xmlRoot || xmlRoot.nodeName === "parsererror") {
                    return null;
                }
                
                return xmlDoc;
            };
        }
        
        // case 2: IE ActiveX object
        else if (typeof ActiveXObject !== "undefined") {
            return function (xml) {
                var xmlDoc = new ActiveXObject("Microsoft.XMLDOM");
                
                xmlDoc.async = false;
                
                // the loadXML() function returns true if successfully parsed,
                // otherwise false, e.g. not well-formed.
                return xmlDoc.loadXML(xml) && xmlDoc;
            };
        }
        
        // case 3: browser doesn't support parsing XML!
        // return empty function that does no parsing
        SDDebug_error("Seadragon2.Xml: no parsing ability.");
        return SDFunction_EMPTY;
        
    }());

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Element.js
// Defines the Seadragon2.Element class and its $() method.

/*global SD, window, innerWidth, innerHeight, SDMath_min, SDRect, SDBrowser_isIE8, document, SDSize,
 SDMath_max, getComputedStyle, SDDebug_error, SDPoint, SDPage_getScroll*/
/*jshint strict: false */

var

    /**
     *  A utility class for working with HTML elements.
     *  @class Element
     *  @namespace Seadragon2
     *  @static
     */
    SDElement = SD.Element = {},

    /**
     *  If the argument is a string, return the element with that ID.
     *  Otherwise, return the given element.
     *  @method $
     *  @static
     *  @param {string or HTMLElement} elmtOrId
     *  @return {HTMLElement} The requested element.
     */
    SDElement_$ = SDElement.$ = function (elmtOrId) {
        if (typeof elmtOrId === "string") {
            return document.getElementById(elmtOrId);
        }

        return elmtOrId;
    },

    /**
     * Returns a Rect object representing the current window's dimensions.
     * @method getWindowDimensions
     * @static
     * @return {Rect} The width and height of the window.
     */
    SDElement_getWindowDimensions = SDElement.getWindowDimensions = function () {
        // self mutating method, because we don't know what to do until the DOM is initialized,
        // so we wait until the first call to this method to do browser interop.
        if (typeof innerWidth !== "undefined") {
            // most browsers
            SDElement_getWindowDimensions = SDElement.getWindowDimensions = function () {
                return new SDRect(0, 0, innerWidth, innerHeight);
            };
        } else if (document.documentElement && document.documentElement.clientHeight) {
            // IE
            SDElement_getWindowDimensions = SDElement.getWindowDimensions = function () {
                var d = document.documentElement;
                return new SDRect(0, 0, d.clientWidth, d.clientHeight);
            };
        } else if (document.body.clientHeight) {
            // also IE
            SDElement_getWindowDimensions = SDElement.getWindowDimensions = function () {
                var b = document.body;
                return new SDRect(0, 0, b.clientWidth, b.clientHeight);
            };
        } else {
            // throw hands up in despair, report an absurdly large window
            SDElement_getWindowDimensions = SDElement.getWindowDimensions = function () {
                return new SDRect(0, 0, Infinity, Infinity);
            };
        }
        return SDElement_getWindowDimensions();
    },

    /**
     * Get the bounding rectangle of an element, in window coordinates,
     * as a Rect object.
     * @method getBoundingClientRect
     * @static
     * @param {HTMLElement} elmt
     */
    SDElement_getBoundingClientRect = SDElement.getBoundingClientRect = function (elmt) {
        var boundingRect = elmt.getBoundingClientRect();
        return new SDRect(
            boundingRect.left,
            boundingRect.top,
            boundingRect.right - boundingRect.left,
            boundingRect.bottom - boundingRect.top
        );
    },

    /**
     * Get an object containing the computed style of the given element.
     * @method getStyle
     * @static
     * @param {HTMLElement} elmt
     */
    SDElement_getStyle = SDElement.getStyle = function (elmt) {
        if (window.getComputedStyle) {
            return getComputedStyle(elmt, null);
        } else if (elmt.currentStyle) {
            return elmt.currentStyle;
        } else {
            SDDebug_error("Unknown element style, no known technique.");
        }
    },

    /**
     * Get the element's offsetParent, or the body element if the given element
     * is styled with position fixed.
     * @method getOffsetParent
     * @static
     * @param {HTMLElement} elmt
     * @param {boolean} isFixed
     */
    SDElement_getOffsetParent = SDElement.getOffsetParent = function (elmt, isFixed) {
        // IE and Opera "fixed" position elements don't have offset parents.
        // regardless, if it's fixed, its offset parent is the body.
        if (isFixed && elmt !== document.body) {
            return document.body;
        } else {
            return elmt.offsetParent;
        }
    },

    /**
     * Get the element's position with respect to the document.
     * @method getPosition
     * @static
     * @param {HTMLElement} elmt
     */
    SDElement_getPosition = SDElement.getPosition = function (elmt) {
        var result = new SDPoint();

        var isFixed = SDElement_getStyle(elmt).position === "fixed";
        var offsetParent = SDElement_getOffsetParent(elmt, isFixed);

        while (offsetParent) {
            result.x += elmt.offsetLeft;
            result.y += elmt.offsetTop;

            if (isFixed) {
                result = result.plus(SDPage_getScroll());
            }

            elmt = offsetParent;
            isFixed = SDElement_getStyle(elmt).position === "fixed";
            offsetParent = SDElement_getOffsetParent(elmt, isFixed);
        }

        return result;
    },

    /**
     * Returns a rectangle containing the clipping bounds that would keep the given element
     * entirely within the browser window. The returned rectangle's dimensions are relative
     * to the element's offset dimensions (including padding and border).
     * @method getClippingBounds
     * @static
     * @param {HTMLElement} elmt The element whose clipping bounds we are finding.
     * @return {Rect} The clipping bounds for the element, as a rectangle in pixel coordinates.
     */
    SDElement_getClippingBounds = SDElement.getClippingBounds = function (elmt, boundingRect, windowDimensions) {

        // parameters are used if passed in to save on recomputing them.
        // this also allows for clipping to objects other than the entire window.
        boundingRect = boundingRect || SDElement_getBoundingClientRect(elmt);
        windowDimensions = windowDimensions || SDElement_getWindowDimensions();

        var
            rectTop = boundingRect.y,
            rectRight = boundingRect.width + boundingRect.x,
            rectBottom = boundingRect.height + boundingRect.y,
            rectLeft = boundingRect.x,
            topEdge,
            leftEdge,
            width,
            height,
            windowLeft = windowDimensions.x,
            windowTop = windowDimensions.y,
            windowRight = windowLeft + windowDimensions.width,
            windowBottom = windowTop + windowDimensions.height;

        // define the viewable rectangle of the element
        topEdge = SDMath_max(0, windowTop - rectTop);
        leftEdge = SDMath_max(0, windowLeft - rectLeft);
        width = SDMath_min(rectRight, windowRight) - rectLeft - leftEdge;
        height = SDMath_min(rectBottom, windowBottom) - rectTop - topEdge;
        return new SDRect(leftEdge, topEdge, width, height);
    },

    /**
     * Set the opacity of the given HTML element.
     * @method setOpacity
     * @static
     * @param {HTMLElement} elmt The HTML element.
     * @param {number} opacity Its current opacity.
     */
    SDElement_setOpacity = SDElement.setOpacity = (function () {
        var temp = document.createElement("div");
        if (typeof temp.style.opacity !== "undefined") {
            // CSS3 way:
            return function (elmt, opacity) {
                elmt.style.opacity = opacity;
            };
        } else if (typeof temp.style.filter !== "undefined") {
            return function (elmt, opacity) {
                var filter = "progid:DXImageTransform.Microsoft.Alpha(Opacity=" + opacity * 100 + ")", children, i, n;
                elmt.style.filter = filter;
                children = elmt.children;
                n = children.length;
                // seems to not automatically apply opacity to children in IE8, so iterate over them:
                for (i = 0; i < n; i++) {
                    try {
                        SDElement_setOpacity(children[i], opacity);
                    } catch (e) {
                        // can't set opacity of comment node, just move on
                    }
                }
            };
        } else {
            return function () {
                // do nothing, since no known opacity is supported
            };
        }
    }()),

    // an object containing the constructors for any custom HTML elements that have been registered.
    // keys into this object are "sd_" + elementName, so if people wanted to use element names that
    // are default object properties like "constructor" or "__proto__" they'd be okay.
    SDElement_customElements = {},

    // save the original createElement function
    SDElement_dce = document.createElement,

    /**
     * Register a custom tag name so that document.createElement("name") will call the
     * given constructor instead of its usual method.
     * @method registerCustomElement
     * @static
     * @private
     * @param {string} name The name of the custom element
     * @param {function} constructor The constructor that creates the custom element
     */
    SDElement_registerCustomElement = function (name, constructor) {
        SDElement_customElements["sd_" + name] = constructor;

        // needed for IE8 and FF2 to work right
        SDElement_dce.call(document, name);
    },

    /**
     * Apply a move-and-scale transform to the element. This is similar to applying
     * the CSS transform:'translate(x, y) scale(scale)'. It is not
     * intended as a fully-featured replacement for CSS transforms, just a convenience
     * for a common operation while zooming HTML content. If the browser doesn't support
     * CSS transforms, we will attempt to reposition the content by setting older CSS
     * properties. The kind of content that can be resized in this way is very limited:
     * pretty much everything must be specified in em sizes so that it scales with its
     * container's font-size.
     * @method transform
     * @static
     * @param elmt {HTMLElement} the DOM element on which to apply the transform
     * @param x {number} the amount to translate the element right by, in its original pixel coordinates
     * @param y {number} the amount to translate the element down by, in its original pixel coordinates
     * @param scale {number} the ratio of the new size to original size, scaled around the element's top-left corner
     */
    SDElement_transform = SDElement.transform = (function () {
        var i,
            transformProperty,
            originProperty,
            transformStrings = [
                "MozTransform",
                "msTransform",
                "OTransform",
                "WebkitTransform",
                "transform"
            ],
            docElmtStyle = document.documentElement.style,
            translateUnit = "",
            result;

        for (i = transformStrings.length - 1; i >= 0; i--) {
            if (typeof docElmtStyle[transformStrings[i]] !== "undefined") {
                transformProperty = transformStrings[i];
                originProperty = transformProperty + "Origin";
                break;
            }
        }
        if (transformProperty === "MozTransform") {
            // firefox requires length properties for offset values
            translateUnit = "px";
        }

        // now that we've detected whether transforms are supported, modify the function.
        if (transformProperty) {
            result = function (elmt, x, y, scale) {
                var style = elmt.sdStyle;

                // only the first time, we must set the transform-origin. We'll use top left.
                // while we're at it, we can store a slightly quicker reference to the element's
                // style object.
                if (!style) {
                    style = elmt.sdStyle = elmt.style;
                    style[originProperty] = "0 0";
                }

                x = x + translateUnit;
                y = y + translateUnit;
                // we'll turn it into a matrix since that might be just slightly faster
                scale = scale + ",";
                style[transformProperty] = "matrix(" + scale + "0,0," + scale + x + "," + y + ")";
            };
        } else {
            result = function (elmt, x, y, scale) {
                var style = elmt.style;
                style.left = x + "px";
                style.top = y + "px";
                style.fontSize = scale + "em";
                style.width = (scale * 100) + "%";
                style.height = (scale * 100) + "%";
            };
        }

        return result;
    }());

// overwrite document.createElement with a function that suits our needs
document.createElement = function (name) {
    var constructor = SDElement_customElements["sd_" + name];
    if (constructor) {
        // we have a constructor for the requested custom element
        return new constructor();
    } else {
        // this is a standard HTML element
        return SDElement_dce.apply(this, arguments);
    }
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Event.js
// Defines the Seadragon2.Event class and its $() method.

/*global SD, event */
/*jshint strict: false */

var

    /*  To work around YUI doc putting M before _, we must redo these comments
     *  in the beginning of Event_addRemove.js.
     *  A utility class for working with DOM and custom events.
     *  @class Event
     *  @namespace Seadragon2
     *  @static
     */
    SDEvent = SD.Event = {},

    /*
     *  Given the argument to an event handler, retrieve the event object.
     *  @method $
     *  @static
     *  @param {Event} e? The argument passed to the event handler.
     *  @return {Event} The event that has been raised.
     */
    SDEvent_$ = SDEvent.$ = function (e) {
        // IE doesn't pass event objects to handlers; it instead saves them to
        // the global variable "event".
        // we would ideally just do "return e || event", but in non-IE browsers,
        // "event" may be undefined, throwing an error, so we explicitly check.
        return e ? e :
            typeof event !== "undefined" ? event : null;
    };

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Event.js
// Defines the Seadragon2.Event class.

/*global SDEvent, SDDebug_error, SDDebug_warn, SDFunction_EMPTY */
/*jshint strict: false */

var

    /**
     *  Fire an event at the given element.
     *  @method raise
     *  @static
     *  @param {Element} elmt The HTML element that will receive the event.
     *  @param {string} eventName The name of the event (without "on").
     *  @param {boolean} bubbles True to let the event bubble, on browsers that
     *  support it.
     *  @return {boolean} True if the event was fired.
     */
    SDEvent_raise = SDEvent.raise = (function () {
        
        // using a closure so that we do the cross-browser (i.e. IE) checks
        // only and exactly once instead of on every event add.
        
        // case 1: W3C standard method
        if (document.createEvent) {
            return function (elmt, eventName, bubbles) {
                bubbles = bubbles || false;
                var event = document.createEvent("HTMLEvents");
                event.initEvent(eventName, bubbles, true); // bubbles, cancelable
                return elmt.dispatchEvent(event);
            };
        }
        
        // case 2: IE method
        if (document.createEventObject) {
            return function (elmt, eventName) {
                var event = document.createEventObject();
                try {
                    return elmt.fireEvent("on" + eventName, event);
                } catch (e) {
                    // IE8 and below refuses to fire the following events programmatically:
                    // onabort onafterprint onbeforeprint onbeforeunload onbounce onchange
                    // onerror onfinish onhashchange onload onmessage onoffline ononline
                    // onreset onselect onselectionchange onstart onstop onsubmit onunload
                    SDDebug_warn("Event not fired: " + eventName + ". " + e.message);
                }
            };
        }
        
        // case 3: nothing to do, return empty function
        SDDebug_error("Seadragon2.Event: no raise ability.");
        return SDFunction_EMPTY;
        
    }());

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Event_cancelStop.js
// Defines the Seadragon2.Event.cancel() and stop() methods.

/*global SDEvent, SDEvent_$ */
/*jshint strict: false */

var

    /**
     *  Prevent the default action from happening on the given event.
     *  @method cancel
     *  @static
     *  @param {Event} event
     */
    SDEvent_cancel = function (event) {
        event = SDEvent_$(event);
        
        if (event.preventDefault) {
            event.preventDefault();     // W3C for preventing default
        }
        
        event.cancel = true;            // legacy for preventing default
        event.returnValue = false;      // IE for preventing default
    },

    /**
     *  Stop the given event from propagating any further.
     *  @method stop
     *  @static
     *  @param {Event} event
     */
    SDEvent_stop = function (event) {
        event = SDEvent_$(event);
        
        if (event.stopPropagation) {
            event.stopPropagation();    // W3C for stopping propagation
        }
        
        event.cancelBubble = true;      // IE for stopping propagation
    };

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Event_addRemove.js
// Defines the Seadragon2.Event.add() and remove() methods.

/*global SDEvent, SDDebug_error, SDFunction_EMPTY, event, attachEvent, detachEvent */
/*jshint strict: false */

// these comments are copied from Event.js, so that they YUI doc correctly.
/**
 *  A utility class for working with DOM and custom events.
 *  @class Event
 *  @namespace Seadragon2
 *  @static
 */
/**
 *  Given the argument to an event handler, retrieve the event object.
 *  @method $
 *  @static
 *  @param {Event} e? The argument passed to the event handler.
 *  @return {Event} The event that has been raised.
 */

var

    /**
     *  Add an event handler. In browsers that properly handle capture and
     *  bubble phases, the handler will go on the specified phase.
     *  @method add
     *  @static
     *  @param {Element} elmt The element on which to add a handler.
     *  @param {string} eventName The name of the event (without "on").
     *  @param {function} handler The function to call when the event is fired.
     *  @param {boolean} capture Whether to register on capture phase, in regular
     *  browsers, or whether to setCapture in old versions of IE (two completely
     *  different things, unfortunately). This argument is optional, defaulting to
     *  the more sensible bubble phase.
     */
    SDEvent_add = SDEvent.add = (function () {

        // using a closure so that we do the cross-browser (i.e. IE) checks
        // only and exactly once instead of on every event add.

        // note: addEventListener() and attachEvent() are both methods on the
        // elements themselves, but they're also methods on window, which means
        // that they're global variables, so we can check for them as such.

        // case 1: W3C standard method
        if (typeof addEventListener === "function") {
            return function (elmt, eventName, handler, capture) {
                capture = capture || false;
                elmt.addEventListener(eventName, handler, capture);

                // special cases for mouse wheel: W3C standard event name is
                // DOMMouseScroll, but opera uses same mousewheel name as IE.
                if (eventName === "mousewheel") {
                    elmt.addEventListener("DOMMouseScroll", handler, capture);
                } else if (eventName === "DOMMouseScroll") {
                    elmt.addEventListener("mousewheel", handler, capture);
                }
            };
        }

        // case 2: IE method
        // IE8 and below somehow think that this type is "object", not "function",
        // so we'll just check for existence.
        if (typeof attachEvent !== "undefined") {
            return function (elmt, eventName, handler, capture) {
                elmt.attachEvent("on" + eventName, handler);

                // special case for mouse wheel: IE uses mousewheel name.
                if (eventName === "DOMMouseScroll") {
                    elmt.attachEvent("onmousewheel", handler);
                }

                if (capture && elmt.setCapture) {
                    elmt.setCapture();
                }
            };
        }

        // case 3: nothing to do, return empty function
        SDDebug_error("Seadragon2.Event: no add ability.");
        return SDFunction_EMPTY;

    }()),

    /**
     *  Remove an event handler that was added with Event.add.
     *  @method remove
     *  @static
     *  @param {Element} elmt The HTML element.
     *  @param {string} eventName The name of the event (without "on").
     *  @param {function} handler The callback function to remove.
     *  @param {boolean} capture Whether the event handler was registered
     *  on the capture phase earlier, or (IE) whether to releaseCapture.
     */
    SDEvent_remove = SDEvent.remove = (function () {

        // using a closure so that we do the cross-browser (i.e. IE) checks
        // only and exactly once instead of on every event remove.

        // note: removeEventListener() and detachEvent() are both methods on the
        // elements themselves, but they're also methods on window, which means
        // that they're global variables, so we can check for them as such.

        // case 1: W3C standard method
        if (typeof removeEventListener === "function") {
            return function (elmt, eventName, handler, capture) {
                capture = capture || false;
                elmt.removeEventListener(eventName, handler, capture);

                // special cases for mouse wheel: W3C standard event name is
                // DOMMouseScroll, but opera uses same mousewheel name as IE.
                if (eventName === "mousewheel") {
                    elmt.removeEventListener("DOMMouseScroll", handler, capture);
                } else if (eventName === "DOMMouseScroll") {
                    elmt.removeEventListener("mousewheel", handler, capture);
                }
            };
        }

        // case 2: IE method
        if (typeof detachEvent !== "undefined") {
            return function (elmt, eventName, handler, capture) {
                elmt.detachEvent("on" + eventName, handler);

                // special case for mouse wheel: IE uses mousewheel name.
                if (eventName === "DOMMouseScroll") {
                    elmt.detachEvent("onmousewheel", handler);
                }

                if (capture && elmt.releaseCapture) {
                    elmt.releaseCapture();
                }
            };
        }

        // case 3: nothing to do, return empty function
        SDDebug_error("Seadragon2.Event: no remove ability.");
        return SDFunction_EMPTY;

    }());

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*jslint browser: true, onevar: true, undef: true, nomen: true, eqeqeq: true,
  plusplus: true, bitwise: true, regexp: true, immed: true */
/*global mozRequestAnimationFrame, webkitRequestAnimationFrame, msRequestAnimationFrame,
SDEvent_add, SDEvent_remove, SDDebug_warn, window, SD*/
/*jshint strict: false */

/**
 * A static timer that manages absolutely everything that needs to update per frame.
 * @class Timer
 * @namespace Seadragon2
 * @static
 */
/*jshint supernew: true */
var SDTimer = SD.Timer = new function () {
/*jshint supernew: false */
    var that = this,
        first = null,
        delay = 16,
        interval = null,
        mozTick,
        enable,
        disable,
        reqAnimFrame,
        canceling;

    // The tick function will get called on the interval.
    // Note: we're putting this function on a timer, so it will be called on the global object.
    function tick() {
        var cur,
            now = new Date().getTime(),
            retVal;
        for (cur = first; cur; cur = cur.next) {
            try {
                retVal = cur.callback(cur.arg, now);
            } catch (e) {
                SDDebug_warn("Exception caught in timer: " + e.message);
            }
            if (!retVal) {
                that.unregister(cur);
            }
        }
    }

    /**
     * Register a function to be called in this timer. The callback will be called
     * and passed two arguments: the provided argument, and the current time in milliseconds.
     * The callback function must return true to stay on the timer, or false to be removed
     * from the timer. The timer makes no guarantee of what order various callbacks will be invoked,
     * but does guarantee fairness.
     * @method register
     * @static
     * @param callback {function} the function to be called
     * @param arg {object} an argument to be passed to the callback
     * @return {object} a token that can be passed to the unregister method
     */
    this.register = function (callback, arg) {
        // create an object containing the callback function and its parameter
        var obj = {callback: callback, arg: arg};

        // push the animation function onto the stack
        obj.next = first;
        if (first) {
            first.prev = obj;
        }
        obj.prev = null;
        first = obj;

        // now that something is registered, make sure the timer is on.
        enable();

        // return the object as a token, which could later be passed to this.unregister
        return obj;
    };

    /**
     * Unregister a previously registered task.
     * @method unregister
     * @static
     * @param obj {object} the token that was returned from a previous call to register().
     */
    this.unregister = function (obj) {
        // check whether it was already unregistered
        if (obj.dead) {
            return;
        }

        // remove the animation function from the stack
        if (obj.next) {
            obj.next.prev = obj.prev;
        }
        if (obj.prev) {
            obj.prev.next = obj.next;
        } else {
            first = obj.next;
        }

        // if nothing is registered, don't bother running the timer.
        if (!first) {
            disable();
        }

        // remember that we already unregistered this, in case somebody tries to again
        obj.dead = true;
    };

    // Firefox offers an awesome way to sync with screen repaints, so we'll use
    // it if available. Now Chrome and IE10 have it too.
    if (typeof requestAnimationFrame === "function") {
        reqAnimFrame = requestAnimationFrame;
    } else if (typeof mozRequestAnimationFrame === "function") {
        reqAnimFrame = mozRequestAnimationFrame;
    } else if (typeof webkitRequestAnimationFrame === "function") {
        reqAnimFrame = webkitRequestAnimationFrame;
    } else if (typeof msRequestAnimationFrame === "function") {
        reqAnimFrame = msRequestAnimationFrame;
    }

    if (reqAnimFrame) {
        mozTick = function () {
            if (canceling) {
                canceling = false;
                interval = null;
                return;
            }

            // although requestAnimationFrame passes us a timestamp, we'll ignore it
            // because in IE10 the timestamp has nothing to do with the current unix time,
            // which causes dangerous issues elsewhere in code that assumes consistent
            // time sources.

            tick();
            reqAnimFrame(mozTick);
        };

        enable = function () {
            canceling = false;
            if (!interval) {
                interval = true;
                reqAnimFrame(mozTick);
            }
        };

        disable = function () {
            if (interval) {
                canceling = true;
            }
        };
    } else {

        enable = function () {
            if (interval === null) {
                interval = setInterval(tick, delay);
            }
        };

        disable = function () {
            if (interval !== null) {
                clearInterval(interval);
                interval = null;
            }
        };
    }
}();

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*global SD, SDDebug_warn, window*/
/*jshint strict: false */

/**
 * <p>A simple class with some methods for listening for and triggering events.
 * Classes may wish to extend this by calling it in their constructors.</p>
 * <p>The intended usage is that other objects will listen for events by calling
 * addListener, and the object itself will raise those events by calling its own
 * trigger method. Other uses are possible though.</p>
 * @class EventManager
 * @namespace Seadragon2
 * @constructor
 */
var SDEventManager = SD.EventManager = function () {

    // Fields

    var listeners = {}; // dictionary of eventName --> array of handlers

    // Methods

    /**
     * <p>Bind the given handler function to the named event.</p>
     * <p>Unlike DOM event handlers, it is possible
     * to register the same function twice for the same event. Removing it will then
     * remove only the first reference. Since this element isn't in the DOM and
     * isn't necessarily attached to any tree structure, we don't have to deal with
     * capturing/bubbling behavior.</p>
     * @method addListener
     * @param eventName {string}
     * @param handler {function}
     */
    this.addListener = function (eventName, handler) {
        if (typeof handler !== "function") {
            return;
        }

        if (!listeners.hasOwnProperty(eventName)) {
            listeners[eventName] = [];
        }

        listeners[eventName].push(handler);
    };

    /**
     * Remove the given handler function from the named event.
     * @method removeListener
     * @param eventName {string}
     * @param handler {function}
     */
    this.removeListener = function (eventName, handler) {
        var handlers = listeners[eventName];

        if (typeof handler !== "function" || !handlers) {
            return;
        }

        var i, n = handlers.length;
        for (i = 0; i < n; i++) {
            if (handler === handlers[i]) {
                handlers.splice(i, 1);
                return;
            }
        }
    };

    /**
     * Remove all listeners for the named event.
     * @method clearListeners
     * @param eventName {string}
     */
    this.clearListeners = function (eventName) {
        if (listeners.hasOwnProperty(eventName)) {
            delete listeners[eventName];
        }
    };

    /**
     * Get an array containing all listeners for the named event.
     * @method listListeners
     * @param eventName {string}
     */
    this.listListeners = function (eventName) {
        if (listeners.hasOwnProperty(eventName)) {
			var list = listeners[eventName];
			if (list && list.length) {
				// return a copy
				return list.slice(0);
			}
        }
    };

    /**
     * Call all registered handlers for the named event. They will
     * be called in the order they were added, with the given arguments.
     * @method trigger
     * @param eventName {string}
     * @param arguments {object...}
     */
    this.trigger = function (eventName) {
        var handlers = listeners[eventName];
        var args = [].slice.call(arguments, 1);

        if (!handlers) {
            return;
        }
        
        // copy the handlers array in case it is modified by one of the handlers
        handlers = handlers.slice(0);

        var i, n = handlers.length;
        for (i = 0; i < n; i++) {
            try {
                handlers[i].apply(window, args);
            } catch (e) {
                // handler threw an error, ignore, go on to next one
                SDDebug_warn(e.name + " while executing " + eventName +
                        " handler: " + e.message, e);
            }
        }
    };

};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*global Seadragon2, SD, SDPoint, SDBrowser_isFF, SDDebug_error*/
/*jshint strict: false */

/**
 * A utility class to deal with mouse input.
 * @class Mouse
 * @namespace Seadragon2
 * @static
 */
var SDMouse = SD.Mouse = {};

/**
 * Get the mouse position, relative to the document.
 * @method getPosition
 * @static
 * @param event {MouseEvent} the current mouse event.
 * @return {Seadragon2.Point} of the mouse's X and Y position.
 */
var SDMouse_getPosition = SDMouse.getPosition = function (event) {
    var result = new SDPoint();
    
    if (event.type === "DOMMouseScroll" &&
            SDBrowser_isFF < 3) {
        // hack for FF2 which reports incorrect position for mouse scroll
        result.x = event.screenX;
        result.y = event.screenY;
    } else if (typeof event.pageX === "number") {
        result.x = event.pageX;
        result.y = event.pageY;
    } else if (typeof event.clientX === "number") {
        result.x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
        result.y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
    } else {
        SDDebug_error("Unknown event mouse position, no known technique.");
    }

    return result;
};

/**
 * Get the scroll direction of a mouse wheel event.
 * @method getScroll
 * @static
 * @param event {WheelEvent} the current mouse wheel event
 * @return {number} -1, 0, or 1, depending on the scroll direction.
 */
var SDMouse_getScroll = SDMouse.getScroll = function (event) {
    var delta = 0; // default value
    
    if (typeof event.wheelDelta === "number") {
        delta = event.wheelDelta;
    } else if (typeof event.detail === "number") {
        delta = -event.detail;
    } else {
        Seadragon2.Debug.fail("Unknown event mouse scroll, no known technique.");
    }
    
    // normalize value to [-1, 1]
    return delta ? delta / Math.abs(delta) : 0;
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*global SDPoint, window, pageXOffset, pageYOffset*/
/*jshint strict: false */

/**
 * A utility class for working with HTML pages.
 * @class Page
 * @namespace Seadragon2
 * @static
 * @private
 */

/**
 * Get the current left and top scroll offset of the document.
 * @method getScroll
 * @static
 * @return {Seadragon2.Point} the page's X and Y offsets.
 */
function SDPage_getScroll() {
    var result = new SDPoint(),
        docElmt = document.documentElement || {},
        body = document.body || {};
    
    if (typeof window.pageXOffset === "number") {
        // most browsers
        result.x = pageXOffset;
        result.y = pageYOffset;
    } else if (body.scrollLeft || body.scrollTop) {
        // W3C spec, IE6+ in quirks mode
        result.x = body.scrollLeft;
        result.y = body.scrollTop;
    } else if (docElmt.scrollLeft || docElmt.scrollTop) {
        // IE6+ in standards mode
        result.x = docElmt.scrollLeft;
        result.y = docElmt.scrollTop;
    }
    
    // note: we specifically aren't testing for typeof here, because IE sets
    // the appropriate variables undefined instead of 0 under certain
    // conditions. this means we also shouldn't fail if none of the three
    // cases are hit; we'll just assume the page scroll is 0.
    
    return result;
}

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*global SD, SDDebug_warn, addEventListener, SDMouse_getPosition, SDElement_getPosition, SDEvent_add, window, SDEvent_remove, SDEvent_cancel, SDEvent_stop, SDMouse_getScroll, SDEventManager*/
/*jshint strict: false */

(function () {

    // DUPLICATION CHECK -- necessary here because of private static state
    if (SD.MouseTracker) {
        return;
    }

    // Constants

    // update: IE9 implements the W3C standard event model! =)
    var lteIE8 = typeof addEventListener !== "function",

    // Static fields

        buttonDownAny = false,

        mousedown,
        mouseup,
        mouseover,
        mouseout,
        mousemove,

        ieCapturingAny = false,
        ieTrackersActive = {},      // dictionary from hash to MouseTracker
        ieTrackersCapturing = [];   // list of trackers interested in capture

    // Choose appropriate event names for the platform
    if (navigator.msPointerEnabled) {
        mousedown = "MSPointerDown";
        mouseup = "MSPointerUp";
        mouseover = "MSPointerOver";
        mouseout = "MSPointerOut";
        mousemove = "MSPointerMove";
    } else {
        mousedown = "mousedown";
        mouseup = "mouseup";
        mouseover = "mouseover";
        mouseout = "mouseout";
        mousemove = "mousemove";
    }

    // Static helpers

    function getMouseAbsolute(event) {
        return SDMouse_getPosition(event);
    }

    function getMouseRelative(event, elmt) {
        var mouse = SDMouse_getPosition(event),
            offset = SDElement_getPosition(elmt);

        return mouse.minus(offset);
    }

    /*
     * Returns true if elmtB is a child node of elmtA, or if they're equal.
     */
    function isChild(elmtA, elmtB) {
        var body = document.body;
        while (elmtB && elmtA !== elmtB && body !== elmtB) {
            try {
                elmtB = elmtB.parentNode;
            } catch (e) {
                // Firefox sometimes fires events for XUL elements, which throws
                // a "permission denied" error. so this is not a child.
                return false;
            }
        }
        return elmtA === elmtB;
    }

    function onGlobalMouseDown() {
        buttonDownAny = true;
    }

    function onGlobalMouseUp() {
        buttonDownAny = false;
    }

    // the W3C event model lets us listen to the capture phase of events, so
    // to know if the mouse is globally up or down, we'll listen to the
    // capture phase of the window's events. we can't do this in IE, so
    // we'll give it a best effort by listening to the regular bubble phase,
    // and on the document since window isn't legal in IE for mouse events.
    if (lteIE8) {
        SDEvent_add(document, mousedown, onGlobalMouseDown, false);
        SDEvent_add(document, mouseup, onGlobalMouseUp, false);
    } else {
        SDEvent_add(window, mousedown, onGlobalMouseDown, true);
        SDEvent_add(window, mouseup, onGlobalMouseUp, true);
    }

    // Class

    /**
     * A mouse tracker, which listens for mouse events on the given element
     * and raises custom events which have been sanitized to avoid browser
     * incompatibilities. Events that will be raised:
     * <dl>
     * <dt>enter</dt><dd>function(tracker, id, position, buttonDownElmt, buttonDownAny)</dd>
     * <dt>exit</dt><dd>function(tracker, id, position, buttonDownElmt, buttonDownAny)</dd>
     * <dt>press</dt><dd>function(tracker, id, position)</dd>
     * <dt>release</dt><dd>function(tracker, id, position, insideElmtPress, insideElmtRelease)</dd>
     * <dt>click</dt><dd>function(tracker, id, position, quick, shift, isInputElmt)</dd>
     * <dt>drag</dt><dd>function(tracker, id, position, delta, shift)</dd>
     * <dt>scroll</dt><dd>function(tracker, position, scroll, shift)</dd>
     * </dl>
     * @class MouseTracker
     * @namespace Seadragon2
     * @extends Seadragon2.EventManager
     * @constructor
     * @param elmt {HTMLElement} the element on which this mouse tracker must
     * listen for input
     * @param options {object?} may contain:
     * <dl>
     * <dt>clickTimeThreshold</dt>
     * <dd>number - the maximum time between mousedown and mouseup to count as
     * a click event</dd>
     * <dt>clickDistThreshold</dt>
     * <dd>number - the maximum number of pixels the pointer may move between
     * mousedown and mouseup to count as a click event</dd>
     * </dl>
     */
    SD.MouseTracker = function (elmt, options) {
        options = options || {};

        // Fields

        var self = this,
            ieSelf,

            hash = Math.random(),     // a unique hash for this tracker

            tracking = false,
            capturing = 0,
            buttonDownElmt = {},
            insideElmt = {},

            lastPoint = {},           // position of last mouse down/move
            lastMouseDownTime = {},   // time of last mouse down
            lastMouseDownPoint = {},  // position of last mouse down

            // a list of tag names we want to ignore click events for, since
            // these mouse trackers will often be used on HTML content.
            ignorables = {
                A: 1,
                INPUT: 1,
                TEXTAREA: 1,
                SELECT: 1,
                OPTION: 1,
                OPTGROUP: 1,
                BUTTON: 1,
                LABEL: 1
            },

            // Config options

            clickTimeThreshold = options.clickTimeThreshold || 500,
            clickDistThreshold = options.clickDistThreshold || 5;

        // Properties

        this.target = elmt;

        // IE-specific helpers

        function triggerOthers(eventName, event) {
            // update: protecting against properties added to the Object class's
            // prototype, which can and does happen (e.g. through js libraries)
            var trackers = ieTrackersActive,
                otherHash;
            for (otherHash in trackers) {
                if (trackers.hasOwnProperty(otherHash) && hash !== otherHash) {
                    trackers[otherHash][eventName](event);
                }
            }
        }

        function hasMouse() {
            var prop;
            for (prop in insideElmt) {
                if (insideElmt.hasOwnProperty(prop) && insideElmt[prop]) {
                    return true;
                }
            }
            return false;
        }

        // Listeners

        function onMouseOver(event) {
            event = event || window.event;

            // IE capturing model doesn't raise or bubble the events on any
            // other element if we're capturing currently. so pass this event to
            // other elements being tracked so they can adjust if the element
            // was from them or from a child. however, IE seems to always fire
            // events originating from parents to those parents, so don't double
            // fire the event if the event originated from a parent.
            if (lteIE8 && capturing && !isChild(event.srcElement, elmt)) {
                triggerOthers("onMouseOver", event);
            }

            // similar to onMouseOut() tricky bubbling case...
            var to = event.target || event.srcElement,
                from = event.relatedTarget || event.fromElement,
                id = event.pointerId || 0;
            if (!isChild(elmt, to) || isChild(elmt, from)) {
                // the mouseover needs to end on this or a child node, and it
                // needs to start from this or an outer node.
                return;
            }

            insideElmt[id] = true;

            self.trigger("enter", self, id, getMouseRelative(event, elmt),
                !!buttonDownElmt[id], buttonDownAny);
        }

        function onMouseOut(event) {
            event = event || window.event;

            // similar to onMouseOver() case for IE capture model
            if (lteIE8 && capturing && !isChild(event.srcElement, elmt)) {
                triggerOthers("onMouseOut", event);
            }

            // we have to watch out for a tricky case: a mouseout occurs on a
            // child element, but the mouse is still inside the parent element.
            // the mouseout event will bubble up to us. this happens in all
            // browsers, so we need to correct for this.
            var from = event.target || event.srcElement,
                to = event.relatedTarget || event.toElement,
                id = event.pointerId || 0;
            if (!isChild(elmt, from) || isChild(elmt, to)) {
                // the mouseout needs to start from this or a child node, and it
                // needs to end on this or an outer node.
                return;
            }

            insideElmt[id] = false;

            self.trigger("exit", self, id, getMouseRelative(event, elmt),
                !!buttonDownElmt[id], buttonDownAny);
        }

        function onMouseDown(event) {
            event = event || window.event;

            // don't consider right-clicks (fortunately this is cross-browser)
            if (event.button === 2) {
                return;
            }

            var id = event.pointerId || 0;
            buttonDownElmt[id] = true;

            // this shouldn't be necessary, but experience suggests that Chrome
            // doesn't always fire the mouseover event when we'd expect it to.
            // since the user is clicking inside the element, the mouse must have
            // gotten here somehow.
            insideElmt[id] = true;

            lastMouseDownPoint[id] = lastPoint[id] = getMouseAbsolute(event);
            lastMouseDownTime[id] = new Date().getTime();

            self.trigger("press", self, id, getMouseRelative(event, elmt));

            if (self.listListeners("press") || self.listListeners("drag")) {
                // if a press or drag handler is registered, don't drag-drop images, etc.
                SDEvent_cancel(event);
            }

            if (!lteIE8 || !ieCapturingAny) {
                captureMouse();
                ieCapturingAny = true;
                ieTrackersCapturing = [ieSelf];     // reset to empty & add us
            } else if (lteIE8) {
                ieTrackersCapturing.push(ieSelf);   // add us to the list
            }
        }

        function handleMouseClick(event) {
            event = event || window.event;

            // don't consider right-clicks (fortunately this is cross-browser)
            if (event.button === 2) {
                return;
            }

            var id = event.pointerId || 0,
                time = new Date().getTime() - lastMouseDownTime[id],
                point = getMouseAbsolute(event),
                distance = lastMouseDownPoint[id].distanceTo(point),
                quick = time <= clickTimeThreshold &&
                    distance <= clickDistThreshold,
                target = event.target,
                body = document.body,
                isInputElmt = false;

            for (target = event.target; target && target !== elmt && target !== body; target = target.parentNode) {
                if (ignorables.hasOwnProperty(target.tagName)) {
                    // the user is interacting with some sort of input element; most apps will want to ignore this click.
                    isInputElmt = true;
                }
            }

            self.trigger("click", self, id, getMouseRelative(event, elmt),
                quick, event.shiftKey, isInputElmt);
        }

        function onMouseUp(event) {
            event = event || window.event;
            var id = event.pointerId || 0,
                insideElmtPress = !!buttonDownElmt[id],
                insideElmtRelease = !!insideElmt[id];

            // don't consider right-clicks (fortunately this is cross-browser)
            if (event.button === 2) {
                return;
            }

            buttonDownElmt[id] = false;

            self.trigger("release", self, id, getMouseRelative(event, elmt),
                insideElmtPress, insideElmtRelease);

            // some browsers sometimes don't fire click events when we're also
            // listening for mouseup events. i'm not sure why, it could be
            // something i'm doing. in the meantime, this is a temporary fix.
            if (insideElmtPress && insideElmtRelease) {
                handleMouseClick(event);
            }
        }

        /*
         * Only triggered once by the deepest element that initially received
         * the mouse down event. We want to make sure THIS event doesn't bubble.
         * Instead, we want to trigger the elements that initially received the
         * mouse down event (including this one) only if the mouse is no longer
         * inside them. Then, we want to release capture, and emulate a regular
         * mouseup on the event that this event was meant for.
         */
        function onMouseUpIE(event) {
            event = event || window.event;
            var i, tracker;

            // don't consider right-clicks (fortunately this is cross-browser)
            if (event.button === 2) {
                return;
            }

            // first trigger those that were capturing
            for (i = 0; i < ieTrackersCapturing.length; i++) {
                tracker = ieTrackersCapturing[i];
                if (!tracker.hasMouse()) {
                    tracker.onMouseUp(event);
                }
            }

            // then release capture and emulate a regular event
            releaseMouse();
            ieCapturingAny = false;
            event.srcElement.fireEvent("on" + event.type,
                document.createEventObject(event));

            // make sure to stop this event -- shouldn't bubble up
            SDEvent_stop(event);
        }

        /*
         * Only triggered in W3C browsers by elements within which the mouse was
         * initially pressed, since they are now listening to the window for
         * mouseup during the capture phase. We shouldn't handle the mouseup
         * here if the mouse is still inside this element, since the regular
         * mouseup handler will still fire.
         */
        function onMouseUpWindow(event) {
            if (!insideElmt[event.pointerId || 0]) {
                onMouseUp(event);
            }

            releaseMouse();
        }

        function onMouseMove(event) {
            event = event || window.event;
            var id = event.pointerId || 0,
                point = getMouseAbsolute(event),
                delta = point.minus(lastPoint[id] || point);

            lastPoint[id] = point;

            if (delta.x || delta.y) {
                self.trigger("drag", self, id, getMouseRelative(event, elmt),
                    delta, event.shiftKey);
            }

            if (self.listListeners("drag")) {
                // since a drag handler was registered, don't allow highlighting, etc.
                SDEvent_cancel(event);
            }
        }

        /*
         * Only triggered once by the deepest element that initially received
         * the mouse down event. Since no other element has captured the mouse,
         * we want to trigger the elements that initially received the mouse
         * down event (including this one).
         */
        function onMouseMoveIE(event) {
            // manually trigger those that are capturing
            var i;
            for (i = 0; i < ieTrackersCapturing.length; i++) {
                ieTrackersCapturing[i].onMouseMove(event);
            }

            // make sure to stop this event -- shouldn't bubble up. note that at
            // the time of this writing, there is no harm in letting it bubble,
            // but a minor change to our implementation would necessitate this.
            SDEvent_stop(event);
        }

        function onMouseScroll(event) {
            event = event || window.event;
            var delta = SDMouse_getScroll(event);

            // FF2 and FF3/Mac (possibly others) seem to sometimes fire
            // extraneous scroll events. check for those.
            if (delta) {
                self.trigger("scroll", self, getMouseRelative(event, elmt),
                    delta, event.shiftKey);
            }

            if (self.listListeners("scroll")) {
                // since a scroll handler was registered, don't scroll the page, etc.
                SDEvent_cancel(event);
            }
        }

        // Helpers

        function startTracking() {
            if (!tracking) {
                SDEvent_add(elmt, mouseover, onMouseOver, false);
                SDEvent_add(elmt, mouseout, onMouseOut, false);
                SDEvent_add(elmt, mousedown, onMouseDown, false);
                SDEvent_add(elmt, mouseup, onMouseUp, false);
                SDEvent_add(elmt, "mousewheel", onMouseScroll, false);

                tracking = true;
                ieTrackersActive[hash] = ieSelf;
            }
        }

        function stopTracking() {
            if (tracking) {
                SDEvent_remove(elmt, mouseover, onMouseOver, false);
                SDEvent_remove(elmt, mouseout, onMouseOut, false);
                SDEvent_remove(elmt, mousedown, onMouseDown, false);
                SDEvent_remove(elmt, mouseup, onMouseUp, false);
                SDEvent_remove(elmt, "mousewheel", onMouseScroll, false);

                while (capturing) {
                    releaseMouse();
                }
                tracking = false;
                delete ieTrackersActive[hash];
            }
        }

        function captureMouse() {
            if (!capturing) {
                // IE lets the element capture the mouse directly, but other
                // browsers use the capture phase on the highest element.
                if (lteIE8) {
                    // we need to capture the mouse, but we also don't want to
                    // handle mouseup like normally (special case for bubbling)
                    SDEvent_remove(elmt, mouseup, onMouseUp, false);
                    SDEvent_add(elmt, mouseup, onMouseUpIE, true);
                    SDEvent_add(elmt, mousemove, onMouseMoveIE, true);
                } else {
                    SDEvent_add(window, mouseup, onMouseUpWindow, true);
                    SDEvent_add(window, mousemove, onMouseMove, true);
                }
            }
            ++capturing;
        }

        function releaseMouse() {
            if (capturing === 1) {
                // similar reasoning as captureMouse()
                if (lteIE8) {
                    // we need to release the mouse, and also go back to handling
                    // mouseup like normal (no longer a hack for capture phase)
                    SDEvent_remove(elmt, mousemove, onMouseMoveIE, true);
                    SDEvent_remove(elmt, mouseup, onMouseUpIE, true);
                    SDEvent_add(elmt, mouseup, onMouseUp, false);
                } else {
                    SDEvent_remove(window, mousemove, onMouseMove, true);
                    SDEvent_remove(window, mouseup, onMouseUpWindow, true);
                }
            }
            --capturing;
        }

        // constructor

        ieSelf = {
            hasMouse: hasMouse,
            onMouseOver: onMouseOver,
            onMouseOut: onMouseOut,
            onMouseUp: onMouseUp,
            onMouseMove: onMouseMove
        };

        // inherit from EventManager, since we'll trigger named events
        SDEventManager.call(this);

        // Methods

        /**
         * Returns true if this mouse tracker is currently active.
         * @method isTracking
         * @return {boolean}
         */
        this.isTracking = function () {
            return tracking;
        };

        /**
         * Enable or disable tracking the mouse.
         * @method setTracking
         * @param track {boolean}
         */
        this.setTracking = function (track) {
            if (track) {
                startTracking();
            } else {
                stopTracking();
            }
        };

    };

}());

var SDMouseTracker = SD.MouseTracker;

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

// Spring.js
// Defines the Seadragon2.Spring constructor.

/*global SD, SDMath_exp */
/*jshint strict: false */

/**
 * A class containing methods to calculate springy transforms.
 * @class Spring
 * @namespace Seadragon2
 * @constructor
 * @param {object} options (optional) Can contain any of:
 * <dl>
 * <dt>initialValue</dt><dd>number - starting spring value, default is 0</dd>
 * <dt>stiffness</dt><dd>springiness - positive number, 5 is default</dd>
 * <dt>animationTime</dt><dd>time (in seconds) to complete an animation, default 1.5</dd>
 * <dt>decayTime</dt><dd>time (in seconds) to come to rest when tossed, default 1</dd>
 * </dl>
 */
var SDSpring = SD.Spring = function (options) {
    options = options || {};
    
    // Fields
    
    var currentValue = options.initialValue || 0,
        stiffness = options.stiffness || 5,
        springDivisor = 1 - SDMath_exp(-stiffness),
        animationTime = options.animationTime || 1.5,
        decayTime = options.decayTime || 1,
        startValue = currentValue,
        targetValue = currentValue,
    
        currentTime = new Date().getTime(), // always work in milliseconds
        startTime = currentTime,
        targetTime = currentTime,
        
        velocity = 0,
        sliding = false,
        friction; // units of distance / (ms)^2
    
    // Helpers
    
    /*
     * Transform from linear [0,1] to spring [0,1].
     */
    function transform(x) {
        return (1.0 - SDMath_exp(-x * stiffness)) / springDivisor;
    }
    
    // Methods
    
    /**
     * Get the current value of this spring.
     * @method getCurrent
     * @return {number}
     */
    this.getCurrent = function () {
        return currentValue;
    };
    
    /**
     * Get the value toward which this spring is moving.
     * @method getTarget
     * @return {number}
     */
    this.getTarget = function () {
        return targetValue;
    };
    
    /**
     * Change the value of this spring immediately upon the next update.
     * @method resetTo
     * @param target {number}
     */
    this.resetTo = function (target) {
        sliding = false;
        targetValue = target;
        targetTime = currentTime;
        startValue = targetValue;
        startTime = targetTime;
    };
    
    /**
     * Animate this spring toward the given destination value.
     * @method springTo
     * @param target {number}
     */
    this.springTo = function (target) {
        sliding = false;
        startValue = currentValue;
        startTime = currentTime;
        targetValue = target;
        targetTime = startTime + 1000 * animationTime;
    };
    
    /**
     * Shift both the start and end points for the current transition by
     * the given amount.
     * @method shiftBy
     * @param delta {number}
     */
    this.shiftBy = function (delta) {
        startValue += delta;
        targetValue += delta;
    };
    
    /**
     * Allow the spring to begin sliding in its current direction. It will
     * come to rest after the specified decay time.
     * @method toss
     */
    this.toss = function () {
        friction = Math.abs(velocity / (1000 * decayTime));
        sliding = true;
    };
    
    /**
     * Make the spring start acting springy again, after being tossed.
     * It will no longer slide with momentum. It is usually not necessary
     * to call this method, because sliding will stop immediately any time
     * you call springTo or resetTo.
     * @method grab
     */
    this.grab = function () {
        sliding = false;
    };
    
    /**
     * Update the current position of the spring along the springy path between
     * its start point and its target point, or, if the spring is sliding, allow
     * it to continue in the same direction with deceleration. This method is the
     * only one that will directly modify the current value of the spring, so it
     * must be called periodically to move the spring.
     * @method update
     * @param now {number} (optional) The current time in milliseconds.
     * @return {bool} whether the spring is currently sliding.
     */
    this.update = function (now) {
        var lastTime = currentTime,
            lastValue = currentValue,
            timeChange,
            vWeight;
        currentTime = now || new Date().getTime();
        timeChange = currentTime - lastTime;
        if (sliding) {
            // apply frictional deceleration
            if (velocity > 0) {
                velocity -= friction * timeChange;
                if (velocity < 0) {
                    velocity = 0;
                }
            } else if (velocity < 0) {
                velocity += friction * timeChange;
                if (velocity > 0) {
                    velocity = 0;
                }
            }
            
            currentValue += velocity * timeChange;
            targetValue = currentValue;
        } else {
            currentValue = (currentTime >= targetTime) ? targetValue :
                startValue + (targetValue - startValue) *
                transform((currentTime - startTime) / (targetTime - startTime));

            // make a running average of recent velocity, weighting
            // more recent history more strongly.
            if (timeChange) {
                vWeight = SDMath_exp(-timeChange / 40); // TODO this constant should be configurable
                velocity = vWeight * velocity + (1 - vWeight) * (currentValue - lastValue) / timeChange;
            }
        }
        return sliding;
    };
    
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*global SD*/
/*jshint strict: false */

/**
 * A ZoomContainer for SVG content. It adjusts the top element's transform so that
 * existing content gets moved appropriately.
 * @class SVGZoomContainer
 * @namespace Seadragon2
 * @constructor
 * @param container {SVGSVGElement} the top-level SVG element
 */
var SDSVGZoomContainer = SD.SVGZoomContainer = function (container) {
    
    /**
     * Change the SVG content's viewBox to fit the given bounds.
     * @method update
     * @param bounds {SDRect} The bounds (in content coordinates) of what is showing
     */
    this.update = function (bounds) {
        container.setAttribute("viewBox", [bounds.x, bounds.y, bounds.width, bounds.height].join(" "));
    };
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*global SD, SDPoint, SDElement_transform*/
/*jshint strict: false */

/**
 * A ZoomContainer for HTML content. It provides zooming capabilities for HTML markup.
 * @class HTMLZoomContainer
 * @namespace Seadragon2
 * @constructor
 * @param container {HTMLElement} The container element. This element must be block-level,
 * positioned with something other than position:static, and have overflow hidden.
 */
var SDHTMLZoomContainer = SD.HTMLZoomContainer = function (container) {
    // we need to make a sub-container to hold all of this container's contents,
    // so that we can move around a single object with CSS.
    var subContainer = document.createElement("div"),
        subContainerStyle = subContainer.style,
        sizeRatio = 1,
        lastBounds,
        lastZoom;

    (function () {
        var cur;

        // set up the new container to fill the original one
        subContainerStyle.width = "100%";
        subContainerStyle.height = "100%";
        subContainerStyle.position = "relative";

        // move all children of the container into the new sub-container
        container.appendChild(subContainer);
        while ((cur = container.firstChild) !== subContainer) {
            subContainer.appendChild(cur);
        }
    }());

    /**
     * Set the ratio of content coordinates to the size at which this HTML layer
     * should be naturally rendered. If we only used content coordinates, we would
     * often lose precision because many CSS properties only use integer pixel values.
     * Instead, we represent the HTML at its maximum size, as set by this size ratio,
     * and use CSS transforms to shrink it to whatever dimensions we need.
     * Note that the position of the layer won't get properly adjusted until the next
     * time you call the update method.
     * @method setSizeRatio
     * @param newRatio {number} The ratio between natural CSS size and the content size
     * of the viewport. For instance, if we are using 160x160 pixel HTML templates on
     * an area that is 16x16 in content coordinates, newRatio would be 10.
     */
    this.setSizeRatio = function (newRatio, updateImmediately) {
        sizeRatio = newRatio;
        newRatio = (newRatio * 100) + "%";
        subContainerStyle.width = newRatio;
        subContainerStyle.height = newRatio;
        if (updateImmediately && lastBounds !== undefined) {
            this.update(lastBounds, lastZoom);
        }
    };

    /**
     * Based on the current size ratio, position the given element at the given location
     * in content coordinates.
     * @method setLocation
     * @param elmt {HTMLElement} The element to be positioned. It must already have style
     * position:absolute.
     * @param location {SDRect} The location, in content coordinates, where the element
     * should go.
     */
    this.setLocation = function (elmt, location) {
        var style = elmt.style;
        style.left = (location.x * sizeRatio) + "px";
        style.top = (location.y * sizeRatio) + "px";
        style.width = (location.width * sizeRatio) + "px";
        style.height = (location.height * sizeRatio) + "px";
    };

    /**
     * Change the content's CSS transform to fit the given bounds.
     * @method update
     * @param bounds {SDRect} The bounds (in content coordinates) of what is showing
     * @param zoom {number} The current zoom ratio
     */
    this.update = function (bounds, zoom) {
        lastBounds = bounds;
        lastZoom = zoom;
        SDElement_transform(subContainer, -bounds.x * zoom, -bounds.y * zoom, zoom / sizeRatio);
    };

    /**
     * Destroy the zoom container. No other operation will be valid on this container afterward.
     * @method dispose
     */
    this.dispose = function () {
        var cur;
        container.removeChild(subContainer);
        /*jshint boss: true */
        while (cur = subContainer.firstChild) {
            container.appendChild(cur);
        }
        /*jshint boss: false */
    };
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*global SD, SDPoint*/
/*jshint strict: false */

/**
 * A ZoomContainer for 2D canvas content.
 * @class CanvasZoomContainer
 * @namespace Seadragon2
 * @constructor
 * @param container {HTMLCanvasElement} The container element. It must have width and height
 * that match its CSS width and height.
 */
var SDCanvasZoomContainer = SD.CanvasZoomContainer = function (container) {
    var ctx = container.getContext("2d");
    
    /**
     * Change the canvas context's transform to fit the given bounds, and clear the canvas.
     * The viewer or app calling this function must draw new content onto the canvas during
     * the same event, or risk nasty flickeriness.
     * @method update
     * @param bounds {SDRect} The bounds (in content coordinates) of what is showing
     */
    this.update = function (bounds) {
        var width = container.width,
            height = container.height,
            zoom = width / bounds.width;
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, width, height);
        ctx.setTransform(zoom, 0, 0, zoom, -bounds.x * zoom, -bounds.y * zoom);
    };
};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*global SD, SDPoint, SDSpring, SDMath_log2, SDMath_clamp, SDRect, SDEventManager, SDTimer*/
/*jshint strict: false */

/**
 * The viewport handles resizing math, zooming about a given point, etc.
 * It contains Springs for the position and zoom of the content, and is capable
 * of using them to provide appropriate animations for zooming and panning
 * behavior. This class raises the following events:
 * <dl>
 * <dt>change</dt>
 * <dd>function(viewport): The viewport's zoom or center values
 * have changed as a result of the current call to update().</dd>
 * </dl>
 * @class Viewport
 * @namespace Seadragon2
 * @extends Seadragon2.EventManager
 * @constructor
 * @param containerSize {Seadragon2.Point} The size of the viewport's container
 * onscreen, in pixels. It may be modified later by calling the resize method.
 * @param contentSize {Seadragon2.Point} The size of the content, in user-defined
 * coordinates. The user of this viewport should choose a coordinate space that
 * makes sense for the elements being displayed (a single image could be normalized
 * to width 1, for instance). It is assumed that the scaling factor is the same
 * in both directions. For example, a contentSize of (x:2, y:1) should be displayed
 * twice as wide as its height, regardless of the container size.
 * @param options {object} (optional) May contain any of the following:
 * <dl>
 * <dt>panSpringOptions</dt>
 * <dd>An options object to be passed to this Viewport's pan Springs when they are created.</dd>
 * <dt>zoomSpringOptions</dt>
 * <dd>An options object to be passed to this Viewport's zoom Springs when they are created.</dd>
 * <dt>visibilityRatio</dt>
 * <dd>The amount of content which must stay onscreen when applyConstraints is called.
 * A visibilityRatio of 0 allows the content to move entirely offscreen, whereas a
 * visibilityRatio of 1 requires that the entire container area be covered with content,
 * if possible. Default is 0.8.</dd>
 * <dt>wrapHorizontal</dt>
 * <dd>Whether the content should connect at the right and left sides, such as 360-degree
 * panoramas. Default is false.</dd>
 * <dt>wrapVertical</dt>
 * <dd>Whether the content should connect at the top and bottom edges.</dd>
 * <dt>selfUpdating</dt>
 * <dd>Whether the Viewport is responsible for listening for the global timer and updating
 * itself on every tick. Default is true. Otherwise, the application using this Viewport
 * is responsible for calling its update() method periodically.</dd>
 * <dt>maxZoom</dt>
 * <dd>The maximum allowable zoom ratio for the content. Default is 2.</dd>
 * <dt>minZoom</dt>
 * <dd>The minimum allowable zoom ratio for the content. Default is 0.8.</dd>
 * </dl>
 */
var SDViewport = SD.Viewport = function (containerSize, contentSize, options) {
    containerSize = new SDPoint(containerSize.x, containerSize.y); // copy
    options = options || {};

    // Fields

    var self = this,

        contentAspect,
        contentHeight,
        contentWidth,

        panSpringOptions = options.panSpringOptions || {
            animationTime: 0.35
        },
        centerSpringX = new SDSpring(panSpringOptions),
        centerSpringY = new SDSpring(panSpringOptions),
        zoomSpring = new SDSpring(options.zoomSpringOptions),
        zoomPoint = null,

        homeBounds,

        containerAspect = containerSize.x / containerSize.y,
        widthRatio,

        // options
        wrapHorizontal = options.wrapHorizontal || false,
        wrapVertical = options.wrapVertical || false,
        selfUpdating = (options.selfUpdating !== false),

        timerToken = {}, // just some object, all it must do is === itself

        // optimizations (stored values for getters)
        dirtyFlag = true,
        currentZoom,
        targetZoom,
        currentExpZoom,
        targetExpZoom,
        currentWidthZoom,
        targetWidthZoom,
        currentZoomPercent,
        targetZoomPercent,
        currentCenter,
        targetCenter,
        currentBounds,
        targetBounds;

    // Properties

    /**
     * The maximum zoom ratio allowed whenever applyConstraints is called.
     * @property maxZoom
     * @type number
     * @default 2
     */
    this.maxZoom = typeof options.maxZoom === "number" ? options.maxZoom : 2;

    /**
     * The minimum zoom ratio allowed whenever applyConstraints is called.
     * @property minZoom
     * @type number
     * @default 0.8
     */
    this.minZoom = typeof options.minZoom === "number" ? options.minZoom : 0.8;

    /**
     * The minimum amount of the viewport that should contain content, between 0 and 1.
     * @property visibilityRatio
     * @type number
     * @default 0.8
     */
    this.visibilityRatio = typeof options.visibilityRatio === "number" ? options.visibilityRatio : 0.8;

    // Helpers

    function init() {
        // inherit from EventManager, since we'll trigger named events:
        // change     function(viewport, center, zoom)
        SDEventManager.call(self);

        self.resizeContent(contentSize);

        self.goHome(true);
        self.update();
        if (selfUpdating) {
            SDTimer.register(self.update, timerToken);
        }
    }

    function pow2(x) {
        return Math.pow(2, x);
    }

    function clampPointToRect(point, rect) {
        var xOld = point.x,
            yOld = point.y,
            xNew = SDMath_clamp(xOld, rect.x, rect.x + rect.width),
            yNew = SDMath_clamp(yOld, rect.y, rect.y + rect.height);

        return (xOld === xNew && yOld === yNew) ? point :
            new SDPoint(xNew, yNew);
    }

    function getCenterConstraintRect(current) {
        var zoom = self.getWidthZoom(current),
            width = contentWidth / zoom,
            height = width / containerAspect,
            xMin = (self.visibilityRatio - 0.5) * width,
            yMin = (self.visibilityRatio - 0.5) * height,
            xDelta = contentWidth - 2 * xMin,
            yDelta = contentHeight - 2 * yMin;

        if (xDelta < 0) {
            xMin += (0.5 * xDelta);
            xDelta = 0;
        }

        if (yDelta < 0) {
            yMin += (0.5 * yDelta);
            yDelta = 0;
        }

        return new SDRect(xMin, yMin, xDelta, yDelta);
    }

    // Helpers -- OPTIMIZATION
    // Basically, pre-compute every possible getter result.

    function generateZooms() {
        var currentSpring = zoomSpring.getCurrent(),
            targetSpring = zoomSpring.getTarget();
        currentExpZoom = currentSpring;
        targetExpZoom = targetSpring;
        currentZoom = pow2(currentSpring);
        targetZoom = pow2(targetSpring);
        currentWidthZoom = currentZoom * widthRatio;
        targetWidthZoom = targetZoom * widthRatio;
        var minZoom = SDMath_log2(self.minZoom),
            maxZoom = SDMath_log2(self.maxZoom);
        currentZoomPercent = (currentExpZoom - minZoom) / (maxZoom - minZoom) * 100;
        targetZoomPercent = (targetExpZoom - minZoom) / (maxZoom - minZoom) * 100;
    }

    function generateCenter(current) {
        var centerCurrent = new SDPoint(
            centerSpringX.getCurrent(),
            centerSpringY.getCurrent()
        );
        var centerTarget = new SDPoint(
            centerSpringX.getTarget(),
            centerSpringY.getTarget()
        );

        if (current) {
            return centerCurrent;
        } else if (!zoomPoint) {
            // no adjustment necessary since we're not zooming
            return centerTarget;
        }

        // to get the target center, we need to adjust for the zoom point.
        // we'll do this in the same way as the update() method.

        // manually calculate bounds based on this unadjusted target center.
        // this is mostly a duplicate of getBounds() above. note that this is
        // based on the TARGET zoom but the CURRENT center.
        var zoom = self.getWidthZoom();
        var width = contentWidth / zoom;
        var height = width / containerAspect;
        var bounds = new SDRect(
            centerCurrent.x - width / 2,
            centerCurrent.y - height / 2,
            width,
            height
        );

        // the conversions here are identical to the pixelFromPoint() and
        // deltaPointsFromPixels() methods.
        var oldZoomPixel = self.pixelFromPoint(zoomPoint, true);
        var newZoomPixel = zoomPoint.minus(bounds.getTopLeft()).times(containerSize.x / bounds.width);
        var deltaZoomPixels = newZoomPixel.minus(oldZoomPixel);
        var deltaZoomPoints = deltaZoomPixels.divide(containerSize.x / contentWidth * zoom);

        // finally, shift center to negate the change.
        return centerTarget.plus(deltaZoomPoints);
    }

    function generateBounds(current) {
        var center = self.getCenter(current),
            width = contentWidth / self.getWidthZoom(current),
            height = width / containerAspect;

        return new SDRect(center.x - width / 2, center.y - height / 2,
            width, height);
    }

    function generateAll() {
        dirtyFlag = false;
        // this order is important: generating center may depend on
        // calling pixelFromPoint, which in turn depends on current bounds!
        generateZooms();
        currentCenter = generateCenter(true);
        currentBounds = generateBounds(true);
        targetCenter = generateCenter();
        targetBounds = generateBounds();
    }

    function copyRect(rect) {
        return new SDRect(rect.x, rect.y, rect.width, rect.height);
    }

    function copyPoint(point) {
        return new SDPoint(point.x, point.y);
    }

    // Methods -- ACCESSORS

    /**
     * Get a copy of the current container dimensions, in pixels.
     * @method getContainerSize
     * @return {Seadragon2.Point}
     */
    this.getContainerSize = function () {
        return copyPoint(containerSize);
    };

    /**
     * Get the bounds of the displayed content, in content coordinates.
     * @method getBounds
     * @param current {bool} True to get the current value, false to get
     * the target value (at the end of the current animation).
     * @return {Seadragon2.Rect}
     */
    this.getBounds = function (current) {
        if (dirtyFlag) {
            generateAll();
        }
        return copyRect(current ? currentBounds : targetBounds);
    };

    /**
     * Get the center of the displayed content, in content coordinates.
     * @method getCenter
     * @param current {bool} True for current value, or false for target value.
     * @return {Seadragon2.Point}
     */
    this.getCenter = function (current) {
        if (dirtyFlag) {
            generateAll();
        }
        return copyPoint(current ? currentCenter : targetCenter);
    };

    /**
     * Get the zoom factor, with home zoom = 1.
     * @method getZoom
     * @param current {bool} True for current, false for target
     * @return {number}
     */
    this.getZoom = function (current) {
        if (dirtyFlag) {
            generateAll();
        }
        return current ? currentZoom : targetZoom;
    };

    /**
     * Get the viewport's zoom as an exponential number (home zoom = 0, 2x zoom = 1, 4x zoom = 2, etc.).
     * This is the way zoom is tracked internally so that animations and percentages look right.
     * @method getExpZoom
     * @param current {bool} True for current, false for target
     * @return {number}
     */
    this.getExpZoom = function (current) {
        if (dirtyFlag) {
            generateAll();
        }
        return current ? currentExpZoom : targetExpZoom;
    };

    /**
     * Get the ratio of the content's width to the viewport's width. In many cases, this will
     * be the same as the number returned by getZoom(), but it will be different if the
     * content's aspect ratio is smaller than the viewport's.
     * @method getWidthZoom
     * @param current {bool} True for current, false for target
     * @return {number}
     */
    this.getWidthZoom = function (current) {
        if (dirtyFlag) {
            generateAll();
        }
        return current ? currentWidthZoom : targetWidthZoom;
    };

    /**
     * Get the viewport's exponential zoom, scaled so that 0 is min zoom and 100 is max zoom.
     * This is useful for zoom sliders and such.
     * @method getZoomPercent
     * @param current {bool} True for current, false for target
     * @return {number}
     */
    this.getZoomPercent = function (current) {
        if (dirtyFlag) {
            generateAll();
        }
        return current ? currentZoomPercent : targetZoomPercent;
    };

    // Methods -- MODIFIERS

    /**
     * Ensure that the minZoom, maxZoom, and visibilityRatio are respected.
     * @method applyConstraints
     * @param immediately {bool} True to move right away, false to animate.
     */
    this.applyConstraints = function (immediately) {
        // first, apply zoom constraints
        var oldZoom = self.getZoom();
        var newZoom = SDMath_clamp(oldZoom, self.minZoom, self.maxZoom);
        if (oldZoom !== newZoom) {
            self.zoomTo(newZoom, zoomPoint, immediately);
        }

        // transform newZoom to be a width zoom, not an absolute zoom
        newZoom *= widthRatio;

        // then, apply pan constraints -- but do so via fitBounds() in order to
        // account for (and adjust) the zoom point! also ignore constraints if
        // content is being wrapped! but differentiate horizontal vs. vertical.
        var oldCenter = self.getCenter();
        var newCenter = clampPointToRect(oldCenter, getCenterConstraintRect());
        if (wrapHorizontal) {
            newCenter.x = oldCenter.x;
        }
        if (wrapVertical) {
            newCenter.y = oldCenter.y;
        }
        if (!oldCenter.equals(newCenter)) {
            var width = contentWidth / newZoom,
                height = width / containerAspect;
            self.fitBounds(new SDRect(
                newCenter.x - 0.5 * width,
                newCenter.y - 0.5 * height,
                width,
                height
            ), immediately);
        }
    };

    /**
     * Move the viewport so that the specified bounds are displayed.
     * @method fitBounds
     * @param bounds {Seadragon2.Rect} the new bounds, in content coordinates.
     * @param immediately {bool} True to move right now, false to animate the transition
     */
    this.fitBounds = function (bounds, immediately) {
        var aspect = containerAspect;
        var center = bounds.getCenter();

        // resize bounds to match viewport's aspect ratio, maintaining center.
        // note that zoom = 1/width, and width = height*aspect.
        var newBounds = new SDRect(bounds.x, bounds.y, bounds.width, bounds.height);
        if (newBounds.getAspectRatio() >= aspect) {
            // width is bigger relative to viewport, resize height
            newBounds.height = bounds.width / aspect;
            newBounds.y = center.y - newBounds.height / 2;
        } else {
            // height is bigger relative to viewport, resize width
            newBounds.width = bounds.height * aspect;
            newBounds.x = center.x - newBounds.width / 2;
        }

        // stop movement first! this prevents the operation from missing
        self.panTo(self.getCenter(true), true);
        self.zoomTo(self.getZoom(true), null, true);

        // capture old values for bounds and width. we need both, but we'll
        // also use both for redundancy, to protect against precision errors.
        // note: use target bounds, since update() hasn't been called yet!
        var oldBounds = self.getBounds();
        var oldZoom = self.getWidthZoom();

        // if we're already at the correct zoom, just pan and we're done.
        // we'll check whether the zoom values are "close enough", to protect against
        // precision errors (see note below).
        var newZoom = contentWidth / newBounds.width;
        if (newZoom * 1.000001 > oldZoom && newZoom * 0.999999 < oldZoom) {
            self.panTo(center, immediately);
            return;
        }

        // otherwise, we need to zoom about the only point whose pixel transform
        // is constant between the old and new bounds. this is just tricky math.
        var refPoint = oldBounds.getTopLeft().times(containerSize.x / oldBounds.width).minus(
                newBounds.getTopLeft().times(containerSize.x / newBounds.width)
            ).divide(
                containerSize.x / oldBounds.width - containerSize.x / newBounds.width
            );

        // note: that last line (cS.x / oldB.w - cS.x / newB.w) was causing a
        // divide by 0 in the case that oldBounds.width == newBounds.width.
        // that should have been picked up by the zoom check, but in certain
        // cases, the math is slightly off and the zooms are different. so now,
        // the zoom check has an extra check added.

        self.zoomTo(newZoom / widthRatio, refPoint, immediately);
    };

    /**
     * Return to the home zoom. This is the same as calling fitBounds on the entire
     * size of the content, unless the viewport is using wrapping.
     * @method goHome
     * @param immediately {bool} True to jump, false to animate
     */
    this.goHome = function (immediately) {
        // calculate center adjusted for zooming
        var center = self.getCenter();

        // if we're wrapping horizontally, "unwind" the horizontal spring
        if (wrapHorizontal) {
            // this puts center.x into the range e.g. [0, 1) always
            center.x = (contentWidth + (center.x % contentWidth)) % contentWidth;
            centerSpringX.resetTo(center.x);
            centerSpringX.update();
        }

        // if we're wrapping vertically, "unwind" the vertical spring
        if (wrapVertical) {
            // this puts center.y into the range e.g. [0, 0.75) always
            center.y = (contentHeight + (center.y % contentHeight)) % contentHeight;
            centerSpringY.resetTo(center.y);
            centerSpringY.update();
        }

        self.fitBounds(homeBounds, immediately);
    };

    /**
     * Pan the viewport by the specified amount.
     * @method panBy
     * @param delta {Seadragon2.Point} The amount to pan, in content coordinates.
     * @param immediately {bool} Whether to move immediately, as opposed to animating.
     */
    this.panBy = function (delta, immediately) {
        self.panTo(self.getCenter().plus(delta), immediately);
    };

    /**
     * Pan the viewport to the specified center point.
     * @method panTo
     * @param center {Seadragon2.Point} The point on the content which should move to
     * the center of the viewport.
     * @param immediately {bool} True to move immediately, false to use springs.
     */
    this.panTo = function (center, immediately) {
        // we have to account for zoomPoint here, i.e. if we're in the middle
        // of a zoom about some point and panTo() is called, we should be
        // spring to some center that will get us to the specified center.
        // the logic here is thus the exact inverse of the getCenter() method.

        if (immediately) {
            centerSpringX.resetTo(center.x);
            centerSpringY.resetTo(center.y);
            dirtyFlag = true;
            return;
        }

        if (!zoomPoint) {
            centerSpringX.springTo(center.x);
            centerSpringY.springTo(center.y);
            dirtyFlag = true;
            return;
        }

        // manually calculate bounds based on this unadjusted target center.
        // this is mostly a duplicate of getBounds() above. note that this is
        // based on the TARGET zoom but the CURRENT center.
        var zoom = self.getWidthZoom();
        var width = contentWidth / zoom;
        var height = width / containerAspect;
        var bounds = new SDRect(
            centerSpringX.getCurrent() - width / 2,
            centerSpringY.getCurrent() - height / 2,
            width,
            height
        );

        // the conversions here are identical to the pixelFromPoint() and
        // deltaPointsFromPixels() methods.
        var oldZoomPixel = self.pixelFromPoint(zoomPoint, true);
        var newZoomPixel = zoomPoint.minus(bounds.getTopLeft()).times(containerSize.x / bounds.width);
        var deltaZoomPixels = newZoomPixel.minus(oldZoomPixel);
        var deltaZoomPoints = deltaZoomPixels.divide(containerSize.x / contentWidth * zoom);

        // finally, shift center to negate the change.
        var centerTarget = center.minus(deltaZoomPoints);

        centerSpringX.springTo(centerTarget.x);
        centerSpringY.springTo(centerTarget.y);
        dirtyFlag = true;
    };

    /**
     * Zoom by the specified factor, about the specified point.
     * @method zoomBy
     * @param factor {number} The zoom factor to apply
     * @param refPoint {Seadragon2.Point} (optional) the point (in content coordinates)
     * which should stay stationary onscreen during this zoom operation.
     * @param immediately {bool} Whether to move right away
     */
    this.zoomBy = function (factor, refPoint, immediately) {
        self.zoomTo(self.getZoom() * factor, refPoint, immediately);
    };

    /**
     * Zoom to the specified zoom ratio, about the specified point.
     * @method zoomTo
     * @param zoom {number} The target zoom (scaling factor where 1 is home zoom).
     * @param refPoint {Seadragon2.Point} (optional) the point (in content coordinates)
     * which shouldn't move during the transition.
     * @param immediately {bool} True to move immediately, false to move on springs
     */
    this.zoomTo = function (zoom, refPoint, immediately) {
        // we used to constrain zoom automatically here; now it needs to be
        // explicitly constrained, via applyConstraints().
        //zoom = SDMath_clamp(zoom, self.getMinZoom(), self.getMaxZoom());

        if (immediately) {
            zoomSpring.resetTo(SDMath_log2(zoom));
        } else {
            zoomSpring.springTo(SDMath_log2(zoom));
        }

        zoomPoint = refPoint instanceof SDPoint ? refPoint : null;

        // target values are changing, so we'll recompute getter values
        dirtyFlag = true;
    };

    /**
     * Let the pan position of the viewport glide to rest based on its current
     * velocity. This is provided in the hopes that it will be useful on touch
     * devices, where springs should be very short but momentum is expected.
     * During this slide, the Viewport will automatically applyConstraints on
     * each update cycle, so that it doesn't drift out of bounds.
     * @method toss
     */
    this.toss = function () {
        // let go of x and y springs
        centerSpringX.toss();
        centerSpringY.toss();
    };

    /**
     * Resize the container, but keep the content's coordinate space the same.
     * @method resize
     * @param newContainerSize {Seadragon2.Point} The new size (in pixels) of the container.
     * @param maintain {bool} True to preserve the apparent size of the content onscreen,
     * false to make sure all of the same content is visible onscreen.
     */
    this.resize = function (newContainerSize, maintain) {
        // default behavior: just ensure the visible content remains visible.
        // note that this keeps the center (relative to the content) constant.
        var oldBounds = self.getBounds();
        var newBounds = oldBounds;
        var widthDeltaFactor = newContainerSize.x / containerSize.x;

        // update container size, but make copy first
        containerSize = new SDPoint(newContainerSize.x, newContainerSize.y);

        // update some other constants
        containerAspect = containerSize.x / containerSize.y;
        widthRatio = (containerAspect > contentAspect) ?
            contentAspect / containerAspect :
            1;

        if (maintain) {
            // no resize relative to screen, resize relative to viewport.
            // keep origin constant, zoom out (increase bounds) by delta factor.
            newBounds.width = oldBounds.width * widthDeltaFactor;
            newBounds.height = newBounds.width / containerAspect;
        }

        self.fitBounds(newBounds, true);
    };

    /**
     * Modify the content size, but not the container's dimensions.
     * @method resizeContent
     * @param newSize {Seadragon2.Point} The new size (in content dimensions) of the content.
     */
    this.resizeContent = function (newSize) {
        // should this supply options for keeping points constant through the resize?
        // perhaps content size should be not a size but a Rect, so that the
        // user can choose coordinates that don't start at (0,0)?

        var oldBounds;
        oldBounds = self.getBounds();

        contentSize = newSize;
        contentAspect = contentSize.x / contentSize.y;
        contentHeight = contentSize.y;
        contentWidth = contentSize.x;
        homeBounds = new SDRect(0, 0, contentWidth, contentHeight);
        widthRatio = (containerAspect > contentAspect) ?
            contentAspect / containerAspect :
            1;
        dirtyFlag = true;

        self.fitBounds(oldBounds, true);
    };

    /**
     * Adjust the zoom to a percentage value (measured exponentially between minZoom and maxZoom).
     * @method zoomToPercent
     * @param percent {number} A value in [0, 100] specifying the new zoom. 0 corresponds to minZoom
     * and 100 corresponds to maxZoom.
     * @param immediately True to move right away, false to animate on springs
     */
    this.zoomToPercent = function (percent, immediately) {
        var minZoom = SDMath_log2(self.minZoom);
        self.zoomTo(pow2(percent * (SDMath_log2(self.maxZoom) - minZoom) / 100 + minZoom), null, immediately);
    };

    /**
     * Update the viewport's zoom and position. As a user of Viewport, you should only call this
     * function if you didn't set its selfUpdating option to true. Otherwise, this function will
     * automatically be called from a timer, and you should listen for the "change" events which
     * fire whenever the update function changed anything.
     * @method update
     * @param arg {object} Used internally for if the function was put on a timer.
     * @param now {number} (optional) The current time in milliseconds.
     * @return {bool} true if the Viewport changed as a result of this update,
     * or if the function was called from a timer.
     */
    this.update = function (arg, now) {
        // Note: this function may not be called in the proper context since it was put on a timer,
        // so don't use the this keyword.

        var oldCenterX = centerSpringX.getCurrent();
        var oldCenterY = centerSpringY.getCurrent();
        var oldZoom = zoomSpring.getCurrent();
        var oldZoomPixel, sliding;

        // get the current time only once, rather than once for each spring
        now = now || new Date().getTime();

        // remember position of zoom point
        if (zoomPoint) {
            oldZoomPixel = self.pixelFromPoint(zoomPoint, true);
        }

        // now update zoom only, don't update pan yet
        zoomSpring.update(now);

        // since current values have changed, mark pre-computed values as dirty
        dirtyFlag = true;

        // adjust for change in position of zoom point, if we've zoomed
        if (zoomPoint && zoomSpring.getCurrent() !== oldZoom) {
            var newZoomPixel = self.pixelFromPoint(zoomPoint, true);
            var deltaZoomPixels = newZoomPixel.minus(oldZoomPixel);
            var deltaZoomPoints = self.deltaPointsFromPixels(deltaZoomPixels, true);

            // shift pan to negate the change
            centerSpringX.shiftBy(deltaZoomPoints.x);
            centerSpringY.shiftBy(deltaZoomPoints.y);
        } else {
            // don't try to adjust next time; this improves performance
            zoomPoint = null;
        }

        // now after adjustment, update pan
        sliding = centerSpringX.update(now);
        sliding = centerSpringY.update(now) || sliding;
        dirtyFlag = true;

        // if either pan spring is sliding, we have to apply constraints to keep it from drifting
        // out of bounds.
        if (sliding) {
            self.applyConstraints();
        }

        // return true only if the viewport changed as a result of this update.
        // the timer will automatically unregister this update function if it returns false,
        // so we must re-register any time something begins changing.
        var hasChanged = centerSpringX.getCurrent() !== oldCenterX ||
            centerSpringY.getCurrent() !== oldCenterY ||
            zoomSpring.getCurrent() !== oldZoom;
        if (hasChanged) {
            self.trigger("change", self);
        }
        return hasChanged || arg === timerToken;
    };

    // Methods -- CONVERSION HELPERS

    /**
     * Scale a distance in content coordinates to pixel coordinates.
     * @method deltaPixelsFromPoints
     * @param deltaPoints {Seadragon2.Point} A 2-D distance in content coordinates
     * @param current {bool} True for current zoom level, false for target zoom level.
     * @return {Seadragon2.Point} The same vector in pixel coordinates.
     */
    this.deltaPixelsFromPoints = function (deltaPoints, current) {
        return deltaPoints.times(containerSize.x / contentWidth * self.getWidthZoom(current));
    };

    /**
     * Scale a distance in pixel coordinates to content coordinates.
     * @method deltaPointsFromPixels
     * @param deltaPixels {Seadragon2.Point} A 2-D distance in pixel coordinates
     * @param current {bool} True for current zoom level, false for target zoom level.
     * @return {Seadragon2.Point} The same vector in content coordinates.
     */
    this.deltaPointsFromPixels = function (deltaPixels, current) {
        return deltaPixels.divide(containerSize.x / contentWidth * self.getWidthZoom(current));
    };

    /**
     * Convert a point in content coordinates to a point in pixel coordinates.
     * @method pixelFromPoint
     * @param point {Seadragon2.Point} A point in content coordinates
     * @param current {bool} whether to use current viewport position (true) or target
     * viewport position (false)
     * @return {Seadragon2.Point}
     */
    this.pixelFromPoint = function (point, current) {
        var bounds = self.getBounds(current);
        return point.minus(bounds.getTopLeft()).times(containerSize.x / bounds.width);
    };

    /**
     * Convert a point in pixel coordinates to a point in content coordinates.
     * @method pointFromPixel
     * @param pixel {Seadragon2.Point} A point in pixel coordinates
     * @param current {bool} whether to use current viewport position (true) or target
     * viewport position (false)
     * @return {Seadragon2.Point}
     */
    this.pointFromPixel = function (pixel, current) {
        var bounds = self.getBounds(current);
        return pixel.divide(containerSize.x / bounds.width).plus(bounds.getTopLeft());
    };

    /**
     * Convert a Rect in content coordinates to pixel coordinates.
     * @method rectPixelsFromPoints
     * @param rect {Seadragon2.Rect} The content rectangle
     * @param current {bool} true for current position, false for target
     * @param centered {bool} Whether to offset the resulting position by
     * half of the container width, so that (0,0) corresponds to the center of the
     * Viewport.
     * @return {Seadragon2.Rect}
     */
    this.rectPixelsFromPoints = function (rect, current, centered) {
        var bounds = self.getBounds(current),
            zoom = containerSize.x / bounds.width;
        return new SDRect(
            (rect.x - bounds.x) * zoom - (centered ? containerSize.x / 2 : 0),
            (rect.y - bounds.y) * zoom - (centered ? containerSize.y / 2 : 0),
            rect.width * zoom,
            rect.height * zoom
        );
    };

    // Constructor

    init();

};

// Copyright (c) Microsoft Corporation
// All rights reserved. 
// BSD License
//
// Redistribution and use in source and binary forms, with or without modification, are permitted provided that the
// following conditions are met:
//
// Redistributions of source code must retain the above copyright notice, this list of conditions and the following
// disclaimer.
//
// Redistributions in binary form must reproduce the above copyright notice, this list of conditions and the following
// disclaimer in the documentation and/or other materials provided with the distribution.
//
// THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS ""AS IS"" AND ANY EXPRESS OR IMPLIED WARRANTIES,
// INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE
// DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT HOLDER OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL,
// SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR
// SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY,
// WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE
// OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE

/*global SD, SDPoint, SDObject_extend, SDViewport, SDMouseTracker, SVGSVGElement, window,
SDSVGZoomContainer, HTMLCanvasElement, SDCanvasZoomContainer, SDHTMLZoomContainer,
SDElement_getStyle, SDTimer, SDEventManager, SDMath_max*/
/*jshint strict: false */

/**
 * <p>A basic Viewer. It will set up a MouseTracker on the specified container object,
 * and a Viewport to handle basic zooming interaction. It may contain any number of
 * ZoomContainers, and update each of them during each "change" event from the Viewport.
 * Alternately, the user of this Viewer may specify that it should ignore the change
 * event, and instead call its redraw method when appropriate (this flow is best for
 * any Viewer whose content will be animating as well as zooming).</p>
 * <p>Some apps may wish to subclass Viewer, to give it more abilities or override
 * the default behaviors for mouse inputs and viewport handling. For example, a
 * zoom.it-style photo viewer would need to add some buttons, and a pivot-style
 * viewer would need to manage collection layout and zoom to a selected item on click.</p>
 * <p>Viewer is an EventManager which triggers the following event:</p>
 * <dl>
 * <dt>resize</dt>
 * <dd>function(width, height): The Viewer has been resized onscreen, and has automatically
 * adjusted its container coordinates.</dd>
 * </dl>
 * @class Viewer
 * @namespace Seadragon2
 * @extends Seadragon2.EventManager
 * @constructor
 * @param container {HTMLElement} The onscreen container in which this viewer exists.
 * @param options {object} Optional, may contain any of the Viewer's writeable properties,
 * as well as the following:
 * <dl>
 * <dt>viewportOptions</dt>
 * <dd>An object containing any Viewport options that should be applied when building
 * the Viewport associated with this Viewer.</dd>
 * </dl>
 */
var SDViewer = SD.Viewer = function (container, options) {
    options = options || {};

    var viewport,
        tracker,
        self = this,
        mouseDownPixel = {},
        mouseDownCenter,
        mousePosition = {},
        documentElementStyle = document.documentElement.style,
        goodCursorBrowser = !window.opera,
        containerWidth,
        containerHeight,
        lastResizeCheck = 0,
        moveCursorSet,
        contactPoints = 0,
        pinchStartPixel, // center point of pinch gesture in screen pixels
        pinchStartSize, // distance between touch points, in pixels, at beginning of pinch
        pinchStartZoom, // zoom factor at beginning of pinch
        pinchStartPoint, // center point of pinch gesture in viewport coordinates
        disableMomentum,
        timerToken;

    // default options. we would put these on the object's prototype
    // if we were building many of them.
    /**
     * The factor by which the zoom level should increase when the user clicks.
     * Shift-clicking will zoom out by the same factor.
     * @property zoomPerClick
     * @type number
     * @default 2
     */
    self.zoomPerClick = 2;
    /**
     * The factor by which the zoom level should increase when the user scrolls
     * the mouse wheel forward once. Scrolling it backward will have the inverse
     * effect. Default value is set so that three consecutive scrolls
     * doubles the onscreen size of content.
     * @property zoomPerScroll
     * @type number
     * @default 2^(1/3)
     */
    self.zoomPerScroll = Math.pow(2, 1 / 3);
    /**
     * Whether the Viewer zooms in toward the mouse's position. If false, it will
     * zoom in toward the center of the displayed content.
     * @property zoomInToPoint
     * @type bool
     * @default true
     */
    self.zoomInToPoint = true;
    /**
     * Whether the Viewer zooms out around the mouse's current position. If false,
     * it zooms from the center of the displayed content.
     * @property zoomOutToPoint
     * @type bool
     * @default true
     */
    self.zoomOutToPoint = true;
    /**
     * Whether the user can pan the viewport by dragging their mouse (or touch point).
     * @property isPannable
     * @type bool
     * @default true
     */
    self.isPannable = true;
    /**
     * Whether the user can zoom the content by scrolling, clicking, pinching, etc.
     * @property isZoomable
     * @type bool
     * @default true
     */
    self.isZoomable = true;
    /**
     * Whether the Viewer should prevent the user from panning out of bounds during
     * a pan movement. If false, the Viewer will still move the content back in bounds
     * after the user releases.
     * @property constrainDuringPan
     * @type bool
     * @default false
     */
    self.constrainDuringPan = false;
    /**
     * Whether the Viewer should ignore "change" events raised by its Viewport. If false,
     * the Viewer will listen for "change" events and update all attached ZoomContainers
     * whenever the event is raised.
     * @property ignoreChange
     * @type bool
     * @default false
     */
    self.ignoreChange = false;
    /**
     * Whether to let the Viewport begin sliding to rest whenever the user releases a
     * pan movement. Works well when combined with a short spring duration, such as
     * options.viewportOptions.springOptions.animationTime = .05 seconds.
     * @property useMomentum
     * @type bool
     * @default true
     */
    self.useMomentum = true;
    /**
     * The CSS mouse cursor to set during a drag operation. If empty/null/undefined,
     * none will be set.
     * @property dragCursor
     * @type string
     * @default "move"
     */
    self.dragCursor = "move";

    /**
     * An object specifying how much extra space (in pixels) to use on each side of the
     * Viewport, inside the container object. Contains properties top, right, bottom,
     * and left, which are all numbers.
     * @property padding
     * @type object
     * @default {top:0,right:0,bottom:0,left:0}
     */
    self.padding = {
        top: 0,
        right: 0,
        bottom: 0,
        left: 0
    };

    /**
     * The collection of ZoomContainers that this Viewer manages.
     * @property zoomContainers
     * @type array of Seadragon2.ZoomContainer
     */

    // overwrite defaults with custom options
    SDObject_extend(self, options);

    // helpers

    function zoom(factor, position) {
        var zoomIn = factor > 1;
        viewport.zoomBy(
            factor,
            (zoomIn && self.zoomInToPoint) || (!zoomIn && self.zoomOutToPoint) ?
                viewport.pointFromPixel(position.minus(new SDPoint(self.padding.left, self.padding.top)), true) :
                null
        );
        viewport.applyConstraints();
    }

    function calculateDistance(points) {
        // we'll use average distance between all touch points. not super efficient implementation.
        var i, j, point, count = 0, total = 0, totalX = 0, totalY = 0;
        for (i in points) {
            if (points.hasOwnProperty(i)) {
                ++count;
                point = points[i];
                totalX += point.x;
                totalY += point.y;

                // add distances to each other point
                for (j in points) {
                    if (points.hasOwnProperty(j) && j !== i) {
                        total += point.distanceTo(points[j]);
                    }
                }
            }
        }
        return {
            center: new SDPoint(totalX / count, totalY / count),
            size: total / count / (count - 1)
        };
    }

    // Mouse interaction with zoomable area

    function onClick(tracker, id, position, quick, shift, input) {
        // ignore clicks where mouse moved, or clicks on HTML input elements
        if (quick && self.isZoomable && !input) {
            var zoomPerClick = self.zoomPerClick;
            var factor = shift ? 1 / zoomPerClick : zoomPerClick;
            zoom(factor, position);
        }
    }

    function onPress(tracker, id, position) {
        mouseDownPixel[id] = mousePosition[id] = position;
        ++contactPoints;
        mouseDownCenter = viewport.getCenter();
        if (contactPoints > 1) {
            var pinchStartInfo = calculateDistance(mouseDownPixel);
            position = pinchStartInfo.center;
            pinchStartPixel = position;
            pinchStartSize = pinchStartInfo.size;
            pinchStartZoom = viewport.getZoom();
            pinchStartPoint =
                viewport.pointFromPixel(position.minus(new SDPoint(self.padding.left, self.padding.top)), true);
        }
    }

    function onDrag(tracker, id, position, delta) {
        mousePosition[id] = position;

        var startPixel, size = -1;
        if (contactPoints > 1) {
            var pinchInfo = calculateDistance(mousePosition);
            position = pinchInfo.center;
            size = pinchInfo.size;
            startPixel = pinchStartPixel;
        } else {
            startPixel = mouseDownPixel[id];
        }

        if (self.isZoomable && size >= 0) {
            // choose a new zoom level and zoom to it
            var zoomRatio = size / pinchStartSize;
            var zoom = zoomRatio * pinchStartZoom;
            viewport.zoomTo(zoom, undefined, true);

            // compute the distance we've dragged at the starting zoom level
            var dragDistance = viewport.deltaPointsFromPixels(position.minus(startPixel)).times(zoomRatio);

            // apply an inverse scale-and-translate transformation about the pinch point
            // so that pinchStartPoint can remain the center of the pinch as it moves
            var center = mouseDownCenter.minus(dragDistance).minus(pinchStartPoint).divide(zoomRatio).plus(pinchStartPoint);

            // set the center
            viewport.panTo(center, true);

            viewport.applyConstraints();
        } else if (self.isPannable) {
            // note that in both cases, we're negating delta pixels since
            // dragging is opposite of panning. analogy is adobe viewer,
            // dragging up scrolls down.
            var deltaPixels = position.minus(startPixel);
            var deltaPoints = viewport.deltaPointsFromPixels(deltaPixels.negate(), true);
            viewport.panTo(mouseDownCenter.plus(deltaPoints));
            if (self.constrainDuringPan) {
                viewport.applyConstraints();
            }

            // opera has some weird quirks with dynamically changing cursor styles,
            // and tends to fail to reset the cursor to a pointer afterward, which
            // looks bad.
            var dragCursor = self.dragCursor;
            if (goodCursorBrowser && !moveCursorSet && dragCursor) {
                moveCursorSet = true;
                documentElementStyle.cursor = dragCursor;
            }
        }
    }

    function onRelease(tracker, id, position, insideElmtPress) {
        if (insideElmtPress) {
            --contactPoints;
            delete mousePosition[id];
            delete mouseDownPixel[id];
            if (!contactPoints) {
                if (self.useMomentum && !disableMomentum) {
                    viewport.toss();
                }
                disableMomentum = false;
                viewport.applyConstraints();
            } else if (contactPoints === 1) {
                // figure out which touch ID is still in contact
                for (id in mousePosition) {
                    if (mousePosition.hasOwnProperty(id)) {
                        break;
                    }
                }
                // go back to panning behavior
                mouseDownPixel[id] = mousePosition[id];
                mouseDownCenter = viewport.getCenter();
                // disable momentum so it doesn't trigger accidentally on the end of pinching
                disableMomentum = true;
            }
        }
        if (moveCursorSet) {
            moveCursorSet = false;
            documentElementStyle.cursor = "";
        }
    }

    function onScroll(tracker, position, delta) {
        if (self.isZoomable) {
            var factor = Math.pow(self.zoomPerScroll, delta);
            zoom(factor, position);
        }
    }

    function onChange() {
        if (!self.ignoreChange) {
            self.redraw();
        }
    }

    // constructor

    function getPaddedSize(width, height) {
        return new SDPoint(
            SDMath_max(width - self.padding.right - self.padding.left, 1),
            SDMath_max(height - self.padding.top - self.padding.bottom, 1)
        );
    }

    (function () {
        containerWidth = SDMath_max(container.clientWidth, 1);
        containerHeight = SDMath_max(container.clientHeight, 1);
        var containerSize = new SDPoint(containerWidth, containerHeight),
            contentSize = self.contentSize || containerSize.times(1), // default is the container's pixel size
            zoomContainer,
            scaledContainerSize;

        // if the user supplied a zoomContainers option, skip this step. otherwise, set up
        // a zoom container based on the type of HTML element provided as the container
        // onscreen.
        if (!self.zoomContainers) {
            if (window.SVGSVGElement && container instanceof SVGSVGElement) {
                // due to a bug in firefox 4.0, it reports 0 for container.clientWidth and container.clientHeight.
                // work around it by using the measurement from getComputedStyle instead.
                var style = SDElement_getStyle(container);
                containerSize = new SDPoint(parseFloat(style.width), parseFloat(style.height));
                if (!self.contentSize) {
                    // for a SVG container, it makes the most sense to use whatever coordinate system
                    // was already in place for the SVG content.
                    contentSize = new SDPoint(container.viewBox.baseVal.width, container.viewBox.baseVal.height);
                    if (contentSize.x === 0 && contentSize.y === 0) {
                        // SVG element didn't have a viewBox explicitly set, so we can use
                        // its width and height instead.
                        contentSize = new SDPoint(container.width.baseVal.value, container.height.baseVal.value);
                    }
                }
                zoomContainer = new SDSVGZoomContainer(container);
            } else if (window.HTMLCanvasElement && container instanceof HTMLCanvasElement) {
                if (!self.contentSize) {
                    // the obvious default content size for a canvas element is its pixel dimensions
                    contentSize = new SDPoint(container.width, container.height);
                }
                zoomContainer = new SDCanvasZoomContainer(container);
            } else {
                zoomContainer = new SDHTMLZoomContainer(container);
            }
            self.zoomContainers = [zoomContainer];
        }

        // scale the container and content sizes if we're using padding
        scaledContainerSize = getPaddedSize(containerSize.x, containerSize.y);
        contentSize.x *= scaledContainerSize.x / containerSize.x;
        contentSize.y *= scaledContainerSize.y / containerSize.y;

        // initialize the viewport
        viewport = new SDViewport(scaledContainerSize, contentSize, options.viewportOptions);

        // inherit from EventManager
        SDEventManager.call(self);

        // In IE10, we have to block manipulation events that would otherwise scroll or zoom the entire document.
        container.style.msTouchAction = "none";
    }());
    tracker = new SDMouseTracker(container);
    tracker.addListener("click", onClick);
    tracker.addListener("press", onPress);
    tracker.addListener("drag", onDrag);
    tracker.addListener("release", onRelease);
    tracker.addListener("scroll", onScroll);
    tracker.setTracking(true);
    viewport.addListener("change", onChange);

    // periodically check the bounds of the Viewer, and react to changes as necessary.
    timerToken = SDTimer.register(function () {
        // only do this every 30 frames because it is quite expensive.
        lastResizeCheck = (lastResizeCheck + 1) % 30;

        if (lastResizeCheck === 0) {
            var newContainerWidth = SDMath_max(container.clientWidth, 1),
                newContainerHeight = SDMath_max(container.clientHeight, 1);

            if (newContainerWidth !== containerWidth || newContainerHeight !== containerHeight) {
                containerWidth = newContainerWidth;
                containerHeight = newContainerHeight;
                viewport.resize(getPaddedSize(newContainerWidth, newContainerHeight), true);
                self.trigger("resize", newContainerWidth, newContainerHeight);
            }
        }

        return true;
    });

    // methods

    /**
     * Get the bounds of the Viewer, in content coordinates. For most cases, this will
     * be the same result as directly calling the Viewport's getBounds method. However,
     * if the viewer is using padding, the viewer's bounds will be larger than those of
     * the viewport.
     * @method getBounds
     * @param current whether to use the current position, as opposed to the target of
     * an in-progress movement
     * @return {Seadragon2.Rect}
     */
    self.getBounds = function (current) {
        var bounds = viewport.getBounds(current),
            containerSize = viewport.getContainerSize();

        // adjust the bounds outward to include the padding area
        bounds.x -= bounds.width * self.padding.left / containerSize.x;
        bounds.y -= bounds.height * self.padding.top / containerSize.y;
        bounds.width *= 1 + (self.padding.left + self.padding.right) / containerSize.x;
        bounds.height *= 1 + (self.padding.top + self.padding.bottom) / containerSize.y;

        return bounds;
    };

    /**
     * Update any attached ZoomContainers, using the current position of the Viewport.
     * @method redraw
     */
    self.redraw = function () {
        // fetch any useful values from the viewport
        var bounds = self.getBounds(true),
            zoom = viewport.getZoom(true),
            zoomContainers = self.zoomContainers,
            i;

        // iterate through attached ZoomContainers and update them
        for (i = zoomContainers.length - 1; i >= 0; i--) {
            zoomContainers[i].update(bounds, zoom);
        }
    };

    /**
     * Dispose the Viewer. No other operation on the Viewer is valid afterward.
     * @method dispose
     * @param keepContainers {bool} Whether to avoid disposing of the attached zoom containers
     */
    self.dispose = function (keepContainers) {
        // stop checking for resizes
        SDTimer.unregister(timerToken);

        if (!keepContainers) {
            var containers = self.zoomContainers, i, n = containers.length, cur;
            for (i = 0; i < n; ++i) {
                cur = containers[i];
                if (cur.dispose) {
                    cur.dispose();
                }
            }
        }
    };

    // call it once so that ZoomContainers set their initial positions
    self.redraw();

    // public getters. these should be treated as read-only and constant.
    // they are provided so that subclasses (or any other user of this class)
    // can change mouse behaviors or programatically modify the viewport.

    /**
     * The viewport associated with this viewer.
     * @property viewport
     * @final
     * @type Seadragon2.Viewport
     */
    self.viewport = viewport;

    /**
     * The mouse tracker associated with this viewer.
     * @property tracker
     * @final
     * @type Seadragon2.MouseTracker
     */
    self.tracker = tracker;
};
