/**
 * Created by David Windows on 5/17/2016.
 */
define([ './../generated_proto/sketch', // protoSketch
    './../protobufUtils/classCreator', // protobufUtils
    './../protobufUtils/sketchProtoConverter', // objectConversionUtils
    './SketchLibraryException', // SketchException
    './SrlPoint', // SrlPoint
    './SrlBoundingBox' // SrlBoundingBox
], function(
    protoSketch,
    protobufUtils,
    objectConversionUtils,
    SketchException,
    SrlPoint,
    SrlBoundingBox
) {

    var sketch = protoSketch.protobuf.srl.sketch;

    var StrokeMessage = sketch.SrlStroke;

    /**
     * ******************************
     *
     *
     * Stroke data class
     *
     * @author hammond; Daniel Tan
     * @copyright Tracy Hammond, Sketch Recognition Lab, Texas A&M University
     *
     *
     * ******************************
     */

    function SrlStroke(startPoint) {
        this.superConstructor();
        /**
         * List of points in the stroke.
         * @type {Array<SrlPoint>}
         */
        this.points = [];
        var boundingBox = new SrlBoundingBox();

        /**
         * Gets the bounding box of the object.
         *
         * @return {SrlBoundingBox} the bounding box of the object
         */
        this.getBoundingBox = function() {
            return boundingBox;
        };

        this.temp_print = function() {
            for (var i = 0; i < this.points.length; i++) {
                this.points[i].temp_print();
            }
        };

        /**
         * Constructor setting the initial point in the stroke.
         *
         * @param startPoint
         */
        if (startPoint instanceof SrlPoint) {
            this.addPoint(startPoint);
        }

    }
    protobufUtils.Inherits(SrlStroke, StrokeMessage);

    /**********************
     * OBJECT METHODS
     *********************/


    /**
     * Adding another point to the stroke
     *
     * @param {SrlPoint} point
     */
    SrlStroke.prototype.addPoint = function(point) {
        if (point instanceof SrlPoint) {
            this.points.push(point);
            this.getBoundingBox().addPoint(point);
        } else {
            throw new SketchException("Can not add an object that is not an SrlPoint to the stroke");
        }
    };
    /**
     * Gets the complete list of points in the stroke.
     *
     * @return {Array<SrlPoint>} list of points in the stroke
     */
    SrlStroke.prototype.getPoints = function() {
        return this.points;
    };

    SrlStroke.prototype.finish = function() {
    };

    /**
     * Get the i'th point in the stroke The first point has index i = 0
     *
     * @param {Number} i
     *            the index of the stroke
     * @return {SrlPoint} the point at index i
     */
    SrlStroke.prototype.getPoint = function(i) {
        if (typeof i === 'number') {
            if (i >= this.points.length || i < 0) {
                throw new SketchException('Index out of bounds ' + i +' is not in bounds [0 - ' + this.points.length + ' ]');
            }
            return this.points[i];
        }
    };

    /**
     * Goes through every object in this list of objects. (Brute force).
     *
     * @return {SrlPoint} The point if it exist, returns false otherwise.
     */
    SrlStroke.prototype.getSubObjectById = function(objectId) {
        for (var point in this.points) {
            if (point.getId() === objectId) {
                return point;
            }
        }
        return undefined;
    };

    /**
     * Goes through every object in this list of objects. (Brute force).
     *
     * @return {SrlPoint} The point if it exist, returns false otherwise.
     */
    SrlStroke.prototype.removeSubObjectById = function(objectId) {
        for (var i = 0; i < this.points.length; i++) {
            var object = this.points[i];
            if (object.getId() === objectId) {
                return removeObjectByIndex(this.points, i);
            }
        }
        return undefined
    };

    /**
     * Given an object, remove this instance of the object.
     */
    SrlStroke.prototype.removeSubObject = function(srlObject) {
        return removeObjectFromArray(this.points, srlObject);
    };

    /**
     * Gets the list of subobjects
     *
     * @return {Array<SrlPoint> list of objects that make up this object
     */
    SrlStroke.prototype.getSubObjects = function() {
        return this.points;
    };

    /**
     * Gets the number of points in the stroke
     *
     * @return {Number} number of points in the stroke
     */
    SrlStroke.prototype.getNumPoints = function() {
        return this.points.length;
    };

    /**
     * Returns the first point in the stroke. if the stroke has no points, it
     * returns null.
     *
     * @return {SrlPoint} first point in the stroke
     */
    SrlStroke.prototype.getFirstPoint = function() {
        if (this.points.length === 0) {
            return undefined;
        }
        return this.points[0];
    };

    /**
     * Returns the last point in the stroke If the stroke has no points, it
     * returns null.
     *
     * @return {SrlPoint} last point in the stroke.
     */
    SrlStroke.prototype.getLastPoint = function() {
        if (this.points.length === 0) {
            return undefined;
        }
        return this.points[this.getNumPoints() - 1];
    };


    /**
     * @return {Number} The minimum x value in a stroke return minimum x value in a
     * stroke
     */
    SrlStroke.prototype.getMinX = function() {
        return this.getBoundingBox().getLeft();// minx;
    };

    /**
     * @return {Number} The minimum y value in a stroke return minimum y value in a
     * stroke
     */
    SrlStroke.prototype.getMinY = function() {
        return this.getBoundingBox().getTop();// miny;
    };

    /**
     * @return {Number} The maximum x value in a stroke return maximum x value in a
     * stroke
     */
    SrlStroke.prototype.getMaxX = function() {
        return this.getBoundingBox().getRight();// maxx;
    };

    /**
     * @return {Number} The maximum x value in a stroke return maximum x value in a
     * stroke.
     */
    SrlStroke.prototype.getMaxY = function() {
        return this.getBoundingBox().getBottom();// maxy;
    };

    /*************************************
     * PROTOBUF METHODS
     ************************************/

    /**
     * Creates an SRL protobuf version of a stroke.
     */
    SrlStroke.prototype.sendToProtobuf = function() {
        var proto = new StrokeMessage();
        proto.id = this.getId();
        var n = this.getTime();
        proto.setTime('' + n);
        proto.name = this.getName();
        var array = [];
        var points = this.getPoints();
        for (var i = 0; i < points.length; i++) {
            array.push(points[i].sendToProtobuf());
        }
        proto.setPoints(array); // this should verify the points are created correctly.
        return proto;
    };

    /**
     * Static function that returns an {@link SrlStroke}.
     *
     * @param {StrokeMessage} stroke - The proto object that is being turned into a sketch object.
     * @returns {SrlStroke} The upgraded stroke version.
     */
    SrlStroke.createFromProtobuf = function(stroke) {
        var pointList = stroke.getPoints();
        var srlStroke = new SrlStroke();
        for (var i in pointList) {
            if (pointList.hasOwnProperty(i)) {
                var point = pointList[i];
                var currentPoint = SrlPoint.createFromProtobuf(point);
                srlStroke.addPoint(currentPoint);
            }
        }
        if (!srlStroke) {
            srlStroke = new SrlStroke();
        }
        srlStroke.finish();
        srlStroke.setId(stroke.getId());
        srlStroke.setTime(stroke.getTime());
        return srlStroke;
    };


    /**
     * Converts an array buffer to an upgraded SrlStroke
     * @param {ArrayBuffer} data
     * @return {SrlStroke}
     */
    SrlStroke.decode = function(data) {
        return SrlStroke.createFromProtobuf(objectConversionUtils.decode(data, StrokeMessage));
    };

    /**
     * Creates a byte version of the protobuf data.
     *
     * @return {ArrayBuffer}
     */
    SrlStroke.prototype.toArrayBuffer = function() {
        return this.sendToProtobuf().toArrayBuffer();
    };

    /******************************
     * MATH METHODS
     *****************************/

    /**
     * Return the cosine of the starting angle of the stroke This takes the
     * angle between the initial point and the point specified as the
     * secondPoint If there are fewer than that many points, it uses the last
     * point. If there are only 0 or 1 points, this returns NaN. Note that this
     * is also feature 1 of Rubine.
     *
     * @param {Number} secondPoint
     *            which number point should be used for the second point
     * @return {Number} cosine of the starting angle of the stroke
     */
    SrlStroke.prototype.getStartAngleCosine = function(inputSecondPoint) {
        var secondPoint = inputSecondPoint;
        if (typeof secondPoint === 'number') {
            if (this.getNumPoints() <= 1) return Number.NaN;
            if (this.getNumPoints() <= secondPoint) {
                secondPoint = this.getNumPoints() - 1;
            }

            var xStart, xEnd, yStart, yEnd;
            xStart = this.getPoint(0).getX();
            yStart = this.getPoint(0).getY();
            xEnd = this.getPoint(secondPoint).getX();
            yEnd = this.getPoint(secondPoint).getY();

            if (xStart === xEnd && yStart === yEnd) {
                return Number.NaN;
            }

            var sectionWidth = xEnd - xStart;
            var sectionHeight = yEnd - yStart;
            var hypotenuse = Math.sqrt(sectionWidth * sectionWidth + sectionHeight * sectionHeight);
            return sectionWidth / hypotenuse;
        }
        throw '.getStartAngleCosine needs an int argument';
    };

    /**
     * Return the sine of the starting angle of the stroke This takes the angle
     * between the initial point and the point specified as the secondPoint If
     * there are fewer than that many points, it uses the last point. If there
     * are only 0 or 1 points, this returns NaN. Note that this is also feature
     * 1 of Rubine.
     *
     * @param secondPoint
     *            which number point should be used for the second point
     * @return cosine of the starting angle of the stroke
     */
    SrlStroke.prototype.getStartAngleSine = function(inputSecondPoint) {
        var secondPoint = inputSecondPoint;
        if (typeof secondPoint === 'number') {
            if (this.getNumPoints() <= 1) return Number.NaN;
            if (this.getNumPoints() <= secondPoint) {
                secondPoint = this.getNumPoints() - 1;
            }

            var xStart, xEnd, yStart, yEnd;
            xStart = this.getPoint(0).getX();
            yStart = this.getPoint(0).getY();
            xEnd = this.getPoint(secondPoint).getX();
            yEnd = this.getPoint(secondPoint).getY();

            if (xStart === xEnd && yStart === yEnd) {
                return Number.NaN;
            }

            var sectionWidth = xEnd - xStart;
            var sectionHeight = yEnd - yStart;
            var hypotenuse = Math.sqrt(sectionWidth * sectionWidth + sectionHeight * sectionHeight);
            return sectionHeight / hypotenuse;
        }
    };

    /**
     * Return the Euclidean distance from the starting point to the ending point
     * of the stroke
     *
     * @return the distance between the starting and ending points of the stroke
     */
    SrlStroke.prototype.getEuclideanDistance = function() {
        var x0, xn, y0, yn;
        if (this.getPoints().length === 0) return 0;
        x0 = this.getFirstPoint().getX();
        y0 = this.getFirstPoint().getY();
        xn = this.getLastPoint().getX();
        yn = this.getLastPoint().getY();
        return Math.sqrt(Math.pow(xn - x0, 2) + Math.pow(yn - y0, 2));
    };

    /**
     * Return the cosine of the angle between the start and end point
     *
     * @return cosine of the ending angle
     */
    SrlStroke.prototype.getEndAngleCosine = function() {
        if (this.getNumPoints() <= 1) return Number.NaN;
        if (this.getEuclideanDistance() === 0) return Number.NaN;
        var xDistance = this.getLastPoint().getX() - this.getFirstPoint().getX();
        return xDistance / this.getEuclideanDistance();
    };

    /**
     * Return the cosine of the angle between the start and end point
     *
     * @return cosine of the ending angle
     */
    SrlStroke.prototype.getEndAngleSine = function() {
        if (this.getNumPoints() <= 1) return Number.NaN;
        if (this.getEuclideanDistance() === 0) return Number.NaN;
        var yDistance = this.getLastPoint().getY() - this.getFirstPoint().getY();
        return yDistance / this.getEuclideanDistance();
    };

    /**
     * Returns the length of the stroke, complete with all of its turns
     *
     * @return length of the stroke
     */
    SrlStroke.prototype.getStrokeLength = function() {
        var sum = 0;
        var deltaX, deltaY;
        for (var i = 0; i < this.getPoints().length - 1; i++) {
            deltaX = this.getPoint(i + 1).getX() - this.getPoint(i).getX();
            deltaY = this.getPoint(i + 1).getY() - this.getPoint(i).getY();
            sum += Math.sqrt(Math.pow(deltaX, 2) + Math.pow(deltaY, 2));
        }
        return sum;
    };

    /**
     * Returns an empty list because strokes can not contain anything but points.
     *
     * @return {Array<SrlObject>} an empty array of ojbects.
     */
    SrlStroke.prototype.getRecursiveSubObjects = function() {
        return [];
    };

    /**
     * Return the total stroke time
     *
     * @return total time of the stroke
     */
    SrlStroke.prototype.getTotalTime = function() {
        console.log('TODO - need to implement a .getTime()');
        throw 'unspoorted function call: "getTotalTime"';
        // if (this.getPoints().length === 0) return Number.NaN;
        // return this.getLastPoint().getTime()-this.getFirstPoint().getTime();
    };

    /**
     * Auxiliary method used to return a list containing all points but with
     * duplicated (based on time) removed
     *
     * @return list of points with duplicates (based on time) removed
     */
    SrlStroke.prototype.removeTimeDuplicates = function() {
        console.log('TODO - need to implement a .getTime()');
        throw 'unspoorted function call: "removeTimeDuplicates"';
        /*
         var points = [];
         for (var i = 0; i < points.length; i++) {
         if (points.length > 0) {
         if(points[points.size()-1].getTime() === p.getTime()){
         continue; } //
         }
         points.push(points[i]);
         }
         return points;
         */
    };

    /**
     * Auxiliary method used to return a list containing all points but with
     * duplicated (based on X,Y coordinates) removed
     *
     * @return list of points with duplicates (based on coordinates) removed
     */
    SrlStroke.prototype.removeCoordinateDuplicates = function() {
        var p = [];
        var x1, x2, y1, y2;
        p.push(this.getPoint(0));
        for (var i = 0; i < this.getPoints().length - 1; i++) {
            x1 = this.getPoint(i).getX();
            y1 = this.getPoint(i).getY();
            x2 = this.getPoint(i + 1).getX();
            y2 = this.getPoint(i + 1).getY();
            if (x1 !== x2 || y1 !== y2) p.push(this.getPoint(i + 1));
        }
        return p;
    };

    /**
     * Return the maximum stroke speed reached
     *
     * @return maximum stroke speed reached
     */
    SrlStroke.prototype.getMaximumSpeed = function() {
        console.log('TODO - need to implement a .getTime()');
        throw 'unspoorted function call: "getMaximumSpeed"';
        /*
         if (this.getPoints().length === 0) return Number.NaN;
         var max = 0;
         var deltaX, deltaY;
         var deltaT;
         var p = this.removeTimeDuplicates();
         for (var i = 0; i < p.length - 1; i++) {
         deltaX = p[i + 1].getX() - p[i].getX();
         deltaY = p[i + 1].getY() - p[i].getY();
         // deltaT = p.get(i+1).getTime()-p.get(i).getTime();
         var speed = (Math.pow(deltaX, 2) + Math.pow(deltaY, 2)) / Math.pow(deltaT, 2);
         if (speed > max) max = speed;
         }
         return max;
         */
    };

    /**
     * Calculates the rotation from point startP to two points further.
     * Calculates the line between startP and the next point, and then the next
     * two points, and then returns the angle between the two.
     *
     * @param points
     * @param startP
     * @return
     */
    SrlStroke.prototype.rotationAtAPoint = function(startP) {
        if (this.points[0] instanceof SrlPoint && typeof startP === 'number') {
            if (this.points.length < startP + 2) {
                return Number.NaN;
            }
            var mx = this.points.get[startP + 1].getX() - this.points.get[startP].getX();
            var my = this.points.get[startP + 1].getY() - this.points.get[startP].getY();
            return Math.atan2(my, mx);
        }
        throw 'and error occured! (probably because the argument was not a number)';
    };

    /**
     * Return the total rotation of the stroke from start to end points
     *
     * @return total rotation of the stroke
     */
    SrlStroke.prototype.getRotationSum = function() {
        var p = this.removeCoordinateDuplicates();
        var sum = 0;
        var lastrot = Number.NaN;
        for (var i = 1; i < p.length - 2; i++) {
            var rot = this.rotationAtAPoint(p, i);
            if (lastrot === Number.NaN) lastrot = rot;
            while ((i > 0) && (rot - lastrot > Math.PI)) {
                rot = rot - 2 * Math.PI;
            }
            while ((i > 0) && (lastrot - rot > Math.PI)) {
                rot = rot + 2 * Math.PI;
            }
            sum += rot;
        }
        return sum;
    };

    /**
     * Return the absolute rotation of the stroke from start to end points
     *
     * @return total absolute rotation of the stroke
     */
    SrlStroke.prototype.getRotationAbsolute = function() {
        var p = this.removeCoordinateDuplicates();
        var sum = 0;
        var lastrot = Number.NaN;
        for (var i = 1; i < p.length - 2; i++) {
            var rot = this.rotationAtAPoint(p, i);
            if (lastrot === Number.NaN) lastrot = rot;
            while ((i > 0) && (rot - lastrot > Math.PI)) {
                rot = rot - 2 * Math.PI;
            }
            while ((i > 0) && (lastrot - rot > Math.PI)) {
                rot = rot + 2 * Math.PI;
            }
            sum += Math.abs(rot);
        }
        return sum;
    };

    /**
     * Return the squared rotation of the stroke from start to end points
     *
     * @return total squared rotation of the stroke
     */
    SrlStroke.prototype.getRotationSquared = function() {
        var p = this.removeCoordinateDuplicates();
        var sum = 0;
        var lastrot = Number.NaN;
        for (var i = 1; i < p.length - 2; i++) {
            var rot = this.rotationAtAPoint(p, i);
            if (lastrot === Number.NaN) lastrot = rot;
            while ((i > 0) && (rot - lastrot > Math.PI)) {
                rot = rot - 2 * Math.PI;
            }
            while ((i > 0) && (lastrot - rot > Math.PI)) {
                rot = rot + 2 * Math.PI;
            }
            sum += rot * rot;
        }
        return sum;
    };

    return SrlStroke;
});
