define([ 'stacktrace-js' ], function(StackTrace) {

    /**
     * Defines the base exception class that can be extended by all other exceptions.
     *
     * @class SketchLibraryException
     * @param {String} message - The optional message of the exception.
     * @param {Error | SketchLibraryException} cause - The optional cause of the exception.
     * @constructor
     */
    function SketchLibraryException(message, cause) {
        this.name = 'SketchLibraryException';
        this.message = undefined;
        this.stackTrace = undefined;
        this.cause = undefined;

        /**
         * @returns {String} A string representation of the exception.
         */
        this.toString = function() {
            return this.name + ': ' + this.message + (this.specificMessage ? '\n' + this.specificMessage : '\n') + this.stackTrace.join('\n\n');
        };

        this.setMessage(message);
        this.setCause(cause);
        this.createStackTrace();
    }

    /**
     * Assigns the stacktrace object to an existing stacktrace.
     */
    SketchLibraryException.prototype.createStackTrace = function() {
        this.stackTrace = StackTrace();
    };

    /**
     * Sets the message of the Exception.
     *
     * @param {messageValue} messageValue - is a string that contains the description
     *          of the the exception that occurred.
     */
    SketchLibraryException.prototype.setMessage = function(messageValue) {
        this.message = messageValue;
    };

    /**
     * Used to access the stacktrace of the exception without modifying it.
     *
     * @return {Array<String>} Returns a string that contains the entire stacktrace of the exception.
     */
    SketchLibraryException.prototype.getStackTrace = function() {
        return this.stackTrace;
    };

    /**
     * Used to log the stacktrace object in BaseException.
     */
    SketchLibraryException.prototype.printStackTrace = function() {
        if (typeof this.stackTrace === "undefined") {
            this.createStackTrace();
        }
        console.log(this.stackTrace.join('\n\n'));
    };

    /**
     * Sets the cause of baseException to the causeValue passed in.
     *
     * @param {Error | SketchLibraryException} causeValue - Is the cause of the exception.
     */
    SketchLibraryException.prototype.setCause = function(causeValue) {
        this.cause = causeValue;
    };

    /**
     * A getter function used to access the cause of the stacktrace without the risk of manipulating it.
     *
     * @return {Error | SketchLibraryException} The cause of the error.
     */
    SketchLibraryException.prototype.getCause = function() {
        return this.cause;
    };

    return SketchLibraryException;
});
