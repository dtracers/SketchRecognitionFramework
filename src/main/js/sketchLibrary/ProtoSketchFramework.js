define([ './../generated_proto/sketch', // protoSketch
    './../generated_proto/commands', // protoCommands
    './../generated_proto/sketchUtil' // protoSketchUtil
], function(protoSketch,
             protoCommands,
             protoSketchUtil) {
    var sketch = protoSketch.protobuf.srl.sketch;
    var Commands = protoCommands.protobuf.srl.commands;
    var sketchUtil = protoSketchUtil.protobuf.srl.utils;

    return {
        Sketch: sketch,
        Commands: Commands,
        GeneralProtos: sketchUtil
    }
});
