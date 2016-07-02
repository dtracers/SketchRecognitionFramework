package coursesketch.recognition.test;

import java.util.List;

/**
 * Created by David Windows on 7/2/2016.
 */
public class RecognitionMetric {
    private final double averageScore;
    private final double averageScoreOfCorrect;
    private final int numberCorrect;
    private final List<RecognitionScore> nonRecognizedIds;
    private final List<RecognitionScore> potentialMisRecognized;
    private int totalTemplates;
    private List<Exception> recognitionException;

    public RecognitionMetric(double averageScore, double averageScoreOfCorrect, int numberCorrect,
                             List<RecognitionScore> nonRecognizedIds, List<RecognitionScore> potentialMisRecognized,
                             int totalTemplates, List<Exception> recognitionException) {
        this.averageScore = averageScore;
        this.averageScoreOfCorrect = averageScoreOfCorrect;
        this.numberCorrect = numberCorrect;
        this.nonRecognizedIds = nonRecognizedIds;
        this.potentialMisRecognized = potentialMisRecognized;
        this.totalTemplates = totalTemplates;
        this.recognitionException = recognitionException;
    }

    public double getAverageScore() {
        return averageScore;
    }

    public double getAverageScoreOfCorrect() {
        return averageScoreOfCorrect;
    }

    public int getNumberCorrect() {
        return numberCorrect;
    }

    public List<RecognitionScore> getNonRecognizedIds() {
        return nonRecognizedIds;
    }

    public List<RecognitionScore> getPotentialMisRecognized() {
        return potentialMisRecognized;
    }

    public String toString() {
        return "Metrics: " +
                "\n\tTotal Number of templates:" + totalTemplates +
                "\n\tTotal Average Score:" + averageScore +
                "\n\tCorrectness:" +
                "\n\t\tNumber Correct: " + numberCorrect +
                "\n\t\tCorrect Percentage: " + (((double) numberCorrect) / ((double) totalTemplates)) +
                "\n\tWrongness:" +
                "\n\t\tNumber Incorrect " + nonRecognizedIds.size() +
                "\n\t\tNonRecognized Percentage: " + (((double) nonRecognizedIds.size())/ ((double) totalTemplates)) +
                "\n\tFalse Positives:" +
                "\n\t\tNumber of False Positives " + potentialMisRecognized.size() +
                "\n\t\tNonRecognized Percentage: " + (((double) potentialMisRecognized.size())/ ((double) totalTemplates)) +
                "\n\tNumber fo recognition exceptions: " + recognitionException.size();
    }

    public int getTotalTemplates() {
        return totalTemplates;
    }

    public List<Exception> getRecognitionExceptions() {
        return recognitionException;
    }
}
