/**
 * Created by David Windows on 5/17/2016.
 */
define([ './../generated_proto/sketch', // protoSketch
    './../protobufUtils/classCreator' // protobufUtils
], function(
    protoSketch,
    protobufUtils) {

    var sketch = protoSketch.protobuf.srl.sketch;

    var InterpretationMessage = sketch.SrlInterpretation;

    return InterpretationMessage;

});
