package coursesketch.recognition.test;

import coursesketch.recognition.framework.RecognitionInterface;
import coursesketch.recognition.framework.exceptions.RecognitionException;

/**
 * Created by turnerd on 7/1/16.
 */
public class RecognitionTestException extends RecognitionException {
    private RecognitionInterface systemCause;

    public RecognitionTestException(String message, RecognitionInterface systemCause) {
        super(message);
        this.systemCause = systemCause;
    }

    public RecognitionTestException(String message, Throwable cause, RecognitionInterface systemCause) {
        super(message, cause);
        this.systemCause = systemCause;
    }

    public RecognitionInterface getSystemCause() {
        return systemCause;
    }
}
