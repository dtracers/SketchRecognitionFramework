package coursesketch.recognition.test.metric;

import coursesketch.recognition.test.score.RecognitionScore;

import java.util.List;

/**
 * Created by David Windows on 7/2/2016.
 */
public class RecognitionMetric implements TestingMetric {
    private double averageScore;
    private double averageScoreOfCorrect;
    private int numberCorrect;
    private List<RecognitionScore> nonRecognizedIds;
    private List<RecognitionScore> potentialMisRecognized;
    private int totalTemplates;
    private List<Exception> recognitionException;
    private double averageRecognitionTime;
    private double precision;
    private double recall;
    private double fscore;
    private int numberTrueCorrect;
    private double maxTime;

    public RecognitionMetric() {
    }

    public void calculateExtraValues() {
        precision = ((double) numberTrueCorrect) / ((double) potentialMisRecognized.size());
        recall = ((double) numberTrueCorrect) / ((double) nonRecognizedIds.size());
        fscore = 2.0 * (precision * recall) / (precision + recall);
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
        return "Recognition Metrics: " +
                "\n\tScores:" +
                "\n\t\tRecall:" + recall +
                "\n\t\tPrecision" + precision +
                "\n\t\tFScore" + fscore +
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
                "\n\tNumber fo recognition exceptions: " + recognitionException.size() +
                "\n\tPerformance:" +
                "\n\t\tRecognitionTimeNanos: " + averageRecognitionTime +
                "\n\t\tRecognitionTimeMillis: " + (averageRecognitionTime / 1000000.) +
                "\n\t\tMax Recognition time: " + maxTime;
    }

    public int getTotalTemplates() {
        return totalTemplates;
    }

    public void setAverageScore(double averageScore) {
        this.averageScore = averageScore;
    }

    public void setAverageScoreOfCorrect(double averageScoreOfCorrect) {
        this.averageScoreOfCorrect = averageScoreOfCorrect;
    }

    public void setNumberCorrectTop5(int numberCorrect) {
        this.numberCorrect = numberCorrect;
    }

    public void setNonRecognizedIds(List<RecognitionScore> nonRecognizedIds) {
        this.nonRecognizedIds = nonRecognizedIds;
    }

    public void setPotentialMisRecognized(List<RecognitionScore> potentialMisRecognized) {
        this.potentialMisRecognized = potentialMisRecognized;
    }

    public void setTotalTemplates(int totalTemplates) {
        this.totalTemplates = totalTemplates;
    }

    public void setExceptionList(List<Exception> recognitionException) {
        this.recognitionException = recognitionException;
    }

    @Override
    public void setAverageTime(double averageRecognitionTime) {
        this.averageRecognitionTime = averageRecognitionTime;
    }

    public void setNumberTrueCorrect(int numberTrueCorrect) {
        this.numberTrueCorrect = numberTrueCorrect;
    }

    @Override
    public int getNumberOfExceptions() {
        return recognitionException.size();
    }

    @Override
    public List<Exception> getExceptionList() {
        return recognitionException;
    }

    @Override
    public double getAverageTime() {
        return averageRecognitionTime;
    }

    @Override
    public double getMaxTime() {
        return maxTime;
    }

    @Override
    public void setMaxTime(double time) {
        this.maxTime = time;
    }
}
