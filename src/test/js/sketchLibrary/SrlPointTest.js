require('node-define');
require('node-amd-require');
var assert = require('chai').assert;
var expect = require('chai').expect;

var basePath = '../../../';
var srcPath = 'main/js/';
var SrlPoint = require(basePath + srcPath + 'sketchLibrary/SrlPoint');
var SketchException = require(basePath + srcPath + 'sketchLibrary/SketchLibraryException');
var ProtoPoint = require(basePath + srcPath + 'generated_proto/sketch').protobuf.srl.sketch.SrlPoint;

describe('Point Tests', function () {
    var x = 10;
    var y = 25.6;
    var time = 80;
    var id = 'id';
    describe('initializations', function () {
        it('should be able to create an instance of the point class', function () {
            var sketch = new SrlPoint();
        });
        it('should be able to create an instance of the point class initialized with two values', function () {
            var point = new SrlPoint(x, y);
            expect(point.getX()).to.equal(x);
            expect(point.getY()).to.equal(y);
        });
        it('set all values of the point', function () {
            var point = new SrlPoint(x, y);
            point.setTime(time);
            point.setId(id);
            expect(point.getX()).to.equal(x);
            expect(point.getY()).to.equal(y);
            expect('' + point.getTime()).to.equal('' + time);
            expect(point.getId()).to.equal(id);
        });
        it('can not set x and y separately', function () {
            var point = new SrlPoint(x, y);
            expect(function () {
                point.setX(5);
            }).to.throw(SketchException);
            expect(function () {
                point.setY(5);
            }).to.throw(SketchException);
        });
    });

    describe('protobuf', function () {
        it('should be able to create an arraybuffer', function () {
            var point = new SrlPoint();
            point.setP(x, y);
            point.setTime(time);
            point.setId(id);
            var arrayBuffer = point.toArrayBuffer();
            var decoded = ProtoPoint.decode(arrayBuffer);
            expect(decoded.getX()).to.equal(x);
            expect(decoded.getY()).to.equal(y);
            expect('' + decoded.getTime()).to.equal('' + time);
            expect(decoded.getId()).to.equal(id);
        });

        it('should be able to parse an array buffer', function () {
            var protoPoint = new ProtoPoint();
            protoPoint.setX(x);
            protoPoint.setY(y);
            protoPoint.setTime(time);
            protoPoint.setId(id);
            var arrayBuffer = protoPoint.toArrayBuffer();
            var decoded = SrlPoint.decode(arrayBuffer);
            expect(decoded.getX()).to.equal(x);
            expect(decoded.getY()).to.equal(y);
            expect('' + decoded.getTime()).to.equal('' + time);
            expect(decoded.getId()).to.equal(id);
        });
    });
});
