require('node-define');
require('node-amd-require');
var assert = require('chai').assert;

var basePath = '../../../';
var srcPath = 'main/js/';
var SrlStroke = require(basePath + srcPath + 'sketchLibrary/SrlStroke');

describe('Shape Tests', function () {
    describe('initializations', function () {
        it('should be able to create an instance of the shape class', function () {
            console.log(SrlStroke);
            var sketch = new SrlStroke();
        });
    });
});
