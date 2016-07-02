package coursesketch.recognition.test;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by turnerd on 7/1/16.
 */
public class RecognitionScoreMetrics {

    /**
     * Declaration and Definition of Logger.
     */
    private static final Logger LOG = LoggerFactory.getLogger(RecognitionScoreMetrics.class);

    private List<Exception> exceptions;
    private List<RecognitionScore> recognitionScores;

    public RecognitionScoreMetrics(List<Exception> exceptions, List<RecognitionScore> recognitionScores) {
        this.exceptions = exceptions;
        this.recognitionScores = recognitionScores;
    }

    public int getNumberOfTrainingException() {
        return exceptions.size();
    }

    public List<Exception> getTrainingExceptions() {
        return exceptions;
    }

    public double getAverageScore() {
        double score = 0;
        for (RecognitionScore recognitionScore : recognitionScores) {
            score += (recognitionScore.getScoreValue() / ((double) recognitionScores.size()));
        }
        return score;
    }

    public List<RecognitionScore> getScores() {
        return recognitionScores;
    }

    public void computeMetrics() {
        computeMetrics(recognitionScores);
    }

    public RecognitionMetric computeMetrics(List<RecognitionScore> recognitionScores) {
        double averageScore = 0;
        double averageScoreOfCorrect = 0;
        int numberCorrect = 0;
        List<RecognitionScore> nonRecognizedIds = new ArrayList<>();
        List<RecognitionScore> potentialMisRecognized = new ArrayList<>();
        List<Exception> recognitionException = new ArrayList<>();
        LOG.debug("Computing metrics");
        for (RecognitionScore recognitionScore : recognitionScores) {
            averageScore += recognitionScore.getScoreValue()  / ((double) recognitionScores.size());
            if (recognitionScore.isRecognized()) {
                averageScoreOfCorrect += recognitionScore.getScoreValue();
                numberCorrect++;
            }
            if (recognitionScore.isNotRecognized()) {
                nonRecognizedIds.add(recognitionScore);
            }
            if (recognitionScore.isPotentialMissRecognized()) {
                potentialMisRecognized.add(recognitionScore);
            }
            if (recognitionScore.getException() != null) {
                recognitionException.add(recognitionScore.getException());
            }
        }
        averageScoreOfCorrect /= (double) numberCorrect;
        LOG.debug("Finished Computing metrics");
        return new RecognitionMetric(averageScore, averageScoreOfCorrect,
                numberCorrect, nonRecognizedIds, potentialMisRecognized, recognitionScores.size(), recognitionException);
    }
}
