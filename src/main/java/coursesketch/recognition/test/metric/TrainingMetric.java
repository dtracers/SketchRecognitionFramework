package coursesketch.recognition.test.metric;

import java.util.List;

/**
 * Created by David Windows on 7/3/2016.
 */
public class TrainingMetric implements TestingMetric {
    private int totalTemplates;
    private List<Exception> exceptionList;
    private double averageTrainingTime;
    private double maxTime;

    public TrainingMetric(int numTemplates, List<Exception> exceptionList, double averageTrainingTime) {
        totalTemplates = numTemplates;

        this.exceptionList = exceptionList;
        this.averageTrainingTime = averageTrainingTime;
    }

    @Override
    public void setAverageTime(double time) {
        averageTrainingTime = time;
    }

    public int getNumberOfExceptions() {
        return exceptionList.size();
    }

    @Override
    public void setExceptionList(List<Exception> exceptions) {
        exceptionList = exceptions;
    }

    public List<Exception> getExceptionList() {
        return exceptionList;
    }

    @Override
    public double getAverageTime() {
        return averageTrainingTime;
    }

    @Override
    public double getMaxTime() {
        return maxTime;
    }

    @Override
    public void setMaxTime(double time) {
        this.maxTime = time;
    }

    public String toString() {
        return "Training Metrics: " +
                "\n\tTotal Number of templates:" + totalTemplates +
                "\n\tNumber of training exceptions: " + exceptionList.size() +
                "\n\tTime:" +
                "\n\t\tTrainingTimeNanos: " + averageTrainingTime +
                "\n\t\tTrainingTimeMillis: " + (averageTrainingTime / 1000000.);
    }
}
