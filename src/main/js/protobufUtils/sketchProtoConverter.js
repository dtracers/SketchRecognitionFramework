/**
 * Created by David Windows on 5/17/2016.
 */
(function (module) {
    var protoSketch = require("./../generated_proto/sketch");
    var protobufUtils = require("./classCreator");
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
                return SrlShape.createFromProtobuf(protobufUtils.decode(object.object, ShapeMessage));
            case ObjectType.STROKE:
                return SrlStroke.createFromProtobuf(protobufUtils.decode(object.object, StrokeMessage));
            case ObjectType.POINT:
                return SrlPoint.createFromProtobuf(protobufUtils.decode(object.object, PointMessage));
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

        proto.object = object.sendToProtobuf().toArrayBuffer();
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

    module.exports.encodeSrlObject = encodeSrlObject;
    module.exports.decodeSrlObject = decodeSrlObject;
    module.exports.convertToUpgradedSketchObject = convertToUpgradedSketchObject;

})(module);
