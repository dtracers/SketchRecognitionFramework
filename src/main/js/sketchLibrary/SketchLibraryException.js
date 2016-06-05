/**
 * Created by dtracers on 5/17/2016.
 */
define(['stacktrace-js'], function (StackTrace) {
    var errback = function(err) { console.log(err.message); };

    /**
     * @class SketchLibraryException
     * Defines the base exception class that can be extended by all other exceptions.
     * @param message The optional message of the exception.
     * @param cause The optional cause of the exception.
     * @constructor
     */
    function SketchLibraryException(message, cause) {

        this.name = 'SketchLibraryException';
        /**
         * The level defines how bad it is. level 5 is the okayest exception
         * (with 6+ typically being ignored completely) and level 0 is the worst
         * exception (with <0 being treated as 0).
         */
        this.message = undefined;
        this.stackTrace = undefined;
        this.cause = undefined;

        /**
         * @returns {String} A string representation of the exception.
         */
        this.toString = function() {
            return this.name + ': ' + this.message + (this.specificMessage ? '\n' + this.specificMessage : '\n') + this.stackTrace.join('\n\n');
        };

        /**
         * Sets the message of the Exception.
         *
         * @param {messageValue} messageValue - is a string that contains the description
         *          of the the exception that occurred.
         */
        this.setMessage = function(messageValue) {
            this.specificMessage = messageValue;
        };

        /**
         * Used to access the stacktrace of the exception without modifying it.
         * @return {stackTrace} Returns a string that contains the entire stacktrace of the exception.
         */
        this.getStackTrace = function() {
            return this.stackTrace;
        };

        /**
         * Used to log the stacktrace object in BaseException.
         */
        this.printStackTrace = function() {
            if (typeof this.stackTrace === "undefined") {
                this.createStackTrace();
            }
            console.log(this.stackTrace.join('\n\n'));
        };

        /**
         * Assigns the stacktrace object to an existing stacktrace.
         */

        /**
         * Sets the cause of baseException to the causeValue passed in.
         *
         * @param {causeValue} causeValue - Is the cause of the exception.
         */
        this.setCause = function(causeValue) {
            this.cause = causeValue;
        };

        /**
         *  A getter function used to access the cause of the stacktrace without the risk of manipulating it.
         */
        this.getCause = function() {
            return this.cause;
        };

        this.setMessage(message);
        this.setCause(cause);
        this.createStackTrace();
    }

    SketchLibraryException.prototype.createStackTrace = function() {
        this.stackTrace = StackTrace();
    };

    return SketchLibraryException;
});
