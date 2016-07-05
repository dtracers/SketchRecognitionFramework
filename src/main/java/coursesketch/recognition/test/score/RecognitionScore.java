package coursesketch.recognition.test.score;

import coursesketch.recognition.framework.RecognitionInterface;
import coursesketch.recognition.framework.exceptions.RecognitionException;
import protobuf.srl.sketch.Sketch;

import java.util.List;

/**
 * A score of the recognition system.
 *
 * This holds number of exceptions, number of false positives,
 * number of false negatives, true positives and true negatives
 */
public class RecognitionScore {
    private final RecognitionInterface recognitionSystem;
    private String templateId;
    private Exception exception;
    private int recognizedIndex = -1;
    private double scoreValue;
    private boolean potentialMissRecognized;
    private boolean notRecognized;
    private List<Sketch.SrlInterpretation> recognizedInterpretations;
    private Sketch.SrlInterpretation correctInterpretations;
    /**
     * The time the recognition took in nano seconds
     */
    private long recognitionTime;

    public RecognitionScore(RecognitionInterface recognitionSystem, String templateId) {
        this.recognitionSystem = recognitionSystem;
        this.templateId = templateId;
    }

    public void setFailed(Exception exception) {
        this.exception = exception;
    }

    public void setRecognized(int recognizedIndex) {
        this.recognizedIndex = recognizedIndex;
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
        return recognizedIndex > 0;
    }

    public boolean isTrueRecognized() {
        return recognizedIndex == 0;
    }

    /**
     * The order at which it was recognized.
     *
     * 0 being the best option and the larger the number the worse it is
     * -1 is not recognized
     * @return
     */
    public int getRecognizedIndex() {
        return recognizedIndex;
    }

    public Exception getException() {
        return exception;
    }

    public RecognitionInterface getRecognitionSystem() {
        return recognitionSystem;
    }

    public String getTemplateId() {
        return templateId;
    }

    public void setRecognizedInterpretations(List<Sketch.SrlInterpretation> recognizedInterpretations) {
        this.recognizedInterpretations = recognizedInterpretations;
    }

    public void setCorrectInterpretations(Sketch.SrlInterpretation correctInterpretations) {
        this.correctInterpretations = correctInterpretations;
    }

    public Sketch.SrlInterpretation getCorrectInterpretations() {
        return correctInterpretations;
    }

    public List<Sketch.SrlInterpretation> getRecognizedInterpretations() {
        return recognizedInterpretations;
    }

    public void setRecognitionTime(long recognitionTime) {
        this.recognitionTime = recognitionTime;
    }

    public long getRecognitionTime() {
        return recognitionTime;
    }
}
