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

/**
 * A class used to test Recognition systems.
 */
public class RecognitionTesting {

    private TemplateDatabaseInterface databaseInterface;
    private RecognitionInterface[] recognitionSystems;

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
    private List<RecognitionScoreMetrics> testAgainstTemplates(List<Sketch.RecognitionTemplate> allTemplates)
            throws TemplateException {

        List<Sketch.RecognitionTemplate> testTemplates = splitTrainingAndTest(allTemplates);

        Map<RecognitionInterface, List<Exception>> exceptions = trainAgainstTemplates(allTemplates);

        Map<RecognitionInterface, List<RecognitionScore>> recognitionScore =
                recognizeAgainstTemplates(testTemplates);

        List<RecognitionScoreMetrics> metrics = new ArrayList<>();
        for (RecognitionInterface recognitionSystem : recognitionSystems) {
            metrics.add(new RecognitionScoreMetrics(exceptions.get(recognitionSystem),
                    recognitionScore.get(recognitionSystem)));
        }
        return metrics;
    }

    private Map<RecognitionInterface, List<RecognitionScore>> recognizeAgainstTemplates(
            List<Sketch.RecognitionTemplate> testTemplates) {
        Map<RecognitionInterface, List<RecognitionScore>> scoreMap = new HashMap<>();

        for (RecognitionInterface recognitionSystem : recognitionSystems) {
            List<RecognitionScore> recognitionScoreList = new ArrayList<>();
            scoreMap.put(recognitionSystem, recognitionScoreList);
            for (Sketch.RecognitionTemplate testTemplate : testTemplates) {
                RecognitionScore score = new RecognitionScore(recognitionSystem);
                try {
                    List<Sketch.SrlInterpretation>
                            recognize = recognitionSystem.recognize(testTemplate.getTemplateId(), testTemplate);
                    generateScore(score, recognize, testTemplate.getInterpretation());
                } catch (RecognitionException e) {
                    score.setFailed(e);
                }
                recognitionScoreList.add(score);
            }
        }
        return scoreMap;
    }

    public Map<RecognitionInterface, List<Exception>> trainAgainstTemplates(List<Sketch.RecognitionTemplate> templates) {
        Map<RecognitionInterface, List<Exception>> exceptionMap = new HashMap<>();
        for (RecognitionInterface recognitionSystem : recognitionSystems) {
            List<Exception> trainingExceptions = new ArrayList<>();
            exceptionMap.put(recognitionSystem, trainingExceptions);
            for (Sketch.RecognitionTemplate template : templates) {
                try {
                    recognitionSystem.trainTemplate(template);
                } catch (TemplateException e) {
                    trainingExceptions.add(
                            new RecognitionTestException("Error with training template " + template.getTemplateId(),
                                    e, recognitionSystem));
                }
            }
        }
        return exceptionMap;
    }

    private void generateScore(RecognitionScore score,
                               List<Sketch.SrlInterpretation> recognize, Sketch.SrlInterpretation interpretation) {
        double scoreValue = 1;
        int topGuesses = Math.min(5, recognize.size());
        int subtractAmount = 1/topGuesses;
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
     * splits training and test templates.
     *
     * Does modify the training tempalte list
     * @param allTemplates
     * @return
     */
    private List<Sketch.RecognitionTemplate> splitTrainingAndTest(List<Sketch.RecognitionTemplate> allTemplates) {
        Random r = new Random();
        List<Sketch.RecognitionTemplate> testTemplates = new ArrayList<>();
        int amountToTakeOut = (int) (((double) allTemplates.size()) * .10);
        for (int i = 0; i < amountToTakeOut; i++) {
            testTemplates.add(allTemplates.remove(r.nextInt(allTemplates.size())));
        }
        return testTemplates;
    }
}
