require('node-define');
require('node-amd-require');
require('babel-polyfill');
var assert = require('chai').assert;

var basePath = '../../../';
var srcPath = 'main/js/';
var SketchException = require(basePath + srcPath + 'sketchLibrary/SketchLibraryException');

describe('Shape Tests', function() {
    describe('initializations', function() {
        it('should be able to create an instance of the shape class', function() {
            console.log(SketchException);
            var sketch = new SketchException();
            sketch.createStackTrace();
            console.log(sketch.stackTrace);
        });
    });
});
