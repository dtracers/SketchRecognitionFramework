/**
 * Created by David Windows on 5/17/2016.
 */
(function (module) {

    var protoSketch = require("./../generated_proto/sketch");
    var protobufUtils = require("./../protobufUtils/classCreator");

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
     */
    function SrlPoint(x, y) {
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
        var m_xList = new Array();
        /**
         * Holds a history list of the y points Purpose is so that we can redo and
         * undo and go back to the original points
         */
        var m_yList = new Array();
        /**
         * A counter that keeps track of where you are in the history of points
         */
        var m_currentElement = -1;

        /**
         * @param {Number} x
         */
        this.setX = function(x) {
            throw "can't call set x must call setP";
        };

        /**
         * @param {Number} y
         */
        this.setY = function(y) {
            throw "can't call set y must call setP";
        };

        /**
         * Updates the location of the point Also add this point to the history of
         * the points so this can be undone.
         *
         * @param x
         *            the new x location for the point
         * @param y
         *            the new y location for the point
         */
        this.setP = function(x, y) {
            if (typeof x === "number" && typeof y === "number") {
                m_xList.push(x);
                m_yList.push(y);
                m_currentElement = m_xList.length - 1;
                this.x = this.getX();
                this.y = this.getY();
            } else {
                throw "arguments of .setP must be 'number'";
            }
        };

        /**
         * Creates a point with the initial points at x,y
         *
         * @param x
         *            the initial x point
         * @param y
         *            the initial y point
         */
        if (x != undefined && y != undefined) {
            this.setP(x, y);
        } else {
            // do nothing;
        }

        /**
         * Get the current x value of the point
         *
         * @return current x value of the point
         */
        this.getX = function() {
            return m_xList[m_currentElement];
        };

        /**
         * Get the current y value of the point
         *
         * @return current y value of the point
         */
        this.getY = function() {
            return m_yList[m_currentElement];
        };

        this.setSpeed = function(point) {
            if (point instanceof SRL_Point) {
                var distance = this.distance(point.getX(), point.getY());
                var timeDiff = point.getTime() - this.getTime();
                if (timeDiff == 0) {
                    return false;
                }
                this.speed = distance / timeDiff;
                return true;
            } else if(typeof point === 'number') {
                this.speed = point;
            }
        };

        this.distance = function(arg1, arg2, arg3, arg4) {
            /**
             * Return the distance from point rp to this point.
             *
             * @param rp
             *            the other point
             * @return the distance
             */
            if (arg1 instanceof SrlPoint) {
                return this.distance(arg1.getX(), arg1.getY());

                /**
                 * Return the distance from the point specified by (x,y) to this
                 * point
                 *
                 * @param x
                 *            the x value of the other point
                 * @param y
                 *            the y value of the other point
                 * @return the distance
                 */
            } else if (typeof arg1 === "number" && typeof arg2 === "number" && arg3 === undefined && arg4 === undefined) {
                var xdiff = Math.abs(arg1 - this.getX());
                var ydiff = Math.abs(arg2 - this.getY());
                return Math.sqrt(xdiff * xdiff + ydiff * ydiff);

                /**
                 * Return the distance from the point specified by (x,y) to this
                 * point
                 *
                 * @param x
                 *            the x value of the other point
                 * @param y
                 *            the y value of the other point
                 * @return the distance
                 */
            } else if (typeof arg1 === "number" && typeof arg2 === "number" && typeof arg3 === "number" && typeof arg4 === "number") {
                var xdiff = arg1 - arg3;
                var ydiff = arg2 - arg4;
                return Math.sqrt(xdiff * xdiff + ydiff * ydiff);
            } else {
                throw "arguments of .distance are wrong";
            }
        };

        /**
         * Delete the entire point history and use these values as the starting
         * point
         *
         * @param x
         *            new initial x location
         * @param y
         *            new initial y location
         */
        this.setOrigP = function(x, y) {
            if (typeof x === "number" && typeof y === "number") {
                m_xList = [];
                m_yList = [];
                this.setP(x, y);
            } else {
                throw "arguments of .setP must be 'number'";
            }
        };

        /**
         * Remove last point update If there is only one x,y value in the history,
         * then it does nothing Returns the updated shape (this)
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
         * Get the original value of the point
         *
         * @return a point where getx and gety return the first values that were
         *         added to the history
         */
        this.goBackToInitial = function() {
            if (m_currentElement >= 0) {
                m_currentElement = 0;
            }
            return this;
        };

        /**
         * Get the x value for the first point in the history
         *
         * @return {Number} the first x point.
         */
        this.getInitialX = function() {
            if (m_xList.length === 0) {
                return Number.NaN;
            }
            return m_xList[0];
        };

        /**
         * Get the y value for the first point in the history
         *
         * @return {Number} the first y point.
         */
        this.getInitialY = function() {
            if (m_yList.length === 0) {
                return Number.NaN;
            }
            return m_yList[0];
        };

        /**
         * Just returns the x value with is obviously the same as the min return x
         * value
         */
        this.getMinX = function() {
            return this.getX();
        };

        /**
         * Just returns the y value with is obviously the same as the min return y
         * value
         */
        this.getMinY = function() {
            return this.getY();
        };

        /**
         * Just returns the x value with is obviously the same as the max return x
         * value
         */
        this.getMaxX = function() {
            return this.getX();
        };

        /**
         * Just returns the y value with is obviously the same as the max return y
         * value
         */
        this.getMaxY = function() {
            return this.getY();
        };
    }
    protobufUtils.Inherits(SrlPoint, PointMessage);

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
     * @returns {PointMessage}
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
     * @param {ArrayBuffer} data
     * @return {SrlPoint}
     */
    SrlPoint.decode = function (data) {
        return SrlPoint.createFromProtobuf(objectConversionUtils.decode(data, PointMessage));
    };

    /**
     * Creates a byte version of the protobuf data.
     *
     * @return {ArrayBuffer}
     */
    SrlPoint.prototype.toArrayBuffer = function () {
        return this.sendToProtobuf().toArrayBuffer();
    };

    module.exports = SrlPoint;
})(module);
