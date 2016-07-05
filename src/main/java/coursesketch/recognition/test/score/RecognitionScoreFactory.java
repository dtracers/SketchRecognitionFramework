package coursesketch.recognition.test.score;

import coursesketch.recognition.framework.RecognitionInterface;

/**
 * Created by david on 7/5/16.
 */
public interface RecognitionScoreFactory {
    public RecognitionScore createRecognitionScore(RecognitionInterface recognitionSystem, String templateId);
}
