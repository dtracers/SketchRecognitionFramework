package coursesketch.recognition.test.converter;

import coursesketch.recognition.framework.RecognitionInterface;
import coursesketch.recognition.test.score.RecognitionScore;
import coursesketch.recognition.test.score.TrainingScore;

import java.util.List;

/**
 * Created by david on 7/5/16.
 */
public interface ScoreMetricsConverterFactory {
        ScoreMetricsConverter getScoreMetricsConverter(RecognitionInterface recognitionSystem,
                                                       List<TrainingScore> trainingScores,
                                                       List<RecognitionScore> recognitionScores);
}
