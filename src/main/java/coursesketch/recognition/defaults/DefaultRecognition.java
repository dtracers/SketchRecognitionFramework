package coursesketch.recognition.defaults;

import coursesketch.recognition.framework.RecognitionInterface;
import coursesketch.recognition.framework.TemplateDatabaseInterface;
import coursesketch.recognition.framework.exceptions.TemplateException;

import protobuf.srl.sketch.Sketch;
import protobuf.srl.sketch.Sketch.SrlSketch;

import java.util.List;

/**
 * Created by gigemjt on 4/16/16.
 */
public abstract class DefaultRecognition implements RecognitionInterface {
    private final TemplateDatabaseInterface templateDatabase;

    public DefaultRecognition(TemplateDatabaseInterface templateDatabase) {
        this.templateDatabase = templateDatabase;
    }

    public void addTemplate(final Sketch.SrlInterpretation interpretation, final SrlSketch template) throws TemplateException {
        templateDatabase.addTemplate(interpretation, template);
    }

    public void addTemplate(final Sketch.SrlInterpretation interpretation, final Sketch.SrlShape template) throws TemplateException {
        templateDatabase.addTemplate(interpretation, template);
    }

    public void addTemplate(final Sketch.SrlInterpretation interpretation, final Sketch.SrlStroke template) throws TemplateException {
        templateDatabase.addTemplate(interpretation, template);
    }

    protected List<Sketch.SrlObject> getTemplates(final Sketch.SrlInterpretation interpretation) {
        return templateDatabase.getTemplate(interpretation);
    }
}