package coursesketch.recognition.framework.sketch.protobuf;

import com.google.protobuf.GeneratedMessage;

/**
 * Created by david on 7/8/16.
 */
public interface ProtoInterface {
    static ProtoInterface createFromProtobuf(GeneratedMessage message) {
        return null;
    }

    GeneratedMessage toProtobuf();
}
