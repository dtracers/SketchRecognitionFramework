/**
 * Created by David Windows on 5/17/2016.
 */
define(['./../generated_proto/sketch', // protoSketch
    './../protobufUtils/classCreator', // protobufUtils
    "require" // require
    ], function (
    protoSketch,
    protobufUtils,
    require) {
    var sketch = protoSketch.protobuf.srl.sketch;

    var ObjectType = sketch.ObjectType;
    var ObjectMessage = sketch.SrlObject;
    var ShapeMessage = sketch.SrlShape;
    var StrokeMessage = sketch.SrlStroke;
    var PointMessage = sketch.PointMessage;
    var SrlPoint = undefined;
    var SrlStroke = undefined;
    var SrlShape = undefined;
    var modulesLoaded = false;

    /**
     * Decodes the data and preserves the bytebuffer for later use.
     *
     * @param {ArrayBuffer} data
     *            a compiled set of data in the protobuf object.
     * @param {Message} proto - The protobuf object that is being decoded.
     * @param {Function} [onError] - A callback that is called when an error occurs regarding marking and resetting.
     *            (optional). This will be called before the result is returned
     *
     * @return {Message | undefined} decoded protobuf object.  (This may return undefined)
     */
    var decode = function(data, proto, onError) {
        if (protobufUtils.isUndefined(data) || data === null || typeof data !== 'object') {
            throw 'Data type is not supported:' + typeof data;
        }
        try {
            data.mark();
        } catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
        var decoded = undefined;

        var protoClass = proto;

        decoded = protoClass.decode(data);
        try {
            data.reset();
        } catch (exception) {
            if (onError) {
                onError(exception);
            }
        }
        return decoded;
    };

    function loadModules() {
        if (protobufUtils.isUndefined(SrlPoint)) {
            SrlPoint = require('./../sketchLibrary/SrlPoint');
        }
        if (protobufUtils.isUndefined(SrlStroke)) {
            SrlStroke = require('./../sketchLibrary/SrlStroke');
        }
        if (protobufUtils.isUndefined(SrlShape)) {
            SrlShape = require('./../sketchLibrary/SrlShape');
        }
        modulesLoaded = true;
    }

    /**
     * Used locally to decode the srl object.
     *
     * @param {SrlObject} object - the object that is being turned into its proto type.
     * @returns {ProtoSrlObject} SrlObject or its subclass.
     */
    var decodeSrlObject = function(object) {
        if (!modulesLoaded) {
            loadModules();
        }
        var objectType = object.type;
        switch (objectType) {
            case ObjectType.SHAPE:
                return SrlShape.decode(object.object);
            case ObjectType.STROKE:
                return SrlStroke.decode(object.object);
            case ObjectType.POINT:
                return SrlPoint.decode(object.object);
        }
    };

    /**
     * Used locally to encode an SRL_Object into its protobuf type.
     *
     * @param {SRL_Object} object - the object that is being turned into its proto type.
     * @return {ProtoSrlObject} The protobuf form of an SRL_Object.
     */
    function encodeSrlObject(object) {
        if (!modulesLoaded) {
            loadModules();
        }
        var proto = new ObjectMessage();

        if (object instanceof SrlShape) {
            proto.type = ObjectType.SHAPE;
        } else if (object instanceof SrlStroke) {
            proto.type = ObjectType.STROKE;
        } else if (object instanceof SrlPoint) {
            proto.type = ObjectType.POINT;
        }

        proto.object = object.toArrayBuffer();
        return proto;
    }

    /**
     * Takes in a potential protobuf object and converts it to the upgraded version.
     */
    var convertToUpgradedSketchObject = function(subObject) {
        if (!modulesLoaded) {
            loadModules();
        }
        if (subObject instanceof SrlShape) {
            return subObject;
        } else if (subObject instanceof SrlStroke) {
            return subObject;
        } else if (subObject instanceof ObjectMessage) {
            return decodeSrlObject(subObject);
        } else if (subObject instanceof ShapeMessage) {
            return SrlShape.createFromProtobuf(subObject);
        } else if (subObject instanceof StrokeMessage) {
            return SrlStroke.createFromProtobuf(subObject);
        } else {
            throw "Given object is not an instance of an srlObject " + (typeof subObject);
        }
    };

    return {
        decode: decode,
        encodeSrlObject: encodeSrlObject,
        decodeSrlObject: decodeSrlObject,
        convertToUpgradedSketchObject: convertToUpgradedSketchObject
    };

});
