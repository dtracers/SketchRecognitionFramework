/**
 * Created by David Windows on 5/17/2016.
 */

/**
 *
 * @param filePath
 */
module.exports.loadClass = function(filePath, fileName, packageList, messageName) {
    var protoRoot = require(filePath + fileName);
    var resultingPackage = protoRoot;
    for (var j = 0; j < packageList.length; j++) {
        resultingPackage = resultingPackage[packageList[j]];
    }
    return resultingPackage.messageName;
};

/**
 * Returns true if an object is not defined.
 *
 * @param {Object} object - the object that is being tested.
 * @returns {Boolean} true if the object is not defined.  (Only not defined being null will return false)
 */
module.exports.isUndefined = function isUndefined(object) {
    return typeof object === 'undefined';
};

/**
 * @function Inherits
 * sets up inheritance for functions
 *
 * this.Inherits(SuperClass); // super call inside object AND
 * SubClass.Inherits(SuperClass);
 *
 * @param {*} Parent - The parent class.
 */
module.exports.Inherits = function(Child, Parent) {
    var localScope = Child;
    localScope.prototype = new Parent();
    localScope.prototype.constructor = localScope;

    var callParent = function () {
        if (arguments.length >= 1) {
            Parent.apply(this, Array.prototype.slice.call(arguments, 0));
        } else {
            Parent.apply(this);
        }
        this.parentClass = Parent;
    };
    if (!isUndefined(Parent.prototype.superConstructor)) {
        var parentConstructor = Parent.prototype.superConstructor;
        var localConstructor = undefined;
        /**
         * Super constructor.
         *
         * @type {Function}
         */
        localConstructor = localScope.prototype.superConstructor = function() {
            // special setting
            this.superConstructor = parentConstructor;
            // console.log('Setting parent constructor' + parent);
            callParent.bind(this)(arguments);
            // console.log('Setting back to current constructor' +
            // localConstructor);
            this.superConstructor = localConstructor;
        };
    } else {
        /**
         * SuperConstructor.
         */
        localScope.prototype.superConstructor = function() {
            callParent.bind(this)(arguments);
        };
    }
};

/**
 * Decodes the data and preserves the bytebuffer for later use.
 *
 * @param {ArrayBuffer} data
 *            a compiled set of data in the protobuf object.
 * @param {Message} proto - The protobuf object that is being decoded.
 * @param {Function} [onError] - A callback that is called when an error occurs regarding marking and resetting.
 *            (optional). This will be called before the result is returned
 *
 * @return {Message | undefined} decoded protobuf object.  (This may return undefined)
 */
module.exports.decode = function(data, proto, onError) {
    if (isUndefined(data) || data === null || typeof data !== 'object') {
        throw new ProtobufException('Data type is not supported:' + typeof data);
    }
    try {
        data.mark();
    } catch (exception) {
        if (onError) {
            onError(exception);
        }
    }
    var decoded = undefined;

    var protoClass = proto;

    decoded = protoClass.decode(data);
    try {
        data.reset();
    } catch (exception) {
        if (onError) {
            onError(exception);
        }
    }
    return decoded;
};
