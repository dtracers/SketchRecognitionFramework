define([ './../generated_proto/sketch', // protoSketch
    './../protobufUtils/classCreator' // protobufUtils
    ], function(
    protoSketch,
    protobufUtils) {

    var sketch = protoSketch.protobuf.srl.sketch;

    var BoundingBoxMessage = sketch.SrlBoundingBox;

    /**
     * *************************************************************
     *
     *
     * SrlBoundingBox SrlLibrary
     *
     * @author Daniel Tan
     *
     *
     *
     * *************************************************************
     */
    function SrlBoundingBox() {
        this.superConstructor();// (Overloads); // super call

        var internalLeft = 0;
        var internalRight = 0;
        var internalTop = 0;
        var internalBottom = 0;

        var firstCoordinate = true;
        var firstIndex;
        var lastIndex;

        /**
         * Expands the box if the given coordinate is outside of the current bounds;
         *
         * @param {Number} newX - The coordinate in the x plane.
         * @param {Number} newY - The coordinate in the y plane.
         */
        this.addCoordinate = function(newX, newY) {
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

        /**
         * This is what indexes of a stroke or object the bounding box refers to.
         *
         * This is inclusive.
         *
         * @param {Number} firstI - The first index of a stroke that this bounding box belongs to.
         * @param {Number} lastI - The last index of a stroke that this bounding box belongs to.
         */
        this.setIndexes = function(firstI, lastI) {
            firstIndex = firstI;
            lastIndex = lastI;
        };

        /**
         * Returns true if the bounding box contains the given point, false
         * otherwise.
         *
         * containment is determined by being in or on the border of the bounding
         * box.
         *
         * @param {Number} checkX - The coordinate in the x plane.
         * @param {Number} checkY - The coordinate in the y plane.
         * @return {Boolean} True if the coordinates are in the box false otherwise.
         */
        this.containsCoordinate = function(checkX, checkY) {
            return internalLeft <= checkX && checkX <= internalRight && internalTop <= checkY && checkY <= internalBottom;
        };

        /**
         * @param {SrlBoundingBox} otherRectangle - Another rectangle that is being merged with this one.
         */
        this.union = function(otherRectangle) {
            var extremes = otherRectangle.getExtremeValues();
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
         * Moves every egdge of the bounding box away from the center by this many pixels.
         *
         * @param {Number} pixels - The amount to move the edges away from the scale by.
         */
        this.scale = function(pixels) {
            internalLeft -= pixels;
            internalRight += pixels;
            internalTop -= pixels;
            internalBottom += pixels;
            sync();
        };

        /**
         * Makes the rectangle coordinates the same as the extreme coordinates.
         */
        var sync = function() {
            this.setX(internalLeft);
            this.setY(internalTop);
            this.setWidth(internalRight - internalLeft);
            this.setHeight(internalBottom - internalTop);
        }.bind(this);

        /**
         * Returns the extreme values that make up this {@code SrlBoundingBox}.
         *
         * @return {Object} left, right, top, and bottom from this instance.
         */
        this.getExtremeValues = function() {
            return {
                left: internalLeft,
                right: internalRight,
                top: internalTop,
                bottom: internalBottom
            };
        };

        /**
         * Returns the extreme values that make up this {@code SrlBoundingBox}.
         *
         * @return {Object} left, right, top, and bottom from this instance.
         */
        this.getRectangle = function() {
            return {
                x: this.getX(),
                y: this.getY(),
                width: this.getWidth(),
                height: this.getHeight()
            };
        };

        /**
         * @returns {String} string representation of the object.
         */
        this.toString = function() {
            return 'SrlBoundingBox: (' + this.getX() + ', ' + this.getY() + ') Width: ' + this.getWidth() + ' Height: ' + this.getHeight();
        };

        /**
         * @returns {Number} Leftmost point.
         */
        this.getLeft = function() {
            return internalLeft;
        };

        /**
         * @returns {Number} Rightmost point.
         */
        this.getRight = function() {
            return internalRight;
        };

        /**
         * @returns {Number} The Topmost point.
         */
        this.getTop = function() {
            return internalTop;
        };

        /**
         * @returns {Number} The Bottommost point.
         */
        this.getBottom = function() {
            return internalTop;
        };
    }
    protobufUtils.Inherits(SrlBoundingBox, BoundingBoxMessage);

    /**
     * @returns {Number} The Height of the object.
     */
    SrlBoundingBox.prototype.getHeight = function() {
        return Math.abs(this.getTop() - this.getBottom());
    };

    /**
     * @returns {Number} The Width of the object.
     */
    SrlBoundingBox.prototype.getWidth = function() {
        return Math.abs(this.getRight() - this.getLeft());
    };

    /**
     * Adds an point to the bounding box.
     *
     * @param {SrlPoint} point - The point being added to the box.
     * @see SrlBoundingBox#addCoordinate(x,y)
     */
    SrlBoundingBox.prototype.addPoint = function(point) {
        this.addCoordinate(point.getX(), point.getY());
    };

    /**
     * This returns the length of the diagonal of the bounding box. This might
     * be a better measure of perceptual size than area
     *
     * @return {Number} Euclidean distance of bounding box diagonal
     */
    SrlBoundingBox.prototype.getLengthOfDiagonal = function() {
        return Math.sqrt(this.getHeight() * this.getHeight() + this.getWidth() * this.getWidth());
    };

    /**
     * Returns the angle of the diagonal of the bounding box of the shape
     *
     * @return {Number} angle of the diagonal of the bounding box of the shape
     */
    SrlBoundingBox.prototype.getBoundingBoxDiagonalAngle = function() {
        return Math.atan(this.getHeight() / this.getWidth());
    };

    /**
     * @returns {Number} The area of the rectangle.
     */
    SrlBoundingBox.prototype.getArea = function() {
        return this.getHeight() * this.getWidth();
    };

    /**
     * @returns {SrlBoundingBox} returns itself so it is compatible with the other shapes.
     */
    SrlBoundingBox.prototype.getBoundingBox = function() {
        return this;
    };

    /**
     * Adds a subObjects bounding box to this bounding box.
     *
     * @param {SrlStroke | SrlShape} subObject - The sub object that is being added to this stroke.
     */
    SrlBoundingBox.prototype.addSubObject = function(subObject) {
        this.union(subObject.getBoundingBox());
    };

    /**
     * Returns true if the bounding box contains the given point, false otherwise.
     *
     * @param {SrlPoint} point - The point that may be contained inside the box
     * @return {Boolean} True if the coordinates are in the box false otherwise.
     * @see SrlBoundingBox#containsCoordinate(x,y)
     */
    SrlBoundingBox.prototype.containsPoint = function(point) {
        return this.containsCoordinate(point.getX(), point.getY());
    };

    return SrlBoundingBox;
});
