/**
 * Created by David Windows on 5/17/2016.
 */

define([], function () {

    /**
     * Returns true if an object is not defined.
     *
     * @param {Object} object - the object that is being tested.
     * @returns {Boolean} true if the object is not defined.  (Only not defined being null will return false)
     */
    var isUndefined = function(object) {
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
    var Inherits = function(Child, Parent) {
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
            localConstructor = localScope.prototype.superConstructor = function () {
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
            localScope.prototype.superConstructor = function () {
                callParent.bind(this)(arguments);
            };
        }
    };

    return {
        isUndefined: isUndefined,
        Inherits: Inherits
    };

});
