package coursesketch.recognition.framework;

import coursesketch.recognition.framework.exceptions.ShapeConversionException;
import protobuf.srl.sketch.Sketch;

import java.util.Map;

/**
 * Created by David Windows on 4/20/2016.
 */
public interface ShapeConverterInterface<E> {
    /**
     * Used to create a wrapper around shape, stroke and point.
     *
     * @return A map in a format that can be stored in the database.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    E makeDbObject(Sketch.SrlObject object) throws ShapeConversionException;

    /**
     * Used to create a shape for the database
     *
     * @return A map in a format that can be stored in the database.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    E makeDbShape(Sketch.SrlShape srlShape) throws ShapeConversionException;

    /**
     * Used to create a stroke for the database
     *
     * @return A map in a format that can be stored in the database.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    E makeDbStroke(final Sketch.SrlStroke srlStroke) throws ShapeConversionException;

    /**
     * Used to create a point for the database
     *
     * @return A map in a format that can be stored in the database.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    E makeDbPoint(final Sketch.SrlPoint srlPoint) throws ShapeConversionException;

    /**
     * Parses the RecognitionTemplate from the database.
     *
     * @return A parsed recognition template.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.RecognitionTemplate parseRecognitionTemplate(final E recognitionTemplate) throws ShapeConversionException;

    /**
     * Used to create an interpretation for the database
     *
     * @return A map in a format that can be stored in the database.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    E makeDbInterpretation(final Sketch.SrlInterpretation srlInterpretation) throws ShapeConversionException;

    /**
     * Parses the interpretation from the database.
     *
     * @return A parsed interpretation.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlInterpretation parseInterpretation(final E interpretationObject) throws ShapeConversionException;

    /**
     * Parses the Sketch from the database.
     *
     * @return A parsed sketch.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlSketch parseSketch(final E sketchObject) throws ShapeConversionException;

    /**
     * Parses the wrapper around a shape, point, or stroke from the database.
     *
     * @return A parsed object.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlObject parseObject(final E someObject) throws ShapeConversionException;

    /**
     * Parses the shape from the database.
     *
     * @return A parsed shape.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlShape parseShape(final E shapeObject) throws ShapeConversionException;

    /**
     * Parses the stroke from the database.
     *
     * @return A parsed stroke.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlStroke parseStroke(final E strokeObject) throws ShapeConversionException;

    /**
     * Parses the point from the database.
     *
     * @return A parsed point.
     * @throws ShapeConversionException thrown during a failed conversion.
     */
    Sketch.SrlPoint parsePoint(final E pointObject) throws ShapeConversionException;
}
