/**
 * Created by David Windows on 5/17/2016.
 */
define([ './../generated_proto/sketch', // protoSketch
    './../protobufUtils/protobufUtils', // protobufUtils
    './SketchLibraryException', // SketchException
    './SrlBoundingBox', // SrlBoundingBox
    './SrlStroke' // SrlStroke
], function(
    protoSketch,
    protoUtils,
    SketchException,
    SrlBoundingBox,
    SrlStroke
) {

    var protobufUtils = protoUtils.classUtils;
    var objectConversionUtils = protoUtils.converterUtils;
    var arrayUtils = protoUtils.arrayUtils;
    var exceptionUtils = protoUtils.exceptionUtils;
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
         * Gets the bounding box of the object.
         *
         * @return {SrlBoundingBox} the bounding box of the object
         */
        this.getBoundingBox = function() {
            return boundingBox;
        };

        /**
         * Adds a subObject to this object.
         *
         * If proto objects are added they are automatically converted to this libraryies version of the proto object.
         *
         * @param {SrlStroke | SrlShape | SrlObject} subObject - The sub object that is being added to this shape.
         */
        this.add = function(subObject) {
            var upgradedObject = objectConversionUtils.convertToUpgradedSketchObject(subObject);
            if (!(upgradedObject instanceof SrlStroke || upgradedObject instanceof SrlShape)) {
                throw new SketchException('Can only add SrlStroke or SrlShape or their protobuf equivalent and SrlObject');
            }
            boundingBox.addSubObject(upgradedObject);
            upgradedSubComponents.push(upgradedObject);
        };

        /**
         * Given an object, remove this instance of the object.
         *
         * @param {SrlStroke | SrlShape | SrlObject} srlObject - The sub object that is being removed from this shape.
         * @return {SrlStroke | SrlSahpe | SrlObject} The element that was removed or undefined if it was not found.
         */
        this.removeSubObject = function(srlObject) {
            return arrayUtils.removeObjectFromArray(upgradedSubComponents, srlObject);
        };

        /**
         * Gets the list of subObjects.
         *
         * @return {Array<SrlObject>} list of objects that make up this object.
         */
        this.getSubObjects = function() {
            return upgradedSubComponents;
        };

        /**
         * @returns {String} a String representation of the objects.
         */
        this.toString = function() {
            return 'id: ' + this.getId() + '\n' +
                'name:' + this.getName() + '\n' +
                'boundingBox: ' + boundingBox + '\n' +
                'subComponents' + upgradedSubComponents + '\n';
        };
    }
    protobufUtils.Inherits(SrlShape, ShapeMessage);

    /**************************************
     * OBJECT METHODS
     *************************************/

    /**
     * Goes through every object in this list of objects. (Brute force).
     *
     * @param {String} objectId - The id of the subObject that is being looked for.
     * @return {SrlShape | SrlStroke | undefined} The object if it exist, returns undefined otherwise.
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
     * @param {String} objectId - The id of the subObject that is being looked for.
     * @return {SrlShape | SrlStroke | undefined} The object if it exist, returns undefined otherwise.
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
     * Gets an object by its id chain.
     *
     * An id chain is a list of ids that are used to navigate the object tree.
     *
     * @param {IdChain | Array<String>} idList - The idChain of the subObject that is being looked for.
     * @return {SrlShape | SrlStroke} The object that is a result of the given IdChain.
     */
    SrlShape.prototype.getSubObjectByIdChain = function(idList) {
        if (idList.length <= 0) {
            throw new arrayUtils.ArrayException('input array is empty');
        }
        var returnShape = this.getSubObjectById(idList[0]);
        for (var i = 1; i < idList.length; i++) {
            returnShape = returnShape.getSubObjectById(idList[i]);
            if (protobufUtils.isUndefined(returnShape)) {
                throw new SketchException('The given sub object does not exist in id chain with id: ' + idList[i] +
                    'it navigated ' + i + 'objects in depth before finding one that did not exist');
            }
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
        });
    };

    /**
     * Returns the center x of a shape using the bounding box coordinates.
     *
     * NOTE: this is not the averaged center.
     *
     * @return {Number} center x of a shape.
     */
    SrlShape.prototype.getCenterX = function() {
        return (this.getMinX() + this.getMaxX()) / 2.0;
    };

    /**
     * Returns the center y of a shape using the bounding box coordinates.
     *
     * NOTE: this is not the averaged center.
     *
     * @return {Number} center y of a shape.
     */
    SrlShape.prototype.getCenterY = function() {
        return (this.getMinY() + this.getMaxY()) / 2.0;
    };

    /**
     * Returns the width of the object.
     *
     * @return {Number} The width of the object.
     */
    SrlShape.prototype.getWidth = function() {
        return this.getBoundingBox().getWidth();// getMaxX() - getMinX();
    };

    /**
     * Returns the height of the object.
     *
     * @return {Number} The height of the object.
     */
    SrlShape.prototype.getHeight = function() {
        return this.getBoundingBox().getHeight();// getMaxY() - getMinY();
    };

    /**
     * Returns the length times the height.
     *
     * @return {Number} area of shape.
     */
    SrlShape.prototype.getArea = function() {
        return this.getBoundingBox().getArea();
    };

    /**
     * @returns {Number} the minimum x value in an object
     */
    SrlShape.prototype.getMinX = function() {
        return this.getBoundingBox().getLeft();// minx;
    };

    /**
     * @return {Number} minimum y value in an object
     */
    SrlShape.prototype.getMinY = function() {
        return this.getBoundingBox().getTop();// miny;
    };

    /**
     * @return {Number} maximum x value in an object
     */
    SrlShape.prototype.getMaxX = function() {
        return this.getBoundingBox().getRight();// maxx;
    };

    /**
     * @return {Number} maximum x value in an object
     */
    SrlShape.prototype.getMaxY = function() {
        return this.getBoundingBox().getBottom();
    };

    /**
     * This returns the length of the diagonal of the bounding box. This might
     * be a better measure of perceptual size than area.
     *
     * @return {Number} Euclidean distance of bounding box diagonal.
     */
    SrlShape.prototype.getLengthOfDiagonal = function() {
        return this.getBoundingBox().getLengthOfDiagonal();
    };

    /**
     * @return {Number} Angle of the diagonal of the bounding box of the shape.
     */
    SrlShape.prototype.getBoundingBoxDiagonalAngle = function() {
        return this.getBoundingBox().getBoundingBoxDiagonalAngle();
    };

    /**
     * This function just returns the same thing as the length of the diagonal
     * as it is a good measure of size.
     *
     * @return {Number} Size of the object.
     */
    SrlShape.prototype.getSize = function() {
        return this.getLengthOfDiagonal();
    };

    /**************************************
     * PROTOBUF METHODS
     *************************************/

    /**
     * Static function that returns an {@link SrlShape}.
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
     *
     * @returns {ShapeMessage} A protobuf version of the shape.
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
     * Converts an array buffer to an upgraded SrlShape.
     *
     * @param {ArrayBuffer} data - Byte data of the point.
     * @return {SrlShape} A new object decoded from the binary data.
     */
    SrlShape.decode = function(data) {
        return SrlShape.createFromProtobuf(objectConversionUtils.decode(data, ShapeMessage));
    };

    /**
     * Creates a byte version of the protobuf data.
     *
     * @return {ArrayBuffer} A binary version of the shape.
     */
    SrlShape.prototype.toArrayBuffer = function() {
        return this.sendToProtobuf().toArrayBuffer();
    };


    return SrlShape;
});
