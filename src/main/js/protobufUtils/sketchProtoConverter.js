/**
 * Created by David Windows on 5/17/2016.
 */
define(['./../generated_proto/sketch', // protoSketch
    './../generated_proto/commands', // protoCommands
    './../generated_proto/sketchUtil', // protoCommands
    './../protobufUtils/classCreator', // protobufUtils
    './../sketchLibrary/SketchLibraryException', // protobufUtils
    "require" // require
    ], function (
    protoSketch,
    protoCommands,
    protoSketchUtil,
    protobufUtils,
    SketchException,
    require) {
    var sketch = protoSketch.protobuf.srl.sketch;
    var Commands = protoCommands.protobuf.srl.commands;
    var sketchUtil = protoSketchUtil.protobuf.srl.utils;

    var ObjectType = sketch.ObjectType;
    var ObjectMessage = sketch.SrlObject;
    var ShapeMessage = sketch.SrlShape;
    var StrokeMessage = sketch.SrlStroke;
    var PointMessage = sketch.PointMessage;
    var SrlPoint = undefined;
    var SrlStroke = undefined;
    var SrlShape = undefined;
    var modulesLoaded = false;

    function ProtobufDecodingException(message, cause) {
        this.name = 'ProtobufDecodingException';
        this.superConstructor(message, cause);
    }
    protobufUtils.Inherits(ProtobufDecodingException, SketchException);

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
            throw new ProtobufDecodingException('Data type is not supported:' + typeof data);
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

        if (protobufUtils.isUndefined(decoded) || decoded === null) {
            throw new ProtobufDecodingException('Unable to decode the data into anything. ' + protoClass);
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

    /**
     * Given a protobuf Command array an SrlUpdate is created.
     *
     * It is important to node that an SrlUpdate implies that the commands
     * happened at the same time.
     *
     * @param {Array<SrlCommand>} commands - A list of commands stored as an array.
     * @return {SrlUpdate} An update that holds the list of given commands.
     */
    var createUpdateFromCommands = function createUpdateFromCommands(commands) {
        var update = new Commands.SrlUpdate();
        update.setCommands(commands);
        var n = protobufUtils.createTimeStamp();
        update.setTime('' + n);
        update.setUpdateId(protobufUtils.generateUuid());
        return update;
    };

    /**
     * Given a protobuf Command array an SrlUpdate is created.
     *
     * It is important to node that an SrlUpdate implies that the commands
     * happened at the same time.
     *
     * @return {SrlUpdate} An empty update.
     */
    var createBaseUpdate = function createBaseUpdate() {
        var update = new Commands.SrlUpdate();
        var n = protobufUtils.createTimeStamp();
        update.commands = [];
        update.setTime('' + n);
        update.setUpdateId(protobufUtils.generateUuid());
        return update;
    };

    /**
     * Creates a command given the commandType and if the user created.
     *
     * @param {CommandType} commandType - The enum object of the commandType (found at
     *            CourseSketch.prutil.CommandType).
     * @param {Boolean} userCreated - True if the user created this command, false if the
     *            command is system created.
     * @returns {SrlCommand} Creates a command with basic data.
     */
    var createBaseCommand = function createBaseCommand(commandType, userCreated) {
        var command = new Commands.SrlCommand();
        command.setCommandType(commandType);
        command.setIsUserCreated(userCreated);
        command.commandId = protobufUtils.generateUuid(); // unique ID
        return command;
    };

    /**
     * Creates a new sketch command.
     *
     * @param {String} id - the id of the sketch, undefined if you want a random id given.
     * @param {Number} x - the x location of the sketch as an offset of its parent sketch.
     * @param {Number} y - the y location of the sketch as an offset of its parent sketch.
     * @param {Number} width - the width of the sketch.
     * @param {Number} height - the height of the sketch.
     *
     * @return {SrlCommand} a create sketch command
     */
    var createNewSketch = function createNewSketch(id, x, y, width, height) {
        var command = createBaseCommand(Commands.CommandType.CREATE_SKETCH, false);
        var idChain = sketchUtil.IdChain();
        if (!protobufUtils.isUndefined(id)) {
            idChain.idChain = [ id ];
        } else {
            idChain.idChain = [ protobufUtils.generateUuid() ];
        }
        var createSketchAction = new Commands.ActionCreateSketch();
        createSketchAction.sketchId = idChain;
        createSketchAction.x = x || (x === 0 ? 0 : -1);
        createSketchAction.y = y || (y === 0 ? 0 : -1);
        createSketchAction.width = width || (width === 0 ? 0 : -1);
        createSketchAction.height = height || (height === 0 ? 0 : -1);
        command.setCommandData(createSketchAction.toArrayBuffer());
        return command;
    };

    return {
        decode: decode,
        encodeSrlObject: encodeSrlObject,
        decodeSrlObject: decodeSrlObject,
        convertToUpgradedSketchObject: convertToUpgradedSketchObject,
        commands: {
            createUpdateFromCommands: createUpdateFromCommands,
            createBaseUpdate: createBaseUpdate,
            createBaseCommand: createBaseCommand,
            createNewSketch: createNewSketch
        }
    };

});
