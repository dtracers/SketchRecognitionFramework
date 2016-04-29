package coursesketch.recognition.framework;

import coursesketch.recognition.framework.exceptions.TemplateException;
import protobuf.srl.commands.Commands;
import protobuf.srl.sketch.Sketch;
import java.util.List;

/**
 * Created by David Windows on 4/13/2016.
 */
public interface TemplateDatabaseInterface {

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param templateId The id that uniquely identifies this template.
     * @param interpretation The interpretation of the template.
     * @param template The template that is being saved.
     */
    public void addTemplate(String templateId, Sketch.SrlInterpretation interpretation, Sketch.SrlSketch template);

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param templateId The id that uniquely identifies this template.
     * @param interpretation The interpretation of the template.
     * @param template The template that is being saved.
     */
    public void addTemplate(String templateId, Sketch.SrlInterpretation interpretation, Sketch.SrlShape template);

    /**
     * Adds a template to be saved for use in recognition later.
     *
     * @param templateId The id that uniquely identifies this template.
     * @param interpretation The interpretation of the template.
     * @param template The template that is being saved.
     */
    public void addTemplate(String templateId, Sketch.SrlInterpretation interpretation, Sketch.SrlStroke template);

    /**
     * Returns a Template based on it's interpretation
     *
     * @param interpretation The interpretation of the template.
     * @return Returns a list of SrlObjects based on the interpretation.
     */
    public List<Sketch.RecognitionTemplate> getTemplate(Sketch.SrlInterpretation interpretation) throws TemplateException;

    /**
     * @return All templates stored.
     */
    public List<Sketch.RecognitionTemplate> getTemplate() throws TemplateException;

    /**
     * @return All interpretations stored.
     */
    public List<Sketch.SrlInterpretation> getAllInterpretations() throws TemplateException;
}
