package coursesketch.recognition.test.converter;

import coursesketch.recognition.test.metric.RecognitionMetric;
import coursesketch.recognition.test.metric.TrainingMetric;
import coursesketch.recognition.test.score.RecognitionScore;
import coursesketch.recognition.test.score.TrainingScore;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by turnerd on 7/1/16.
 */
public class ScoreMetricsConverter {

    /**
     * Declaration and Definition of Logger.
     */
    private static final Logger LOG = LoggerFactory.getLogger(ScoreMetricsConverter.class);

    private final String simpleName;
    private List<TrainingScore> trainingScores;
    private List<RecognitionScore> recognitionScores;
    private RecognitionMetric recognitionMetric;
    private TrainingMetric trainingMetric;

    public ScoreMetricsConverter(String simpleName, List<TrainingScore> trainingScores, List<RecognitionScore> recognitionScores) {
        this.simpleName = simpleName;
        this.trainingScores = trainingScores;
        this.recognitionScores = recognitionScores;
    }

    public List<TrainingScore> getTrainingScores() {
        return trainingScores;
    }

    public List<RecognitionScore> getScores() {
        return recognitionScores;
    }

    public void computeRecognitionMetrics() {
        recognitionMetric = computeRecognitionMetrics(recognitionScores);
        trainingMetric = computeTrainingMetrics(trainingScores);
    }

    public TrainingMetric computeTrainingMetrics(List<TrainingScore> trainingScores) {
        List<Exception> trainingException = new ArrayList<>();
        double numTemplates = 0;
        double averageTrainingTime = 0;
        long maxRecognitionTime = 0;
        for (TrainingScore trainingScore : trainingScores) {
            if (trainingScore == null) {
                LOG.debug("RECOGNITION SCORE IS NULL");
                continue;
            }
            numTemplates++;
            if (trainingScore.hasException()) {
                trainingException.add(trainingScore.getException());
            }
        }
        for (TrainingScore trainingScore : trainingScores) {
            if (trainingScore == null) {
                LOG.debug("RECOGNITION SCORE IS NULL");
                continue;
            }
            maxRecognitionTime = Math.max(maxRecognitionTime, trainingScore.getTrainingTime());
            averageTrainingTime += ((double) trainingScore.getTrainingTime()) / numTemplates;
        }
        TrainingMetric metric = new TrainingMetric((int) numTemplates, trainingException, averageTrainingTime);
        metric.setMaxTime(maxRecognitionTime);
        return metric;
    }

    public RecognitionMetric computeRecognitionMetrics(List<RecognitionScore> recognitionScores) {
        double averageScore = 0;
        double averageScoreOfCorrect = 0;
        double numberCorrectTop5 = 0;
        double numTemplates = 0;
        double averageRecognitionTime = 0;
        long maxRecognitionTime = 0;
        int numberOfTrueRecognition = 0;
        List<RecognitionScore> nonRecognizedIds = new ArrayList<>();
        List<RecognitionScore> potentialMisRecognized = new ArrayList<>();
        List<Exception> recognitionException = new ArrayList<>();
        LOG.debug("Computing metrics");
        for (RecognitionScore recognitionScore : recognitionScores) {
            if (recognitionScore == null) {
                LOG.debug("RECOGNITION SCORE IS NULL");
                continue;
            }
            numTemplates++;
            averageScore += recognitionScore.getScoreValue();
            if (recognitionScore.isRecognized()) {
                averageScoreOfCorrect += recognitionScore.getScoreValue();
                numberCorrectTop5++;
            }
            if (recognitionScore.isTrueRecognized()) {
                numberOfTrueRecognition++;
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
        for (RecognitionScore recognitionScore : recognitionScores) {
            if (recognitionScore == null) {
                LOG.debug("RECOGNITION SCORE IS NULL");
                continue;
            }
            averageRecognitionTime += ((double) recognitionScore.getRecognitionTime()) / numTemplates;
            maxRecognitionTime = Math.max(maxRecognitionTime, recognitionScore.getRecognitionTime());
        }
        averageScore /= numTemplates;
        averageScoreOfCorrect /= numberCorrectTop5;
        LOG.debug("Finished Computing metrics");
        RecognitionMetric recognitionMetric = new RecognitionMetric();
        recognitionMetric.setAverageScore(averageScore);
        recognitionMetric.setAverageTime(averageRecognitionTime);
        recognitionMetric.setAverageScoreOfCorrect(averageScoreOfCorrect);
        recognitionMetric.setNumberCorrectTop5((int) numberCorrectTop5);
        recognitionMetric.setNumberTrueCorrect(numberOfTrueRecognition);
        recognitionMetric.setNonRecognizedIds(nonRecognizedIds);
        recognitionMetric.setPotentialMisRecognized(potentialMisRecognized);
        recognitionMetric.setTotalTemplates((int) numTemplates);
        recognitionMetric.setExceptionList(recognitionException);
        recognitionMetric.setAverageTime(averageRecognitionTime);
        recognitionMetric.setMaxTime(maxRecognitionTime);
        return recognitionMetric;
    }

    public String getSimpleName() {
        return simpleName;
    }

    public RecognitionMetric getRecognitionMetric() {
        return recognitionMetric;
    }

    public TrainingMetric getTrainingMetric() {
        return trainingMetric;
    }
}
