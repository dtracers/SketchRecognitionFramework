package coursesketch.recognition.test.score;

import coursesketch.recognition.framework.RecognitionInterface;

/**
 * Created by david on 7/5/16.
 */
public interface TrainingScoreFactory {
    public TrainingScore createTrainingScore(RecognitionInterface recognitionSystem, String templateId);
}
