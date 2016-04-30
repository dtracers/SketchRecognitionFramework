package coursesketch.recognition.framework.exceptions;

/**
 * Created by David Windows on 4/14/2016.
 */
public class RecognitionException extends Exception {

    /**
     * Creates an exception with a message.
     *
     * @param message The message of the exception.
     */
    public RecognitionException(final String message) {
        super(message);
    }

    /**
     * Creates an exception with a cause.
     *
     * @param message The message of the exception.
     * @param cause The cause of this exception.
     */
    public RecognitionException(final String message, final Throwable cause) {
        super(message, cause);
    }
}
