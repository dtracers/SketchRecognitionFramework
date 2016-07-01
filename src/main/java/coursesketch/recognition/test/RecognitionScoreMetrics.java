package coursesketch.recognition.test;

import java.util.List;

/**
 * Created by turnerd on 7/1/16.
 */
public class RecognitionScoreMetrics {
    private List<Exception> exceptions;
    private List<RecognitionScore> recognitionScores;

    public RecognitionScoreMetrics(List<Exception> exceptions, List<RecognitionScore> recognitionScores) {
        this.exceptions = exceptions;
        this.recognitionScores = recognitionScores;
    }

    public int getNumberOfTrainingException() {
        return exceptions.size();
    }
}
