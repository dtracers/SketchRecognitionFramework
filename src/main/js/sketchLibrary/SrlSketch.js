define([ './../generated_proto/sketch', // protoSketch
    './../protobufUtils/classCreator', // protobufUtils
    './../protobufUtils/sketchProtoConverter', // objectConversionUtils
    './SketchLibraryException', // SketchException
    './SrlBoundingBox', // SrlBoundingBox
    './ArrayUtils' // arrayUtils
], function(
    protoSketch,
    protobufUtils,
    objectConversionUtils,
    SketchException,
    SrlBoundingBox,
    arrayUtils
) {

    var sketch = protoSketch.protobuf.srl.sketch;

    var SketchMessage = sketch.SrlSketch;

    /**
     * *****************************************************************************
     *
     * SrlSketch data class
     *
     * @author gigemjt
     *
     * This is used in a majority of course sketch instead of the default protobuf object.
     *
     * ******************************
     */
    function SrlSketch() {
        this.superConstructor();// (Overloads); // super call

        var objectList = [];
        var objectIdMap = new Map();
        var boundingBox = new SrlBoundingBox();

        /**
         * Adds a subObject to this object.
         *
         * If proto objects are added they are automatically converted to this libraryies version of the proto object.
         *
         * @param {SrlStroke | SrlShape | SrlObject} srlObject - The sub object that is being added to this sketch.
         */
        this.add = function(srlObject) {
            var upgraded = objectConversionUtils.convertToUpgradedSketchObject(srlObject);
            console.log('add id ', upgraded.getId());
            objectList.push(upgraded);
            objectIdMap.set(upgraded.getId(), upgraded);
        };

        /**
         * Adds all objects in the array to the sketch.
         *
         * @param {Array<SrlShape | SrlStroke>} array - The objects being added to the sketch.
         */
        this.addAll = function(array) {
            for (var i = 0; i < array.length; i++) {
                this.add(array[i]);
            }
        };

        /**
         * Given an object, remove this instance of the object.
         *
         * @param {SrlShape | SrlStroke} srlObject - The object being removed from the sketch.
         * @return {SrlShape | SrlStroke} The object that was removed.
         */
        this.removeSubObject = function(srlObject) {
            var result = arrayUtils.removeObjectFromArray(objectList, srlObject);
            if (result) {
                objectIdMap.delete(result.getId());
            }
            return result;
        };

        /**
         * Given an objectId, remove the object.
         *
         * @param {String} objectId - The id of the subObject that is being looked for.
         * @return {SrlShape | SrlStroke | undefined} The object if it exist, returns undefined otherwise.
         */
        this.removeSubObjectById = function(objectId) {
            var object = this.getSubObjectById(objectId);
            this.removeSubObject(object);
            return object;
        };

        /**
         * @returns {Array<SrlShape> | Array<SrlStroke>} A list of the objects the sketch contain.
         */
        this.getList = function() {
            return objectList;
        };

        /**
         * @param {String} objectId - The object based off of its id.
         * @return {SrlShape | SrlStroke} The object if it exists undefined otherwise.
         */
        this.getSubObjectById = function(objectId) {
            return objectIdMap.get(objectId);
        };

        /**
         * @param {Number} index - The object location in the list of objects in this sketch.
         * @return {SrlShape | SrlStroke} The object based off of its index in the sketch.
         */
        this.getSubObjectAtIndex = function(index) {
            return objectList[index];
        };

        /**
         * @param {Number} index - The object location in the list of objects in this sketch.
         * @return {SrlShape | SrlStroke} The object based off of its index.
         */
        this.removeSubObjectAtIndex = function(index) {
            return arrayUtils.removeObjectByIndex(objectList, index);
        };

        /**
         * Resets the sketch to its starting state.
         *
         * Assigns new objects so any external references are now useless.
         *
         * @return {Array} A list that contains references to all of the existing objects.
         */
        this.resetSketch = function() {
            var oldList = objectList;
            objectList = [];
            objectIdMap = new Map();
            boundingBox = new SrlBoundingBox();
            return oldList;
        };

        this.clearSketch = this.resetSketch;
    }
    protobufUtils.Inherits(SrlSketch, SketchMessage);

    /***********************
     * OBJECT METHODS
     *********************/

    /**
     * Removes an object by the given IdChain.
     *
     * The last id in the chain is the object that is removed. The second to
     * last id in the chain is where it is removed from.
     *
     * If there is only one item in the list then the item is removed from the
     * sketch. In all cases except exceptions the item that is removed is
     * returned from this method.
     *
     * @param {IdChain | Array<String>} idList - The idChain of the subObject that is being looked for.
     * @return {SrlShape | SrlStroke} The object that is a result of the given IdChain.
     */
    SrlSketch.prototype.removeSubObjectByIdChain = function(idList) {
        if (idList.length <= 0) {
            throw new SketchException('input list is empty');
        }
        // there is only 1 item in the list so remove from top level
        if (idList.length === 1) {
            return this.removeSubObjectById(idList[0]);
        }

        var parentShape = this.getSubObjectById(idList[0]);
        for (var i = 1; i < idList.length - 1; i++) {
            parentShape = parentShape.getSubObjectById(idList[i]);
        }
        var returnShape = parentShape.removeSubObjectById(idList[idList.length - 1]);
        return returnShape;
    };

    /**
     * Goes through every object in this list of objects. (Brute force).
     *
     * @param {IdChain | Array<String>} idList - The idChain of the subObject that is being looked for.
     * @return {SrlShape | SrlStroke} The object that is a result of the given IdChain.
     */
    SrlSketch.prototype.getSubObjectByIdChain = function(idList) {
        if (idList.length <= 0) {
            throw new SketchException('input list is empty');
        }
        var returnShape = this.getSubObjectById(idList[0]);
        for (var i = 1; i < idList.length; i++) {
            returnShape = returnShape.getSubObjectById(idList[i]);
        }
        return returnShape;
    };

    /**
     * Creates an SRL protobuf version of a sketch.
     *
     * @returns {SketchMessage} A protobuf version of the sketch.
     */
    SrlSketch.prototype.sendToProtobuf = function() {
        var protobufSketch = new SketchMessage();

        var subObjects = this.getList();
        var protoSubObjects = [];

        for (var i = 0; i < subObjects.length; i++) {
            protoSubObjects.push(objectConversionUtils.encodeSrlObject(subObjects[i]));
        }
        protobufSketch.sketch = protoSubObjects;
        return protobufSketch;
    };
    return SrlSketch;
});
