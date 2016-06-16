define([], function() {

    /**
     * Returns true if an object is not defined.
     *
     * This is if it is actually equal to undefined OR is null.
     *
     * @param {Object} object - the object that is being tested.
     * @returns {Boolean} true if the object is not defined.  (Only not defined being null will return false)
     */
    var isUndefined = function(object) {
        return typeof object === 'undefined' || object == null;
    };

    /**
     * Sets up inheritance for functions.
     *
     * {@code Inherits(SubClass, SuperClass);}
     * Inside the sub class this method should be the first method called:
     * {@code this.superConstructor(params)}.
     *
     * @function Inherits
     * @param {*} Child - The class that is inheriting the super class.  It is the subclass.
     * @param {*} Parent - The parent class. It is the super class.
     */
    var Inherits = function(Child, Parent) {
        var localScope = Child;
        localScope.prototype = new Parent();
        localScope.prototype.constructor = localScope;

        /**
         * Calls the parent class constructor.
         */
        var callParent = function() {
            if (arguments.length >= 1) {
                Parent.apply(this, arguments);
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
                callParent.bind(this).apply(this, arguments);
                // console.log('Setting back to current constructor' +
                // localConstructor);
                this.superConstructor = localConstructor;
            };
        } else {
            /**
             * SuperConstructor.
             */
            localScope.prototype.superConstructor = function() {
                callParent.bind(this).apply(this, arguments);
            };
        }
    };

    /**
     * Generates an rfc4122 version 4 compliant solution.
     *
     * Found at {@link http://stackoverflow.com/a/2117523/2187510} and further improved at
     * {@link http://stackoverflow.com/a/8809472/2187510}
     *
     * @returns {String} A unique id.
     */
    function generateUuid() {
        /* jshint ignore:start */
        var d = new Date().getTime();
        var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
            var r = (d + Math.random() * 16) % 16 | 0;
            d = Math.floor(d / 16);
            return (c === 'x' ? r : (r & 0x7 | 0x8)).toString(16);
        });
        return uuid;
        /* jshint ignore:end */
    }

    /**
     * Creates a number that represents the current time in milliseconds since jan 1st 1970.
     *
     * @return {Number} milliseconds since jan 1st 1970
     */
    function createTimeStamp() {
        return new Date().getTime();
    }

    return {
        isUndefined: isUndefined,
        Inherits: Inherits,
        generateUuid: generateUuid,
        createTimeStamp: createTimeStamp
    };

});
