var assert = require('chai').assert;

var basePath = '../../../';
var srcPath = 'main/js/';
var SrlShape = require(basePath + srcPath + 'sketchLibrary/SrlShape');

describe('Shape Tests', function () {
    describe('initializations', function () {
        it('should be able to create an instance of the shape class', function () {
            console.log(SrlShape);
            var sketch = new SrlShape();
        });
    });
});
