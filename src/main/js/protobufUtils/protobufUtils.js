define([ './classCreator', './sketchProtoConverter', './ArrayUtils', './ExceptionUtils' ],
function(classUtils, converterUtils, arrayUtils, exceptionUtils) {
    return {
        classUtils: classUtils,
        converterUtils: converterUtils,
        arrayUtils: arrayUtils,
        exceptionUtils: exceptionUtils
    };
});
