(function (exports) {
    var protoSketch = require("./../generated_proto/sketch");
    var protobufUtils = require("./../protobufUtils/classCreator");

    var sketch = protoSketch.protobuf.srl.sketch;

    var BoundingBoxMessage = sketch.SrlBoundingBox;

    /**
     * *************************************************************
     *
     *
     * SRL_BoundingBox SRL_Library
     *
     * @author Daniel Tan
     *
     *
     *
     * *************************************************************
     */
    function SrlBoundingBox() {
        this.superConstructor();// (Overloads); // super call

        var internalLeft = 0, internalRight = 0, internalTop = 0, internalBottom = 0;

        var firstCoordinate = true;
        var firstIndex, lastIndex;
        /**
         * @see SRL_BoundingBox#addCoordinate(x,y)
         */
        this.addPoint = function (point) {
            this.addCoordinate(point.getX(), point.getY());
        };

        /**
         * expands the box if the given coordinate is outside of the current bounds;
         */
        this.addCoordinate = function (newX, newY) {
            if (firstCoordinate) {
                internalLeft = internalRight = newX;
                internalTop = internalBottom = newY;
                firstCoordinate = false;
            }

            internalLeft = Math.min(newX, internalLeft);
            internalRight = Math.max(newX, internalRight);
            internalTop = Math.min(newY, internalTop);
            internalBottom = Math.max(newY, internalBottom);
            sync();
        };

        this.setIndexes = function (firstI, lastI) {
            firstIndex = firstI;
            lastIndex = lastI;
        };

        /**
         * @see SrlBoundingBox#containsCoordinate(x,y)
         */
        this.containsPoint = function (point) {
            return this.containsCoordinate(point.getX(), point.getY());
        };

        /**
         * Returns true if the bounding box contains the given point, false
         * otherwise.
         *
         * containment is determined by being in or on the border of the bounding
         * box.
         */
        this.containsCoordinate = function (checkX, checkY) {
            return internalLeft <= checkX && checkX <= internalRight && internalTop <= checkY && checkY <= internalBottom;
        };

        this.union = function (other) {
            var extremes = other.getExtremeValues();
            if (firstCoordinate) {
                internalLeft = internalRight = extremes.left;
                internalTop = internalBottom = extremes.top;
                firstCoordinate = false;
            }

            internalLeft = Math.min(extremes.left, internalLeft);
            internalRight = Math.max(extremes.right, internalRight);
            internalTop = Math.min(extremes.top, internalTop);
            internalBottom = Math.max(extremes.bottom, internalBottom);
            sync();
        };

        /**
         * Moves every egdge of the bounding box away from the center by this many
         * pixels.
         */
        this.scale = function (pixels) {
            internalLeft -= pixels;
            internalRight += pixels;
            internalTop -= pixels;
            internalBottom += pixels;
            sync();
        };

        /**
         * Makes the rectangle coordinates the same as the extreme coordinates.
         */
        var sync = function () {
            this.setX(internalLeft);
            this.setY(internalTop);
            this.setWidth(internalRight - internalLeft);
            this.setHeight(internalBottom - internalTop);
        }.bind(this);

        this.addSubObject = function (subObject) {
            console.log('combing ');
            console.log(subObject);
            this.union(subObject.getBoundingBox());
        };

        /**
         * Returns the extreme values that make up this {@code SRL_BoundingBox}.
         *
         * returns left, right, top, and bottom from this instance.
         */
        this.getExtremeValues = function () {
            return {
                left: internalLeft,
                right: internalRight,
                top: internalTop,
                bottom: internalBottom
            };
        };

        /**
         * Returns the extreme values that make up this {@code SRL_BoundingBox}.
         *
         * returns left, right, top, and bottom from this instance.
         */
        this.getRectangle = function () {
            return {
                x: this.getX(),
                y: this.getY(),
                width: this.getWidth(),
                height: this.getHeight()
            };
        };

        this.getArea = function () {
            return internalWidth * internalHeight;
        };

        this.toString = function () {
            return 'SrlBoundingBox: (' + this.getX() + ', ' + this.getY() + ') Width: ' + this.getWidth() + ' Height: ' + this.getHeight();
        };
    }
    protobufUtils.Inherits(SrlBoundingBox, BoundingBoxMessage);

    exports.SrlBoundingBox = SrlBoundingBox;
})(module.exports);
