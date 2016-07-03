package coursesketch.recognition.test;

/**
 * Created by David Windows on 7/3/2016.
 */
public class TrainingScore {
    private RecognitionTestException exception;
    private long trainingTime;

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
