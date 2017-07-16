package coursesketch.recognition.framework.sketch.protobuf.virtual;

import coursesketch.recognition.framework.sketch.protobuf.ProtoInterface;
import edu.tamu.srl.sketch.core.virtual.SrlPoint;
import protobuf.srl.sketch.Sketch;

import java.util.UUID;

/**
 * Created by david on 7/8/16.
 */
public class ProtoPoint extends SrlPoint implements ProtoInterface {
    private Sketch.SrlPoint protoObject;

    public ProtoPoint(double x, double y) {
        super(x, y);
    }

    public ProtoPoint(double x, double y, long time) {
        super(x, y, time);
    }

    public ProtoPoint(double x, double y, long time, UUID uuid) {
        super(x, y, time, uuid);
    }

    public ProtoPoint(double x, double y, long time, UUID uuid, double tiltX, double tiltY, double pressure) {
        super(x, y, time, uuid, tiltX, tiltY, pressure);
    }

    public ProtoPoint(double x, double y, long time, UUID uuid, double tiltX, double tiltY, double pressure, boolean isHover) {
        super(x, y, time, uuid, tiltX, tiltY, pressure, isHover);
    }

    public ProtoPoint(SrlPoint original) {
        super(original);
    }

    public ProtoPoint(SrlPoint original, boolean deep) {
        super(original, deep);
    }

    public static SrlPoint createFromProtobuf(protobuf.srl.sketch.Sketch.SrlPoint protoPoint) {
        ProtoPoint point = new ProtoPoint(protoPoint.getX(), protoPoint.getY(),
                protoPoint.getTime(), UUID.fromString(protoPoint.getId()));
        point.setProtoObject(protoPoint);
        return point;
    }

    private void setProtoObject(Sketch.SrlPoint protoObject) {
        this.protoObject = protoObject;
    }

    @Override
    public Sketch.SrlPoint toProtobuf() {
        Sketch.SrlPoint.Builder protoPoint = Sketch.SrlPoint.newBuilder();
        protoPoint.setTime(this.getTime());
        protoPoint.setX(this.getX());
        protoPoint.setY(this.getY());
        protoPoint.setId(this.getId().toString());
        protoPoint.setPressure(this.getPressure());
        if (this.getName() != null) {
            protoPoint.setName(this.getName());
        }
        return protoPoint.build();
    }
}
