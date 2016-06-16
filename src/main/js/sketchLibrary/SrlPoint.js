define([ './../generated_proto/sketch', // protoSketch
    './../protobufUtils/protobufUtils', // protoUtils
    './SketchLibraryException' // SketchException
    ], function(
    protoSketch,
    protoUtils,
    SketchException
    ) {

    var protobufUtils = protoUtils.classUtils;
    var objectConversionUtils = protoUtils.converterUtils;
    var exceptionUtils = protoUtils.exceptionUtils;
    var sketch = protoSketch.protobuf.srl.sketch;

    var PointMessage = sketch.SrlPoint;


    /**
     * ******************************
     *
     * Point data class
     *
     * @author hammond; Daniel Tan
     * @copyright Tracy Hammond, Sketch Recognition Lab, Texas A&M University
     *
     * ******************************
     *
     * @param {Number} initialX - The default x to start with.
     * @param {Number} initialY - The default y to start with.
     */
    function SrlPoint(initialX, initialY) {
        this.superConstructor();

        /**
         * Points can have pressure depending on the input device
         */
        // var pressure = 1; // stored in proto
        /**
         * Points can have size depending on the input device
         */
        // var size = 1; // stored in proto
        /**
         * Gives the instantaneous speed calculated from this and the previous
         * point.
         */
        // var speed = 0; // stored in proto
        /**
         * Computes the thickness for the stroke based off of a number of factors.
         *
         * Used to create more natural lines that vary in thickness.
         */
        var thickness = 0;
        /**
         * Holds an history list of the x points Purpose is so that we can redo and
         * undo and go back to the original points
         */
        var m_xList = [];
        /**
         * Holds a history list of the y points Purpose is so that we can redo and
         * undo and go back to the original points
         */
        var m_yList = [];
        /**
         * A counter that keeps track of where you are in the history of points
         */
        var m_currentElement = -1;

        /**
         * Updates the location of the point Also add this point to the history of
         * the points so this can be undone.
         *
         * @param {Number} x - The new x location for the point.
         * @param {Number} y - The new y location for the point.
         */
        this.setP = function(x, y) {
            if (typeof x === 'number' && typeof y === 'number') {
                m_xList.push(x);
                m_yList.push(y);
                m_currentElement = m_xList.length - 1;
                this.x = this.getX();
                this.y = this.getY();
            } else {
                throw new exceptionUtils.ArgumentException('arguments of .setP must be "number" x: ' + typeof x  + ' y: ' + typeof y);
            }
        };

        /**
         * Creates a point with the initial points at x,y.
         *
         * @param {Number} x - The initial x point
         * @param {Number} y - The initial y point
         */
        if (!protobufUtils.isUndefined(initialX) && !protobufUtils.isUndefined(initialY)) {
            this.setP(initialX, initialY);
        }

        /**
         * Get the current x value of the point.
         *
         * @return {Number} current x value of the point
         */
        this.getX = function() {
            return m_xList[m_currentElement];
        };

        /**
         * Get the current y value of the point.
         *
         * @return {Number} current y value of the point
         */
        this.getY = function() {
            return m_yList[m_currentElement];
        };

        /**
         * Sets the speed using the other point as a comparison.
         *
         * If the value is a number then it just sets that number as the speed.
         *
         * @param {SrlPoint | Number} point - The Point or speed itself that is beign applied to this point.
         * @returns {Boolean} If the speed was able to be set.  (It was not infinity)
         */
        this.setSpeed = function(point) {
            if (point instanceof SrlPoint) {
                var distance = this.distance(point.getX(), point.getY());
                var timeDiff = point.getTime() - this.getTime();
                if (timeDiff === 0) {
                    return false;
                }
                this.speed = distance / timeDiff;
                return true;
            } else if (typeof point === 'number') {
                this.speed = point;
                return true;
            } else {
                throw new exceptionUtils.ArgumentException('Invalid paramater given to set the speed');
            }
        };

        /**
         * Delete the entire point history and use these values as the starting point.
         *
         * @param {Number} x - New initial x location.
         * @param {Number} y - New initial y location.
         */
        this.setOrigP = function(x, y) {
            if (typeof x === 'number' && typeof y === 'number') {
                m_xList = [];
                m_yList = [];
                this.setP(x, y);
            } else {
                throw new exceptionUtils.ArgumentException('arguments of .setP must be "number" x: ' + typeof x  + ' y: ' + typeof y);
            }
        };

        /**
         * Remove last point update If there is only one x,y value in the history,
         * then it does nothing Returns the updated shape (this).
         */
        this.undoLastChange = function() {
            if (m_xList.length < 2) {
                return this;
            }
            if (m_yList.length < 2) {
                return this;
            }
            m_xList.pop();
            m_yList.pop();
            m_currentElement -= 1;
            this.x = this.getX();
            this.y = this.getY();
            return this;
        };

        /**
         * Get the original value of the point.
         *
         * @return {SrlPoint} a point where getx and gety return the first values that were
         *         added to the history.  The object is modified.
         */
        this.goBackToInitial = function() {
            if (m_currentElement >= 0) {
                m_currentElement = 0;
            }
            return this;
        };

        /**
         * Get the x value for the first point in the history.
         *
         * @return {Number} The first x point.
         */
        this.getInitialX = function() {
            if (m_xList.length === 0) {
                return Number.NaN;
            }
            return m_xList[0];
        };

        /**
         * Get the y value for the first point in the history.
         *
         * @return {Number} The first y point.
         */
        this.getInitialY = function() {
            if (m_yList.length === 0) {
                return Number.NaN;
            }
            return m_yList[0];
        };
    }
    protobufUtils.Inherits(SrlPoint, PointMessage);

    /**************************************
     * OBJECT METHODS
     *************************************/


    /**
     * Sets the x location of the point.
     *
     * @param {Number} x - X
     * @throws {SketchException} This method is not supported.
     */
    SrlPoint.prototype.setX = function(x) {
        throw new exceptionUtils.UnsupportedException('can\'t call set x must call setP');
    };

    /**
     * Sets the y location of the point.
     *
     * @param {Number} y - Y
     * @throws {SketchException} This method is not supported.
     */
    SrlPoint.prototype.setY = function(y) {
        throw new exceptionUtils.UnsupportedException('can\'t call set y must call setP');
    };

    /**
     * Just returns the x value with is obviously the same as the min return x value.
     *
     * @return {Number} The x location.
     */
    SrlPoint.prototype.getMinX = function() {
        return this.getX();
    };

    /**
     * Just returns the y value with is obviously the same as the min return y value.
     *
     * @return {Number} The y location.
     */
    SrlPoint.prototype.getMinY = function() {
        return this.getY();
    };

    /**
     * Just returns the x value with is obviously the same as the max return x value.
     *
     * @return {Number} The x location.
     */
    SrlPoint.prototype.getMaxX = function() {
        return this.getX();
    };

    /**
     * Just returns the y value with is obviously the same as the max return y value.
     *
     * @return {Number}  The y location.
     */
    SrlPoint.prototype.getMaxY = function() {
        return this.getY();
    };

    /**
     * Returns the distance between this point and another point.
     *
     * This has three modes:
     * <ol>
     *     <li>A single argument which is another point</li>
     *     <li>2 arguments which is the x and y of another point</li>
     *     <li>4 arguments which is the x and y of two points being compared together</li>
     * </ol>
     *
     * @param {SrlPoint | Number} arg1 - A point that is being compared or the x position of a point being compared.
     * @param {Number} [arg2] - The Y coordinate of the first point being compared.
     * @param {Number} [arg3] - The X coordinate of the second point being compared.
     * @param {Number} [arg4] - The Y coordinate of the second point being compared.
     * @returns {Number} The distance between the two points.
     */
    SrlPoint.prototype.distance = function(arg1, arg2, arg3, arg4) {
        /**
         * Return the distance from point rp to this point.
         *
         * @param rp - The other point
         * @return The distance.
         */
        if (arg1 instanceof SrlPoint) {
            return this.distance(arg1.getX(), arg1.getY());

            /**
             * Return the distance from the point specified by (x,y) to this point.
             *
             * @param x - The x value of the other point
             * @param y The y value of the other point
             * @return The distance
             */
        } else if (typeof arg1 === 'number' && typeof arg2 === 'number' && arg3 === undefined && arg4 === undefined) {
            var xdiff = Math.abs(arg1 - this.getX());
            var ydiff = Math.abs(arg2 - this.getY());
            return Math.sqrt(xdiff * xdiff + ydiff * ydiff);

            /**
             * Return the distance from the point specified by (x,y) to this point.
             *
             * @param x - The x value of the other point
             * @param y - The y value of the other point
             * @return the distance
             */
        } else if (typeof arg1 === 'number' && typeof arg2 === 'number' &&
                typeof arg3 === 'number' && typeof arg4 === 'number') {
            var xdiff2 = arg1 - arg3;
            var ydiff2 = arg2 - arg4;
            return Math.sqrt(xdiff2 * xdiff2 + ydiff2 * ydiff2);
        } else {
            throw new exceptionUtils.ArgumentException('arguments of .distance are wrong');
        }
    };

    /**************************************
     * PROTOBUF METHODS
     *************************************/

    /**
     * Static function that returns an {@link SrlPoint}.
     *
     * @param {PointMessage} proto - The proto object that is being turned into a sketch object.
     */
    SrlPoint.createFromProtobuf = function(proto) {
        var point = new SrlPoint(proto.x, proto.y);
        point.setId(proto.id);

        if (proto.time) {
            point.setTime(parseInt(proto.time.toString(), 10));
        }
        if (proto.name) {
            point.setName(proto.name);
        }
        if (proto.size) {
            point.setSize(proto.size);
        }
        if (proto.pressure) {
            point.setPressure(proto.pressure);
        }
        if (proto.speed) {
            point.setSpeed(proto.speed);
        }
        return point;
    };

    /**
     * Creates a pure protobuf version of the SrlPoint.
     *
     * Basically this removes the extra methods.
     * This is not actually needed anywhere because the point is not itself a protobuf object.
     *
     * @returns {PointMessage} A protobuf version of the point.
     */
    SrlPoint.prototype.sendToProtobuf = function() {
        var proto = new PointMessage();
        proto.id = this.getId();
        var n = this.getTime();
        proto.setTime('' + n);
        proto.name = this.getName();
        proto.x = this.getX();
        proto.y = this.getY();
        proto.pressure = this.getPressure();
        proto.size = this.getSize();
        proto.speed = this.getSpeed();
        return proto;
    };

    /**
     * Converts an array buffer to an upgraded SrlPoint.
     *
     * @param {ArrayBuffer} data - Byte data of the point.
     * @return {SrlPoint} A new object decoded from the binary data.
     */
    SrlPoint.decode = function(data) {
        return SrlPoint.createFromProtobuf(objectConversionUtils.decode(data, PointMessage));
    };

    /**
     * Creates a byte version of the protobuf data.
     *
     * @return {ArrayBuffer} A binary version of the point.
     */
    SrlPoint.prototype.toArrayBuffer = function() {
        return this.sendToProtobuf().toArrayBuffer();
    };

    return SrlPoint;
});
