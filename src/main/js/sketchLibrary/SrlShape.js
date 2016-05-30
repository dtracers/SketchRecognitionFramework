/**
 * Created by David Windows on 5/17/2016.
 */
(function (module) {

    var protoSketch = require("./../generated_proto/sketch");
    var protobufUtils = require("./../protobufUtils/classCreator");
    var objectConversionUtils = require("./../protobufUtils/sketchProtoConverter");

    var sketch = protoSketch.protobuf.srl.sketch;

    var ShapeMessage = sketch.SrlShape;
    var SrlStroke = require('./SrlStroke');
    var SrlBoundingBox = require('./SrlBoundingBox');

    /**
     * ******************************
     *
     *
     * Shape data class
     *
     * @author hammond; Daniel Tan
     * @copyright Tracy Hammond, Sketch Recognition Lab, Texas A&M University
     *
     *
     * ******************************
     */
    function SrlShape() {

        /**
         * Was this object made up from a collection of subObjects? If so they are
         * in this list. This list usually gets filled in through recognition. This
         * list can be examined hierarchically. e.g., an arrow might have three
         * lines inside, and each line might have a stroke.
         */
        var upgradedSubComponents = [];

        /**
         * Contains the bounds of this shape.
         *
         * The bounding box is the farthest left, right, top and bottom points in
         * this shape;
         * @type {SrlBoundingBox}
         */
        var boundingBox = this.boundingBox = new SrlBoundingBox();

        // this.Inherits(SrlShape);
        this.superConstructor();

        /**
         * Returns the center x of a shape.
         *
         * @return center x of a shape
         */
        this.getCenterX = function() {
            return (this.getMinX() + this.getMaxX()) / 2.0;
        };

        /**
         * Returns the center y of a shape
         *
         * @return center y of a shape
         */
        this.getCenterY = function() {
            return (this.getMinY() + this.getMaxY()) / 2.0;
        };

        /**
         * Returns the width of the object
         *
         * @return the width of the object
         */
        this.getWidth = function() {
            return this.getBoundingBox().getWidth();// getMaxX() - getMinX();
        };

        /**
         * Returns the height of the object
         *
         * @return the height of the object
         */
        this.getHeight = function() {
            return this.bondingBox().getHeight();// getMaxY() - getMinY();
        };

        /**
         * Returns the length times the height See also getLengthOfDiagonal() return
         * area of shape
         */
        this.getArea = function() {
            return this.getHeight() * this.getWidth();
        };

        this.getLengthOfDiagonal = boundingBox.getLengthOfDiagonal.bind(boundingBox);

        /**
         * This function just returns the same thing as the length of the diagonal
         * as it is a good measure of size.
         *
         * @return size of the object.
         */
        this.getSize = function() {
            return this.getLengthOfDiagonal();
        };

        this.getBoundingBoxDiagonalAngle = boundingBox.getBoundingBoxDiagonalAngle.bind(boundingBox);

        /**
         * Gets the bounding box of the object.
         *
         * @return {SrlBoundingBox} the bounding box of the object
         */
        this.getBoundingBox = function() {
            return boundingBox;
        };

        /**
         * @returns {Number} the minimum x value in an object
         */
        this.getMinX = function() {
            return boundingBox.getLeft();// minx;
        };

        /**
         * @return {Number} minimum y value in an object
         */
        this.getMinY = function() {
            return boundingBox.getTop();// miny;
        };

        /**
         * @return {Number} maximum x value in an object
         */
        this.getMaxX = function() {
            return boundingBox.getRight();// maxx;
        };

        /**
         * @return {Number} maximum x value in an object
         */
        this.getMaxY = function() {
            return boundingBox.getBottom();
        };

        /**
         * Adds a subObject to this object. This usually happens during recognition,
         * when a new object is made up from one or more objects
         *
         * @param subObject
         */
        this.add = function(subObject) {
            var upgradedObject = objectConversionUtils.convertToUpgradedSketchObject(subObject);
            boundingBox.addSubObject(upgradedObject);
            upgradedSubComponents.push(upgradedObject);
        };

        /**
         * Goes through every object in this list of objects. (Brute force).
         *
         * @return the object if it exist, returns false otherwise.
         */
        this.getSubObjectById = function(objectId) {
            for (var i = 0; i < upgradedSubComponents.length; i++) {
                var object = m_subObjects[i];
                if (object.getId === objectId) {
                    return object;
                }
            }
            return false;
        };

        /**
         * Goes through every object in this list of objects. (Brute force).
         *
         * @return the object if it exist, returns false otherwise.
         */
        this.removeSubObjectById = function(objectId) {
            for (var i = 0; i < m_subObjects.length; i++) {
                var object = m_subObjects[i];
                if (object.getId() === objectId) {
                    return removeObjectByIndex(m_subObjects, i);
                }
            }
        };

        /**
         * Given an object, remove this instance of the object.
         */
        this.removeSubObject = function(srlObject) {
            return removeObjectFromArray(m_subObjects, srlObject);
        };

        /**
         * Gets the list of subobjects
         *
         * @return {Array<SrlObject>} list of objects that make up this object
         */
        this.getSubObjects = function() {
            return m_subObjects;
        };

        /**
         * Gets a list of all of the objects that make up this object. This is a
         * recursive search through all of the subobjects. This objects is also
         * included on the list.
         *
         * @return {List<SrlObject>} a list of objects.
         */
        this.getRecursiveSubObjectList = function() {
            var completeList = [];
            completeList.push(this);
            for (var i = 0; i < m_subObjects.length; i++) {
                for (var j = 0; j < m_subObjects[i].length; j++) {
                    completeList.push(m_subObjects[i].getRecursiveSubObjectList()[j]);
                }
            }
            return completeList;
        };

        /**
         * Gets a list of all of the strokes that make up this object. It searches
         * recursively to get all of the strokes of this object. If it does not have
         * any strokes, the list will be empty.
         *
         * @return {List<SrlStroke>} a list of all strokes contains in the shape
         */
        this.getRecursiveStrokes = function() {
            var completeList = [];
            console.log("TODO - need to implement a .getRecursiveSubObjectList()");
            throw 'Function not supported: getRecursiveStrokes';
            /*
             * for(SRL_Object o : getRecursiveSubObjectList()){ try {
             * if(this.getClass() == Class.forName("SRL_Stroke")){
             * completeList.add((SRL_Stroke)o); } } catch (ClassNotFoundException e) {
             * e.printStackTrace(); } } //
             *
             * return completeList;
             */
        };
    }
    protobufUtils.Inherits(SrlShape, ShapeMessage);

    /**
     * Static function that returns an {@link SRL_Shape}.
     *
     * @param {ProtoSrlShape} shape - The proto object that is being turned into a sketch object.
     */
    SrlShape.createFromProtobuf = function(shape) {
        var interpretations = shape.interpretations;
        var subObjects = shape.subComponents;
        var newShape = new SRL_Shape();
        for (var i = 0; i < interpretations.length; i++) {
            var protoInter = interpretations[i];
            newShape.addInterpretation(protoInter.label, protoInter.confidence, protoInter.complexity);
        }

        for (i = 0; i < subObjects.length; i++) {
            var protoObject = subObjects[i];
            newShape.addSubObject(objectConversionUtils.convertToUpgradedSketchObject(protoObject));
        }
        newShape.setId(shape.getId());
        newShape.setName(shape.getName());

        return newShape;
    };

    /**
     * Creates an SRL protobuf version of a shape.
     */
    SrlShape.prototype.sendToProtobuf = function() {
        var proto = new ShapeMessage();

        var interpretations = this.getInterpretations();
        var protoInterp = [];
        for (var i = 0; i < interpretations.length; i++) {
            var protoInter = interpretations[i];
            protoInterp = protoInter.sendToProtobuf();
        }
        proto.setInterpretations(protoInterp);

        var protoSubShapes = [];
        var subShapeList = this.getSubObjects();
        for (i = 0; i < subShapeList.length; i++) {
            protoSubShapes.push(objectConversionUtils.encodeSrlObject(subShapeList[i]));
        }
        proto.setSubComponents(protoSubShapes);

        proto.setId(this.getId());
        var n = this.getTime();
        proto.setTime('' + n);
        proto.setName = this.getName();
        return proto;
    };

    /**
     * Converts an array buffer to an upgraded SrlShape
     * @param {ArrayBuffer} data
     * @return {SrlShape}
     */
    SrlShape.decode = function (data) {
        return SrlShape.createFromProtobuf(objectConversionUtils.decode(data, ShapeMessage));
    };

    /**
     * Creates a byte version of the protobuf data.
     *
     * @return {ArrayBuffer}
     */
    SrlShape.prototype.toArrayBuffer = function () {
        return this.sendToProtobuf().toArrayBuffer();
    };

    module.exports = SrlShape;
})(module);
