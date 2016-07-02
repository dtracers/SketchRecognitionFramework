package coursesketch.recognition.test;

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
    private boolean recognized;
    private double scoreValue;
    private boolean potentialMissRecognized;
    private boolean notRecognized;
    private List<Sketch.SrlInterpretation> recognizedInterpretations;
    private Sketch.SrlInterpretation correctInterpretations;

    public RecognitionScore(RecognitionInterface recognitionSystem, String templateId) {
        this.recognitionSystem = recognitionSystem;
        this.templateId = templateId;
    }

    public void setFailed(Exception exception) {
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
}
