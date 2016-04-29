package coursesketch.recognition.framework;

import coursesketch.recognition.framework.exceptions.RecognitionException;
import coursesketch.recognition.framework.exceptions.TemplateException;
import protobuf.srl.commands.Commands;
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
    public Commands.SrlUpdateList addUpdate(String sketchId, Commands.SrlUpdate update) throws RecognitionException;

    /**
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param updateList The update list being set.
     * @return A list representing the changes that occurred.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    public Commands.SrlUpdateList setUpdateList(String sketchId, Commands.SrlUpdateList updateList) throws RecognitionException;

    /**
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param sketch The sketch being set.
     * @return A sketch representing the recognized result.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    public SrlSketch setSketch(String sketchId, SrlSketch sketch) throws RecognitionException;

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param interpretation The interpretation of the template.
     * @param template The template that is being saved.
     * @throws TemplateException Thrown if there is a recognition Problem.
     */
    public void addTemplate(String templateId, Sketch.SrlInterpretation interpretation, SrlSketch template) throws TemplateException;

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param interpretation The interpretation of the template.
     * @param template The template that is being saved.
     * @throws TemplateException Thrown if there is a recognition Problem.
     */
    public void addTemplate(String templateId, Sketch.SrlInterpretation interpretation, Sketch.SrlShape template) throws TemplateException;

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param interpretation The interpretation of the template.
     * @param template The template that is being saved.
     * @throws TemplateException Thrown if there is a recognition Problem.
     */
    public void addTemplate(String templateId, Sketch.SrlInterpretation interpretation, Sketch.SrlStroke template) throws TemplateException;

    /**
     * Recognizes the sketch as a list of changes producing a list of changes as a result.
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param updateList The list that is being recognized.
     * @return A list representing the changes that occurred.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    public Commands.SrlUpdateList recognize(String sketchId, Commands.SrlUpdateList updateList) throws RecognitionException;;

    /**
     * Recognizes the sketch as a single entity producing a recognized sketch as a result.
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param sketch The sketch that is being recognized.
     * @return A sketch representing the recognized result.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    public SrlSketch recognize(String sketchId, SrlSketch sketch) throws RecognitionException;

    /**
     * Generates other possible templates using this method.
     *
     * @return A list of modified versions of the original sketch that is used to guess templates.
     */
    public List<Sketch.RecognitionTemplate> generateTemplates(Sketch.RecognitionTemplate original);
}
