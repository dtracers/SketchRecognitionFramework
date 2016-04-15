package coursesketch.recognition.framework;

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
     */
    public void addUpdate(String sketchId, Commands.SrlUpdate update);

    /**
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param updateList The update list being set.
     */
    public void setUpdateList(String sketchId, Commands.SrlUpdateList updateList);

    /**
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param sketch The sketch being set.
     */
    public void setSketch(String sketchId, SrlSketch sketch);

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param template The template that is being saved.
     */
    public void addTemplate(SrlSketch template);

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param template The template that is being saved.
     */
    public void addTemplate(Sketch.SrlShape template);

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param template The template that is being saved.
     */
    public void addTemplate(Sketch.SrlStroke template);

    /**
     * Recognizes the sketch as a list of changes producing a list of changes as a result.
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param updateList The list that is being recognized.
     * @return A list representing the changes that occurred.
     */
    public Commands.SrlUpdateList recognize(String sketchId, Commands.SrlUpdateList updateList);

    /**
     * Recognizes the sketch as a single entity producing a recognized sketch as a result.
     *
     * @param sketchId The Id that uniquely identifies a single sketch.
     * @param sketch The sketch that is being recognized.
     * @return A sketch representing the recognized result.
     */
    public SrlSketch recognize(String sketchId, SrlSketch sketch);
}
