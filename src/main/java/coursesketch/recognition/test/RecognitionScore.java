package coursesketch.recognition.test;

import coursesketch.recognition.framework.RecognitionInterface;
import coursesketch.recognition.framework.exceptions.RecognitionException;

/**
 * A score of the recognition system.
 *
 * This holds number of exceptions, number of false positives,
 * number of false negatives, true positives and true negatives
 */
public class RecognitionScore {
    private RecognitionInterface recognitionSystem;
    private Exception exception;
    private boolean recognized;
    private double scoreValue;
    private boolean potentialMissRecognized;
    private boolean notRecognized;

    public RecognitionScore(RecognitionInterface recognitionSystem) {

        this.recognitionSystem = recognitionSystem;
    }

    public void setFailed(RecognitionException exception) {
        this.exception = exception;
    }

    public void setRecognized(boolean recognized) {
        this.recognized = recognized;
    }

    public void setScoreValue(double scoreValue) {
        this.scoreValue = scoreValue;
    }

    public double getScoreValue() {
        return scoreValue;
    }

    public void setPotentialMissRecognized(boolean potentialMissRecognized) {
        this.potentialMissRecognized = potentialMissRecognized;
    }

    public boolean isPotentialMissRecognized() {
        return potentialMissRecognized;
    }

    public void setNotRecognized(boolean notRecognized) {
        this.notRecognized = notRecognized;
    }

    public boolean isNotRecognized() {
        return notRecognized;
    }

    public boolean isRecognized() {
        return recognized;
    }
}
