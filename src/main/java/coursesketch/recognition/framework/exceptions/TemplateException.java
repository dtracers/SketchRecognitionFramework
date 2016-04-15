package coursesketch.recognition.framework.exceptions;

/**
 * An exception when something goes wrong with templates.
 *
 * Created by David Windows on 4/14/2016.
 */
public class TemplateException extends RecognitionException {

    /**
     * Creates an exception with a message.
     *
     * @param message The message of the exception.
     */
    public TemplateException(final String message) {
        super(message);
    }

    /**
     * Creates an exception with a cause.
     *
     * @param message The message of the exception.
     * @param cause
     */
    public TemplateException(final String message, final Throwable cause) {
        super(message, cause);
    }
}
