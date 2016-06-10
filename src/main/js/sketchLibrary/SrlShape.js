/**
 * Created by David Windows on 5/17/2016.
 */
define([ './../generated_proto/sketch', // protoSketch
    './../protobufUtils/classCreator', // protobufUtils
    './../protobufUtils/sketchProtoConverter', // objectConversionUtils
    './SketchLibraryException', // SketchException
    './SrlBoundingBox', // SrlBoundingBox
    './SrlStroke', // SrlStroke
    './ArrayUtils' // arrayUtils
], function(
    protoSketch,
    protobufUtils,
    objectConversionUtils,
    SketchException,
    SrlBoundingBox,
    SrlStroke,
    arrayUtils
) {

    var sketch = protoSketch.protobuf.srl.sketch;

    var ShapeMessage = sketch.SrlShape;

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
         * @return {Number} center x of a shape
         */
        this.getCenterX = function() {
            return (this.getMinX() + this.getMaxX()) / 2.0;
        };

        /**
         * Returns the center y of a shape
         *
         * @return {Number} center y of a shape
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
            return this.getBoundingBox().getHeight();// getMaxY() - getMinY();
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
         * Adds a subObject to this object.
         *
         * If proto objects are added they are automatically converted to this libraryies version of the proto object.
         *
         * @param {SrlStroke | SrlShape | SrlObject} subObject
         */
        this.add = function(subObject) {
            var upgradedObject = objectConversionUtils.convertToUpgradedSketchObject(subObject);
            if (!(upgradedObject instanceof SrlStroke || upgradedObject instanceof SrlShape)) {
                throw new SketchException("Can only add SrlStroke or SrlShape or their protobuf equivalent and SrlObject");
            }
            boundingBox.addSubObject(upgradedObject);
            upgradedSubComponents.push(upgradedObject);
        };

        /**
         * Given an object, remove this instance of the object.
         */
        this.removeSubObject = function(srlObject) {
            return arrayUtils.removeObjectFromArray(upgradedSubComponents, srlObject);
        };

        /**
         * Gets the list of subobjects
         *
         * @return {Array<SrlObject>} list of objects that make up this object
         */
        this.getSubObjects = function() {
            return upgradedSubComponents;
        };

        this.toString = function() {
            return "id: " + this.getId() + '\n' +
                'name:' + this.getName() + '\n' +
                'boundingBox: ' +boundingBox + '\n' +
                'subComponents' + upgradedSubComponents + '\n'
        }
    }
    protobufUtils.Inherits(SrlShape, ShapeMessage);

    /**************************************
     * OBJECT METHODS
     *************************************/


    /**
     * Goes through every object in this list of objects. (Brute force).
     *
     * @return {SrlShape | SrlStroke} The object if it exist, returns false otherwise.
     */
    SrlShape.prototype.getSubObjectById = function(objectId) {
        var upgradedSubComponents = this.getSubObjects();
        for (var i = 0; i < upgradedSubComponents.length; i++) {
            var object = upgradedSubComponents[i];
            if (object.getId() === objectId) {
                return object;
            }
        }
        return undefined;
    };

    /**
     * Goes through every object in this list of objects. (Brute force).
     *
     * @return {SrlShape | SrlStroke} The object if it exist, returns false otherwise.
     */
    SrlShape.prototype.removeSubObjectById = function(objectId) {
        var upgradedSubComponents = this.getSubObjects();
        for (var i = 0; i < upgradedSubComponents.length; i++) {
            var object = upgradedSubComponents[i];
            if (object.getId() === objectId) {
                return arrayUtils.removeObjectByIndex(upgradedSubComponents, i);
            }
        }
    };

    /**
     * @return {SrlShape | SrlStroke} The object that is a result of the given IdChain.
     */
    SrlShape.prototype.getSubObjectByIdChain = function(idList) {
        if (idList.length <= 0) {
            throw "input list is empty";
        }
        var returnShape = this.getSubObjectById(idList[0]);
        for (var i = 1; i < idList.length; i++) {
            returnShape = returnShape.getSubObjectById(idList[i]);
        }
        return returnShape;
    };

    /**
     * Gets a list of all of the objects that make up this object. This is a
     * recursive search through all of the subobjects. This objects is also
     * included on the list.
     *
     * @return {Array<SrlObject>} a list of objects.
     */
    SrlShape.prototype.getRecursiveSubObjects = function() {
        var completeList = [];
        var upgradedSubComponents = this.getSubObjects();
        for (var i = 0; i < upgradedSubComponents.length; i++) {
            completeList.push(upgradedSubComponents[i]);
            completeList = completeList.concat(upgradedSubComponents[i].getRecursiveSubObjects());
        }
        return completeList;
    };

    /**
     * Gets a list of all of the strokes that make up this object. It searches
     * recursively to get all of the strokes of this object. If it does not have
     * any strokes, the list will be empty.
     *
     * @return {Array<SrlStroke>} a list of all strokes contains in the shape
     */
    SrlShape.prototype.getRecursiveStrokes = function() {
        var completeList = this.getRecursiveSubObjects();
        return completeList.filter(function(arg) {
            return arg instanceof SrlStroke;
        })
    };

    /**
     * Static function that returns an {@link SRL_Shape}.
     *
     * @param {ProtoSrlShape} shape - The proto object that is being turned into a sketch object.
     */
    SrlShape.createFromProtobuf = function(shape) {
        var interpretations = shape.interpretations;
        var subObjects = shape.subComponents;
        var newShape = new SrlShape();
        for (var i = 0; i < interpretations.length; i++) {
            var protoInter = interpretations[i];
            newShape.addInterpretation(protoInter.label, protoInter.confidence, protoInter.complexity);
        }

        for (i = 0; i < subObjects.length; i++) {
            var protoObject = subObjects[i];
            newShape.add(objectConversionUtils.convertToUpgradedSketchObject(protoObject));
        }
        newShape.setId(shape.getId());
        newShape.setName(shape.getName());
        newShape.setTime(shape.getTime());
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
    SrlShape.decode = function(data) {
        return SrlShape.createFromProtobuf(objectConversionUtils.decode(data, ShapeMessage));
    };

    /**
     * Creates a byte version of the protobuf data.
     *
     * @return {ArrayBuffer}
     */
    SrlShape.prototype.toArrayBuffer = function() {
        return this.sendToProtobuf().toArrayBuffer();
    };
    return SrlShape;
});
