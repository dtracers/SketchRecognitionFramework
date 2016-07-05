package coursesketch.recognition.test.metric;

import java.util.List;

/**
 * Created by david on 7/4/16.
 */
public interface TestingMetric {
    void setAverageTime(double time);
    int getNumberOfExceptions();

    void setExceptionList(List<Exception> exceptions);
    List<Exception> getExceptionList();

    double getAverageTime();

    /**
     * Returns the single largest value in metric
     * @return
     */
    double getMaxTime();

    void setMaxTime(double time);
}
