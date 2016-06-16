define([ './../sketchLibrary/SketchLibraryException', './classCreator' ], function(SketchException, protobufUtils) {

    /**
     * An exception for general problems with arguments.
     *
     * @param {String} message - The optional message of the exception.
     * @param {Error | SketchLibraryException} cause - The optional cause of the exception.
     * @constructor
     * @extends SketchLibraryException
     */
    function ArgumentException(message, cause) {
        this.superConstructor(message, cause);
        this.name = 'ArgumentException';
    }
    protobufUtils.Inherits(ArgumentException, SketchException);

    /**
     * An exception for when something unsupported happens.
     *
     * @param {String} message - The optional message of the exception.
     * @param {Error | SketchLibraryException} cause - The optional cause of the exception.
     * @constructor
     * @extends SketchLibraryException
     */
    function UnsupportedException(message, cause) {
        this.superConstructor(message, cause);
        this.name = 'UnsupportedException';
    }
    protobufUtils.Inherits(UnsupportedException, SketchException);

    return {
        ArgumentException: ArgumentException,
        UnsupportedException: UnsupportedException
    };
});
