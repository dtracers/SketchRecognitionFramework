package coursesketch.recognition.framework.sketch.protobuf.object;

import coursesketch.recognition.framework.sketch.protobuf.ProtoInterface;
import coursesketch.recognition.framework.sketch.protobuf.virtual.ProtoPoint;
import edu.tamu.srl.sketch.core.object.SrlStroke;
import edu.tamu.srl.sketch.core.tobenamedlater.SrlAuthor;
import edu.tamu.srl.sketch.core.tobenamedlater.SrlDevice;
import edu.tamu.srl.sketch.core.tobenamedlater.SrlPen;
import edu.tamu.srl.sketch.core.virtual.SrlPoint;
import protobuf.srl.sketch.Sketch;

import java.util.List;
import java.util.Map;
import java.util.UUID;

/**
 * Created by david on 7/8/16.
 */
public class ProtoStroke extends SrlStroke implements ProtoInterface {
    public ProtoStroke() {
    }

    public ProtoStroke(long time, UUID uuid, boolean isUserCreated) {
        super(time, uuid, isUserCreated);
    }

    public ProtoStroke(SrlStroke original) {
        super(original);
    }

    public ProtoStroke(SrlStroke original, boolean deep) {
        super(original, deep);
    }

    public ProtoStroke(boolean isUserCreated, SrlAuthor author, SrlPen pen, SrlDevice device) {
        super(isUserCreated, author, pen, device);
    }

    public ProtoStroke(long time, UUID uuid, boolean isUserCreated, SrlAuthor author, SrlPen pen, SrlDevice device) {
        super(time, uuid, isUserCreated, author, pen, device);
    }

    public ProtoStroke(List<SrlPoint> resampled) {
        super(resampled);
    }

    public static SrlStroke createFromProtobuf(Sketch.SrlStroke protoStroke) {
        ProtoStroke stroke = new ProtoStroke(protoStroke.getTime(), UUID.fromString(protoStroke.getId()),
                protoStroke.getIsUserCreated(),
                new SrlAuthor(UUID.randomUUID(),protoStroke.getAuthor()),
                null,
                null);
        for (Sketch.SrlPoint srlPoint : protoStroke.getPointsList()) {
            stroke.addPoint(ProtoPoint.createFromProtobuf(srlPoint));
        }
        for (Sketch.SketchAttribute sketchAttribute : protoStroke.getAttributesList()) {
            stroke.setAttribute(sketchAttribute.getKey(), sketchAttribute.getValue());
        }
        return stroke;
    }

    @Override
    public Sketch.SrlStroke toProtobuf() {
        Sketch.SrlStroke.Builder protoStroke = Sketch.SrlStroke.newBuilder();
        protoStroke.setTime(this.getTime());
        protoStroke.setId(this.getId().toString());
        if (this.getName() != null) {
            protoStroke.setName(this.getName());
        }
        for (SrlPoint srlPoint : this.getPoints()) {
            if (srlPoint instanceof ProtoPoint) {
                protoStroke.addPoints(((ProtoPoint) srlPoint).toProtobuf());
            } else {
                protoStroke.addPoints(new ProtoPoint(srlPoint).toProtobuf());
            }
        }
        Map<String, Object> attributes = this.getAttributes();
        for (String key: attributes.keySet()) {
            protoStroke.addAttributes(Sketch.SketchAttribute.newBuilder()
                    .setKey(key)
                    .setValue(attributes.get(key).toString()));
        }
        return protoStroke.build();
    }
}
