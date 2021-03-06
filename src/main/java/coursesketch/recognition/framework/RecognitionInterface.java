package coursesketch.recognition.framework;

import coursesketch.recognition.framework.exceptions.RecognitionException;
import coursesketch.recognition.framework.exceptions.TemplateException;
import protobuf.srl.commands.Commands;
import protobuf.srl.sketch.Interpretation;
import protobuf.srl.sketch.Sketch;
import protobuf.srl.sketch.Sketch.SrlSketch;

import java.util.List;

/**
 * Created by David Windows on 4/13/2016.
 */
public interface RecognitionInterface {
    /**
     * Adds a single
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param update a single update that is being added.
     * @return A list representing the changes that occurred.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    Commands.SrlUpdateList addUpdate(String sketchId, Commands.SrlUpdate update) throws RecognitionException;

    /**
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param updateList The update list being set.
     * @return A list representing the changes that occurred.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    Commands.SrlUpdateList setUpdateList(String sketchId, Commands.SrlUpdateList updateList) throws RecognitionException;

    /**
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param sketch The sketch being set.
     * @return A sketch representing the recognized result.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    SrlSketch setSketch(String sketchId, SrlSketch sketch) throws RecognitionException;

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param interpretation The interpretation of the template.
     * @param template The template that is being saved.
     * @throws TemplateException Thrown if there is a recognition Problem.
     */
    void addTemplate(String templateId, Interpretation.SrlInterpretation interpretation, SrlSketch template) throws TemplateException;

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param interpretation The interpretation of the template.
     * @param template The template that is being saved.
     * @throws TemplateException Thrown if there is a recognition Problem.
     */
    void addTemplate(String templateId, Interpretation.SrlInterpretation interpretation, Sketch.SrlShape template) throws TemplateException;

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param interpretation The interpretation of the template.
     * @param template The template that is being saved.
     * @throws TemplateException Thrown if there is a recognition Problem.
     */
    void addTemplate(String templateId, Interpretation.SrlInterpretation interpretation, Sketch.SrlStroke template) throws TemplateException;

    /**
     * Adds a template that is used to immediately train a system.
     *
     * @param template The template that is being saved.
     * @throws TemplateException Thrown if there is a recognition Problem.
     */
    void trainTemplate(Sketch.RecognitionTemplate template) throws TemplateException;

    /**
     * Called when Training is finished to show perform any cleanup that is needed.
     *
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    void finishTraining() throws RecognitionException;

    /**
     * Recognizes the sketch as a list of changes producing a list of changes as a result.
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param updateList The list that is being recognized.
     * @return A list representing the changes that occurred.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    Commands.SrlUpdateList recognize(String sketchId, Commands.SrlUpdateList updateList) throws RecognitionException;

    /**
     * Recognizes the sketch as a single entity producing a recognized sketch as a result.
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param sketch The sketch that is being recognized.
     * @return A sketch representing the recognized result.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    SrlSketch recognize(String sketchId, SrlSketch sketch) throws RecognitionException;

    /**
     * Recognizes a template that is used to evaluate the sketch.
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param template The template that is being recognized.
     * @return A list of interpretations representing the results.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    List<Interpretation.SrlInterpretation> recognize(String sketchId, Sketch.RecognitionTemplate template)
            throws RecognitionException;

    /**
     * Generates other possible templates using this method.
     *
     * @param original The template that is modified to produce new similar templates.
     * @return A list of modified versions of the original sketch that is used to guess templates.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    List<Sketch.RecognitionTemplate> generateTemplates(Sketch.RecognitionTemplate original) throws RecognitionException;

    /**
     * Called for an initialization or training to setup for recognition.
     *
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    void initialize() throws RecognitionException;
}
