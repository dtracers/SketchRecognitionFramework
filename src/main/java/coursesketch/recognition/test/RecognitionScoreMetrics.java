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

    private final String simpleName;
    private List<TrainingScore> trainingScores;
    private List<RecognitionScore> recognitionScores;
    private RecognitionMetric recognitionMetric;
    private TrainingMetric trainingMetric;

    public RecognitionScoreMetrics(String simpleName, List<TrainingScore> trainingScores, List<RecognitionScore> recognitionScores) {
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
            averageTrainingTime += ((double) trainingScore.getTrainingTime()) / numTemplates;
        }
        return new TrainingMetric((int) numTemplates, trainingException, averageTrainingTime);
    }

    public RecognitionMetric computeRecognitionMetrics(List<RecognitionScore> recognitionScores) {
        double averageScore = 0;
        double averageScoreOfCorrect = 0;
        double numberCorrect = 0;
        double numTemplates = 0;
        double averageRecognitionTime = 0;
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
        for (RecognitionScore recognitionScore : recognitionScores) {
            if (recognitionScore == null) {
                LOG.debug("RECOGNITION SCORE IS NULL");
                continue;
            }
            averageRecognitionTime += ((double) recognitionScore.getRecognitionTime()) / numTemplates;
        }
        averageScore /= numTemplates;
        averageScoreOfCorrect /= numberCorrect;
        LOG.debug("Finished Computing metrics");
        return new RecognitionMetric(averageScore, averageScoreOfCorrect,
                (int) numberCorrect, nonRecognizedIds, potentialMisRecognized,
                (int) numTemplates, recognitionException, averageRecognitionTime);
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
