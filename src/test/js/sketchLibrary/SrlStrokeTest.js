require('node-define');
require('node-amd-require');
var assert = require('chai').assert;

var basePath = '../../../';
var srcPath = 'main/js/';
var SrlStroke = require(basePath + srcPath + 'sketchLibrary/SrlStroke');
var SrlPoint = require(basePath + srcPath + 'sketchLibrary/SrlPoint');

describe('Shape Tests', function() {
    var x = 10;
    var y = 25.6;
    var time = 80;
    var id = 'id';
    describe('initializations', function() {
        it('should be able to create an instance of the stroke class', function() {
            console.log(SrlStroke);
            var sketch = new SrlStroke();
        });

        it('should be able to create an instance of the stroke class and add a point', function() {
            console.log(SrlStroke);
            var stroke = new SrlStroke();
            stroke.addPoint(new SrlPoint(x, y));
        });
    });
});
