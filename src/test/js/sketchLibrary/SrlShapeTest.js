require('node-define');
require('node-amd-require');
var expect = require('chai').expect;

var basePath = '../../../';
var srcPath = 'main/js/';
var SrlShape = require(basePath + srcPath + 'sketchLibrary/SrlShape');
var SrlStroke = require(basePath + srcPath + 'sketchLibrary/SrlStroke');
var SrlPoint = require(basePath + srcPath + 'sketchLibrary/SrlPoint');

describe('Shape Tests', function () {
    var x = 10;
    var y = 25.6;
    var time = 80;
    var id = 'id';
    describe('initializations', function () {
        it('should be able to create an instance of the shape class', function () {
            var sketch = new SrlShape();
        });

        it('should be able to create an instance of the stroke class and add a point', function () {
            var stroke = new SrlStroke();
            stroke.addPoint(new SrlPoint(x, y));

            var shape = new SrlShape();
            shape.add(stroke);
            console.log(shape);
        });
    });

    describe('functions', function () {
        var strokeList = [];
        var shapeList = [];
        beforeEach(function () {
            strokeList = [];
            shapeList = [];
            for (var i = 0; i < 10; i++) {
                var stroke = new SrlStroke();
                stroke.id = 'stroke' + i;
                stroke.addPoint(new SrlPoint(x, y));
                strokeList.push(stroke);
                var shape = new SrlShape();
                shape.id = 'shape' + i;
                shapeList.push(shape);
            }
        });
        it('should be able to get recursive sub objects', function () {
            var result = [];
            for (var i = 0; i < 9; i++) {
                shapeList[i].add(strokeList[i]);
                shapeList[i].add(shapeList[i + 1]);
                result.push(strokeList[i]);
                result.push(shapeList[i + 1]);
            }
            expect(shapeList[0].getRecursiveSubObjects()).to.have.members(result);
        });

        it('should be able to get recursive strokes', function () {
            for (var i = 0; i < 9; i++) {
                shapeList[i].add(strokeList[i]);
                shapeList[i].add(shapeList[i + 1]);
            }
            strokeList.pop();
            expect(shapeList[0].getRecursiveStrokes()).to.have.members(strokeList);
        });

        it('should only have one stroke in it if the shape is removed', function () {
            for (var i = 0; i < 9; i++) {
                shapeList[i].add(strokeList[i]);
                shapeList[i].add(shapeList[i + 1]);
            }
            shapeList[0].removeSubObjectById(shapeList[1].getId());
            expect(shapeList[0].getRecursiveStrokes()).to.have.members([strokeList[0]]);
            expect(shapeList[0].getRecursiveSubObjects()).to.have.members([strokeList[0]]);
        });
    });
});
