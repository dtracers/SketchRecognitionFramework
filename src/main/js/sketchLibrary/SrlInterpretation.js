/**
 * Created by David Windows on 5/17/2016.
 */
(function (module) {

    var protoSketch = require("./../generated_proto/sketch");
    var protobufUtils = require("./../protobufUtils/classCreator");

    var sketch = protoSketch.protobuf.srl.sketch;

    var InterpretationMessage = sketch.SrlInterpretation;

    module.exports = InterpretationMessage;

})(module);
