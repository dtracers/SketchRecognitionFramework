define([ './../sketchLibrary/SketchLibraryException', './classCreator' ], function(SketchException, protobufUtils) {

    /**
     * An exception for general problems with arrays.
     *
     * @param {String} message - The optional message of the exception.
     * @param {Error | SketchLibraryException} cause - The optional cause of the exception.
     * @constructor
     * @extends SketchLibraryException
     */
    function ArrayException(message, cause) {
        this.superConstructor(message, cause);
        this.name = 'ArrayException';
    }
    protobufUtils.Inherits(ArrayException, SketchException);

    /**
     * Removes the object from an array.
     *
     * @param {Array<*>} array - The array that the object is being removed from.
     * @param {*} object - The object that is being removed from the array.
     * @return {*} the object that was removed if it exist.
     */
    function removeObjectFromArray(array, object) {
        var index = array.indexOf(object);
        if (index !== -1) {
            var result = array[index];
            array.splice(index, 1);
            return result;
        }
        throw new ArrayException('attempt to remove invalid object');
    }

    /**
     * Removes the object from an array.
     *
     * @param {Array<*>} array - The array that the object is being removed from.
     * @param {Number} index - The index at which the item is being removed.
     * @return {*} the object that was removed if it exist.
     */
    function removeObjectByIndex(array, index) {
        if (index !== -1) {
            var result = array[index];
            array.splice(index, 1);
            return result;
        }
        throw new ArrayException('attempt to remove at invalid index');
    }

    /**
     * Checks to see if an item is an instance of an array.
     *
     * @param {Object} object - The item that is being checked.
     * @returns {Boolean} true if it is an array, (hopefully).
     */
    function isArray(object) {
        return object instanceof Array || (Array.isArray && Array.isArray(object));
    }

    return {
        removeObjectFromArray: removeObjectFromArray,
        removeObjectByIndex: removeObjectByIndex,
        isArray: isArray,
        ArrayException: ArrayException
    };
});
