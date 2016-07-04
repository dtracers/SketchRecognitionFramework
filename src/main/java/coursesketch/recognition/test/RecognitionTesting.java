package coursesketch.recognition.test;

import coursesketch.recognition.framework.RecognitionInterface;
import coursesketch.recognition.framework.TemplateDatabaseInterface;
import coursesketch.recognition.framework.exceptions.RecognitionException;
import coursesketch.recognition.framework.exceptions.TemplateException;
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

    /**
     *
     * @param databaseInterface
     * @param recognitionSystems A list of systems that are not initialized and are then used for testing.
     */
    public RecognitionTesting(TemplateDatabaseInterface databaseInterface, RecognitionInterface... recognitionSystems) {

        this.databaseInterface = databaseInterface;
        this.recognitionSystems = recognitionSystems;
    }

    public List<RecognitionScoreMetrics> testAgainstAllTemplates() throws TemplateException {
        return testAgainstTemplates(databaseInterface.getAllTemplates());
    }

    public List<RecognitionScoreMetrics> testAgainstInterpretation(Sketch.SrlInterpretation interpretation)
            throws TemplateException {
        return testAgainstTemplates(databaseInterface.getTemplate(interpretation));
    }

    /**
     * This uses cross validation to test against templates.
     */
    public List<RecognitionScoreMetrics> testAgainstTemplates(List<Sketch.RecognitionTemplate> allTemplates)
            throws TemplateException {

        List<Sketch.RecognitionTemplate> testTemplates = splitTrainingAndTest(allTemplates);

        Map<RecognitionInterface, List<TrainingScore>> trainingScores = trainAgainstTemplates(allTemplates);

        Map<RecognitionInterface, List<RecognitionScore>> recognitionScore =
                recognizeAgainstTemplates(testTemplates);

        List<RecognitionScoreMetrics> metrics = new ArrayList<>();
        for (RecognitionInterface recognitionSystem : recognitionSystems) {
            metrics.add(new RecognitionScoreMetrics(recognitionSystem.getClass().getSimpleName(), trainingScores.get(recognitionSystem),
                    recognitionScore.get(recognitionSystem)));
        }
        return metrics;
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
                taskFutures.add(executor.submit(new Callable(){
                    @Override
                    public Object call() throws Exception {
                        RecognitionScore score = new RecognitionScore(recognitionSystem, testTemplate.getTemplateId());
                        long startTime = System.nanoTime();
                        try {
                            List<Sketch.SrlInterpretation>
                                    recognize = recognitionSystem.recognize(testTemplate.getTemplateId(), testTemplate);
                            long endTime = System.nanoTime();
                            score.setRecognitionTime(endTime - startTime);
                            if (recognize == null) {
                                score.setFailed(new NullPointerException("List of returned interpretations is null"));
                                recognitionScoreList.add(score);
                                return null;
                            }
                            generateScore(score, recognize, testTemplate.getInterpretation());
                        } catch (Exception e) {
                            score.setFailed(e);
                        }
                        recognitionScoreList.add(score);
                        if (thisCount % percent == 0) {
                            LOG.debug("gone through {} sketches, {} left", thisCount, testTemplates.size() - thisCount);
                        }
                        return null;
                    }
                }));
                counter++;
            }

            LOG.debug("Waiting for all tasks to finish");
            // Waits for the executor to finish
            for (Future taskFuture : taskFutures) {
                try {
                    taskFuture.get();
                } catch (InterruptedException e) {
                    LOG.debug("INTERUPTIONS EXCEPTION", e);
                } catch (ExecutionException e) {
                    LOG.debug("EXECUTION EXCEPTION", e);
                }
            }
            LOG.debug("All recognition testing tasks have finished");
        }
        return scoreMap;
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
                taskFutures.add(executor.submit(new Callable() {
                    @Override
                    public Object call() throws Exception {
                        TrainingScore score = new TrainingScore();
                        long startTime = System.nanoTime();
                        try {
                            recognitionSystem.trainTemplate(template);
                        } catch (Exception e) {
                            score.addException(new RecognitionTestException("Error with training template " + template.getTemplateId(),
                                    e, recognitionSystem));
                        }
                        long endTime = System.nanoTime();
                        score.setTrainingTime(endTime - startTime);
                        trainingScores.add(score);

                        if (thisCount % percent == 0) {
                            LOG.debug("gone through {} sketches, {} left", thisCount, templates.size() - thisCount);
                        }
                        return null;
                    }
                }));
                counter++;
            }

            LOG.debug("Waiting for all tasks to finish");
            // Waits for the executor to finish
            for (Future taskFuture : taskFutures) {
                try {
                    taskFuture.get();
                } catch (InterruptedException e) {
                    LOG.debug("INTERUPTIONS EXCEPTION", e);
                } catch (ExecutionException e) {
                    LOG.debug("EXECUTION EXCEPTION", e);
                }
            }
            try {
                recognitionSystem.finishTraining();
            } catch (RecognitionException e) {
                LOG.debug("EXCEPTION WHEN TRAINING", e);
            }
            LOG.debug("All trainings tasks have finished");
        }
        return scoreMap;
    }

    private void generateScore(RecognitionScore score,
                               List<Sketch.SrlInterpretation> recognize, Sketch.SrlInterpretation interpretation) {
        double scoreValue = 1;
        int topGuesses = Math.min(5, recognize.size());
        int subtractAmount = 1/topGuesses;
        score.setRecognizedInterpretations(recognize);
        score.setCorrectInterpretations(interpretation);
        for (int i = 0; i < topGuesses; i++) {
            if (recognize.get(i).getLabel().equals(interpretation.getLabel())) {
                score.setRecognized(true);
                score.setScoreValue(scoreValue * recognize.get(i).getConfidence());
                return ;
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
}
