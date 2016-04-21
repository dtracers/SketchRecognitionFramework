package coursesketch.recognition.framework;

import coursesketch.recognition.framework.exceptions.ShapeConversionException;
import protobuf.srl.sketch.Sketch;

import java.util.Map;

/**
 * Created by David Windows on 4/20/2016.
 */
public interface ShapeConverterInterface {
    /**
     * Used to create a wrapper around shape, stroke and point.
     *
     * @return A map in a format that can be stored in the database.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Map makeDbObject(Sketch.SrlObject object) throws ShapeConversionException;

    /**
     * Used to create a shape for the database
     *
     * @return A map in a format that can be stored in the database.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Map makeDbShape(Sketch.SrlShape srlShape) throws ShapeConversionException;

    /**
     * Used to create a stroke for the database
     *
     * @return A map in a format that can be stored in the database.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Map makeDbStroke(final Sketch.SrlStroke srlStroke) throws ShapeConversionException;

    /**
     * Used to create a point for the database
     *
     * @return A map in a format that can be stored in the database.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Map makeDbPoint(final Sketch.SrlPoint srlPoint) throws ShapeConversionException;

    /**
     * Used to create an interpretation for the database
     *
     * @return A map in a format that can be stored in the database.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Map makeSrlInterpretation(final Sketch.SrlInterpretation srlInterpretation) throws ShapeConversionException;

    /**
     * Parses the interpretation from the database.
     *
     * @return A parsed interpretation.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlInterpretation parseInterpretation(final Map interpretationObject) throws ShapeConversionException;

    /**
     * Parses the wrapper around a shape, point, or stroke from the database.
     *
     * @return A parsed object.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlObject parseObject(final Map someObject) throws ShapeConversionException;

    /**
     * Parses the shape from the database.
     *
     * @return A parsed shape.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlShape parseShape(final Map shapeObject) throws ShapeConversionException;

    /**
     * Parses the stroke from the database.
     *
     * @return A parsed stroke.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlStroke parseStroke(final Map strokeObject) throws ShapeConversionException;

    /**
     * Parses the point from the database.
     *
     * @return A parsed point.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlPoint parsePoint(final Map pointObject) throws ShapeConversionException;
}
