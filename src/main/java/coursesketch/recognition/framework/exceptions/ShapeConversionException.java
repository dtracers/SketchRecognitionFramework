package coursesketch.recognition.framework.exceptions;

/**
 * Created by David Windows on 4/20/2016.
 */
public class ShapeConversionException extends RecognitionException {
    public ShapeConversionException(final String message) {
        super(message);
    }

    public ShapeConversionException(final String message, final Throwable cause) {
        super(message, cause);
    }
}
