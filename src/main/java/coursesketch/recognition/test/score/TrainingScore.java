package coursesketch.recognition.test.score;

import coursesketch.recognition.framework.RecognitionInterface;
import coursesketch.recognition.test.RecognitionTestException;

/**
 * Created by David Windows on 7/3/2016.
 */
public class TrainingScore {
    private final RecognitionInterface recognitionSystem;
    private final String templateId;
    private RecognitionTestException exception;
    private long trainingTime;
    public TrainingScore(RecognitionInterface recognitionSystem, String templateId) {

        this.recognitionSystem = recognitionSystem;
        this.templateId = templateId;
    }

    public void addException(RecognitionTestException e) {

        exception = e;
    }

    public void setTrainingTime(long trainingTime) {
        this.trainingTime = trainingTime;
    }

    public long getTrainingTime() {
        return trainingTime;
    }

    public boolean hasException() {
        return exception != null;
    }

    public RecognitionTestException getException() {
        return exception;
    }
}
