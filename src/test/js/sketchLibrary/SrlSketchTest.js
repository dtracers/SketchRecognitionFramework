var assert = require('chai').assert;

var basePath = '../../../';
var srcPath = 'main/js/';
var SketchClass = require(basePath + srcPath + 'sketchLibrary/SrlSketch');

describe('Sketch Tests', function () {
    describe('initializations', function () {
        it('should be able to create an instance of the sketch class', function () {
            console.log(SketchClass);
           var sketch = new SketchClass();
        });
    });
});
