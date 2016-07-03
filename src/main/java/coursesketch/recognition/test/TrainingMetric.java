package coursesketch.recognition.test;

import java.util.List;

/**
 * Created by David Windows on 7/3/2016.
 */
public class TrainingMetric {
    private int totalTemplates;
    private final List<Exception> exceptionList;
    private final double averageTrainingTime;

    public TrainingMetric(int numTemplates, List<Exception> exceptionList, double averageTrainingTime) {
        totalTemplates = numTemplates;

        this.exceptionList = exceptionList;
        this.averageTrainingTime = averageTrainingTime;
    }

    public int getNumberOfExceptions() {
        return exceptionList.size();
    }

    public List<Exception> getExceptionList() {
        return exceptionList;
    }

    public double getAverageTrainingTime() {
        return averageTrainingTime;
    }

    public String toString() {
        return "Metrics: " +
                "\n\tTotal Number of templates:" + totalTemplates +
                "\n\tNumber fo recognition exceptions: " + exceptionList.size() +
                "\n\tTime:" +
                "\n\t\tRecognitionTimeNanos: " + averageTrainingTime +
                "\n\t\tRecognitionTimeMillis: " + (averageTrainingTime / 1000000.);
    }
}
