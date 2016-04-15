package coursesketch.recognition.framework;

import coursesketch.recognition.framework.exceptions.RecognitionException;
import coursesketch.recognition.framework.exceptions.TemplateException;
import protobuf.srl.commands.Commands;
import protobuf.srl.sketch.Sketch;
import protobuf.srl.sketch.Sketch.SrlSketch;

/**
 * Created by David Windows on 4/13/2016.
 */
public interface RecognitionInterface {
    /**
     * Adds a single
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param update a single update that is being added.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    public void addUpdate(String sketchId, Commands.SrlUpdate update) throws RecognitionException;

    /**
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param updateList The update list being set.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    public void setUpdateList(String sketchId, Commands.SrlUpdateList updateList) throws RecognitionException;

    /**
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param sketch The sketch being set.
     * @throws RecognitionException Thrown if there is a recognition Problem.
     */
    public void setSketch(String sketchId, SrlSketch sketch) throws RecognitionException;

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param template The template that is being saved.
     * @throws TemplateException Thrown if there is a recognition Problem.
     */
    public void addTemplate(SrlSketch template) throws TemplateException;

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param template The template that is being saved.
     * @throws TemplateException Thrown if there is a recognition Problem.
     */
    public void addTemplate(Sketch.SrlShape template) throws TemplateException;

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param template The template that is being saved.
     * @throws TemplateException Thrown if there is a recognition Problem.
     */
    public void addTemplate(Sketch.SrlStroke template) throws TemplateException;

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
    public SrlSketch recognize(String sketchId, SrlSketch sketch) throws RecognitionException;;
}
