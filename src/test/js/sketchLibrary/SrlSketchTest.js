require('node-define');
require('node-amd-require');
var assert = require('chai').assert;

var basePath = '../../../';
var srcPath = 'main/js/';
var SrlSketch = require(basePath + srcPath + 'sketchLibrary/SrlSketch');

describe('Sketch Tests', function () {
    describe('initializations', function () {
        it('should be able to create an instance of the sketch class', function () {
            console.log(SrlSketch);
            var sketch = new SrlSketch();
        });
    });
});
