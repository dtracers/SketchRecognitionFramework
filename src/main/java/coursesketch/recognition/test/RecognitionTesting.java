package coursesketch.recognition.test;

import coursesketch.recognition.framework.RecognitionInterface;
import coursesketch.recognition.framework.TemplateDatabaseInterface;
import coursesketch.recognition.framework.exceptions.RecognitionException;
import coursesketch.recognition.framework.exceptions.TemplateException;
import coursesketch.recognition.test.converter.ScoreMetricsConverter;
import coursesketch.recognition.test.converter.ScoreMetricsConverterFactory;
import coursesketch.recognition.test.score.RecognitionScore;
import coursesketch.recognition.test.score.RecognitionScoreFactory;
import coursesketch.recognition.test.score.TrainingScore;
import coursesketch.recognition.test.score.TrainingScoreFactory;
import protobuf.srl.sketch.Sketch;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.*;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

/**
 * A class used to test Recognition systems.
 */
public class RecognitionTesting {

    /**
     * Declaration and Definition of Logger.
     */
    private static final Logger LOG = LoggerFactory.getLogger(RecognitionTesting.class);

    private TemplateDatabaseInterface databaseInterface;
    private RecognitionInterface[] recognitionSystems;
    private int MAX_THREADS = 500;

    ExecutorService executor;
    protected RecognitionScoreFactory recognitionFactory = new DefaultRecognitionScoreFactory();
    protected TrainingScoreFactory trainingFactory = new DefaultTrainingScoreFactory();
    private ScoreMetricsConverterFactory converterFactory = new DefaultScoreMetricsConverterFactory();

    /**
     *
     * @param databaseInterface
     * @param recognitionSystems A list of systems that are not initialized and are then used for testing.
     */
    public RecognitionTesting(TemplateDatabaseInterface databaseInterface, RecognitionInterface... recognitionSystems) {

        this.databaseInterface = databaseInterface;
        this.recognitionSystems = recognitionSystems;
    }

    public void setRecognitionScoreFactory(RecognitionScoreFactory recognitionFactory) {
        this.recognitionFactory = recognitionFactory;
    }

    public void setTrainingScoreFactory(TrainingScoreFactory trainingFactory) {
        this.trainingFactory = trainingFactory;
    }

    public void setScoreMetricsConverterFactory(ScoreMetricsConverterFactory converterFactory) {
        this.converterFactory = converterFactory;
    }

    public List<ScoreMetricsConverter> testAgainstAllTemplates() throws TemplateException {
        return testAgainstTemplates(databaseInterface.getAllTemplates());
    }

    public List<ScoreMetricsConverter> testAgainstInterpretation(Sketch.SrlInterpretation interpretation)
            throws TemplateException {
        return testAgainstTemplates(databaseInterface.getTemplate(interpretation));
    }

    /**
     * This uses cross validation to test against templates.
     */
    public List<ScoreMetricsConverter> testAgainstTemplates(List<Sketch.RecognitionTemplate> allTemplates)
            throws TemplateException {

        List<Sketch.RecognitionTemplate> testTemplates = splitTrainingAndTest(allTemplates);

        Map<RecognitionInterface, List<TrainingScore>> trainingScores = trainAgainstTemplates(allTemplates);

        Map<RecognitionInterface, List<RecognitionScore>> recognitionScore =
                recognizeAgainstTemplates(testTemplates);

        List<ScoreMetricsConverter> metrics = new ArrayList<>();
        for (RecognitionInterface recognitionSystem : recognitionSystems) {
            ScoreMetricsConverter scoreMetricsConverter = converterFactory.getScoreMetricsConverter(recognitionSystem,
                    trainingScores.get(recognitionSystem), recognitionScore.get(recognitionSystem));
            scoreMetricsConverter.computeRecognitionMetrics();
            metrics.add(scoreMetricsConverter);
        }
        return metrics;
    }

    protected List<Sketch.SrlInterpretation> testTemplate(Sketch.RecognitionTemplate testTemplate,
                                                          RecognitionInterface recognitionSystem,
                                                          RecognitionScore score) {
        List<Sketch.SrlInterpretation> recognize = null;
        try {
            recognize = recognitionSystem.recognize(testTemplate.getTemplateId(), testTemplate);
        } catch (Exception e) {
            score.setNotRecognized(true);
            score.setFailed(e);
        }
        return recognize;
    }

    public Map<RecognitionInterface, List<RecognitionScore>> recognizeAgainstTemplates(
            List<Sketch.RecognitionTemplate> testTemplates) {
        Map<RecognitionInterface, List<RecognitionScore>> scoreMap = new HashMap<>();

        // For the specific number of threads needed
        executor = Executors.newFixedThreadPool(Math.min(MAX_THREADS, Math.max(1, testTemplates.size() / 20)));

        LOG.debug("Running recognition test for {} templates", testTemplates.size());
        int percent = (int) Math.round(Math.max(1.0, testTemplates.size() / 100.0));
        for (RecognitionInterface recognitionSystem : recognitionSystems) {
            List<RecognitionScore> recognitionScoreList = new ArrayList<>();
            scoreMap.put(recognitionSystem, recognitionScoreList);
            int counter = 0;
            LOG.debug("testing recognition system: {}", recognitionSystem.getClass().getSimpleName());
            List<Future> taskFutures = new ArrayList<>();
            for (Sketch.RecognitionTemplate testTemplate : testTemplates) {
                final int thisCount = counter;
                taskFutures.add(executor.submit((Callable) () -> {
                    RecognitionScore score = recognitionFactory.createRecognitionScore(recognitionSystem,
                            testTemplate.getTemplateId());
                    long startTime = System.nanoTime();
                    final List<Sketch.SrlInterpretation> interpretations =
                            testTemplate(testTemplate, recognitionSystem, score);
                    generateScore(score, interpretations, testTemplate.getInterpretation());
                    long endTime = System.nanoTime();
                    score.setRecognitionTime(endTime - startTime);
                    recognitionScoreList.add(score);
                    if (thisCount % percent == 0) {
                        LOG.debug("gone through {} sketches, {} left", thisCount, testTemplates.size() - thisCount);
                    }
                    return null;
                }));
                counter++;
            }

            LOG.debug("Waiting for all tasks to finish");
            // Waits for the executor to finish
            waitForFutures(taskFutures);
            LOG.debug("All recognition testing tasks have finished");
        }
        return scoreMap;
    }

    private void waitForFutures(List<Future> taskFutures) {
        for (Future taskFuture : taskFutures) {
            try {
                taskFuture.get();
            } catch (InterruptedException e) {
                LOG.debug("INTERUPTIONS EXCEPTION", e);
            } catch (ExecutionException e) {
                LOG.debug("EXECUTION EXCEPTION", e);
            }
        }
    }

    protected void trainSystem(Sketch.RecognitionTemplate template, RecognitionInterface recognitionSystem,
                               TrainingScore score) {
        try {
            recognitionSystem.trainTemplate(template);
        } catch (Exception e) {
            score.addException(new RecognitionTestException("Error with training template " + template.getTemplateId(),
                    e, recognitionSystem));
        }
    }

    public Map<RecognitionInterface, List<TrainingScore>> trainAgainstTemplates(List<Sketch.RecognitionTemplate> templates) {
        Map<RecognitionInterface, List<TrainingScore>> scoreMap = new HashMap<>();

        executor = Executors.newFixedThreadPool(Math.min(MAX_THREADS, Math.max(1, templates.size() / 5)));

        LOG.debug("Running recognition training for {} templates", templates.size());
        int percent = (int) Math.round(Math.max(1.0, templates.size() / 10.0));
        for (RecognitionInterface recognitionSystem : recognitionSystems) {
            List<TrainingScore> trainingScores = new ArrayList<>();
            scoreMap.put(recognitionSystem, trainingScores);
            int counter = 0;
            LOG.debug("training recognition system: {}", recognitionSystem.getClass().getSimpleName());
            List<Future> taskFutures = new ArrayList<>();
            for (Sketch.RecognitionTemplate template : templates) {
                final int thisCount = counter;
                taskFutures.add(executor.submit((Callable) () -> {
                    TrainingScore score = trainingFactory.createTrainingScore(recognitionSystem, template.getTemplateId());
                    long startTime = System.nanoTime();
                    trainSystem(template, recognitionSystem, score);
                    long endTime = System.nanoTime();
                    score.setTrainingTime(endTime - startTime);
                    trainingScores.add(score);
                    if (thisCount % percent == 0) {
                        LOG.debug("gone through {} sketches, {} left", thisCount, templates.size() - thisCount);
                    }
                    return null;
                }));
                counter++;
            }

            LOG.debug("Waiting for all tasks to finish");
            // Waits for the executor to finish
            waitForFutures(taskFutures);
            finishTraining(recognitionSystem);
            LOG.debug("All trainings tasks have finished");
        }
        return scoreMap;
    }

    protected void finishTraining(RecognitionInterface recognitionSystem) {
        try {
            recognitionSystem.finishTraining();
        } catch (RecognitionException e) {
            LOG.debug("EXCEPTION WHEN TRAINING", e);
        }
    }

    protected void generateScore(RecognitionScore score,
                               List<Sketch.SrlInterpretation> recognize, Sketch.SrlInterpretation interpretation) {
        if (recognize == null) {
            score.setNotRecognized(true);
            score.setFailed(new NullPointerException("List of returned interpretations is null"));
            return;
        }
        double scoreValue = 1;
        int topGuesses = Math.min(5, recognize.size());
        int subtractAmount = 1/topGuesses;
        score.setRecognizedInterpretations(recognize);
        score.setCorrectInterpretations(interpretation);
        for (int i = 0; i < topGuesses; i++) {
            // We won't consider it recognized if it has no confidence in its values
            if (recognize.get(i).getLabel().equals(interpretation.getLabel())
                    && recognize.get(i).getConfidence() > 0) {
                score.setRecognized(i);
                score.setScoreValue(scoreValue * recognize.get(i).getConfidence());
                return;
            }
            if (i == 0) {
                score.setPotentialMissRecognized(true);
            }
            scoreValue -= (subtractAmount);
        }
        score.setNotRecognized(true);
    }

    /**
     * Splits training and test templates.
     *
     * Does modify the input template list.
     * @param allTemplates The list of templates to be split (does modify this list).
     * @return A list of test templates.
     */
    private List<Sketch.RecognitionTemplate> splitTrainingAndTest(List<Sketch.RecognitionTemplate> allTemplates) {
        Random r = new Random();
        List<Sketch.RecognitionTemplate> testTemplates = new ArrayList<>();
        int amountToTakeOut = (int) (((double) allTemplates.size()) * .10);
        LOG.debug("Splitting out {} testing templates", amountToTakeOut);
        for (int i = 0; i < amountToTakeOut; i++) {
            testTemplates.add(allTemplates.remove(r.nextInt(allTemplates.size())));
        }
        LOG.debug("TrainingSet: {}, TestingSet: {}", allTemplates.size(), testTemplates.size());
        return testTemplates;
    }

    private static final class DefaultRecognitionScoreFactory implements RecognitionScoreFactory {
        @Override
        public RecognitionScore createRecognitionScore(RecognitionInterface recognitionSystem, String templateId) {
            return new RecognitionScore(recognitionSystem, templateId);
        }
    }

    private static final class DefaultTrainingScoreFactory implements TrainingScoreFactory {
        @Override
        public TrainingScore createTrainingScore(RecognitionInterface recognitionSystem, String templateId) {
            return new TrainingScore(recognitionSystem, templateId);
        }
    }

    private static final class DefaultScoreMetricsConverterFactory implements ScoreMetricsConverterFactory {

        @Override
        public ScoreMetricsConverter getScoreMetricsConverter(RecognitionInterface recognitionSystem,
                List<TrainingScore> trainingScores, List<RecognitionScore> recognitionScores) {
            return new ScoreMetricsConverter(recognitionSystem.getClass().getSimpleName(),
                    trainingScores, recognitionScores);
        }
    }
}
