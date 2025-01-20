/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect } from "react";
import { StyleSheet, View, Text } from "react-native";
import { useTensorflowModel } from "react-native-fast-tflite";
import {
  Camera,
  runAtTargetFps,
  useCameraDevice,
  useCameraPermission,
  useSkiaFrameProcessor,
} from "react-native-vision-camera";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { Skia, PaintStyle, useFont } from "@shopify/react-native-skia";
import { useSharedValue } from "react-native-worklets-core";

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const objectDetection = useTensorflowModel(
    require("./assets/model/detect.tflite")
  );

  const Model =
    objectDetection.state === "loaded" ? objectDetection.model : undefined;

  const { resize } = useResizePlugin();

  const box = useSharedValue({
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  });

  const font = useFont(require("./assets/font/Helvetica.ttf"), 20);

  const frameProcessor = useSkiaFrameProcessor(
    (frame) => {
      "worklet";
      frame.render();
      if (Model == null) {
        return;
      }

      const w = frame.width;
      const h = frame.height;

      runAtTargetFps(30, () => {
        const resized = resize(frame, {
          scale: { width: 300, height: 300 },
          pixelFormat: "rgb",
          dataType: "float32",
        });

        // 3. Run inference
        const results = Model.runSync([resized]);
        console.log(results);

        // 3. Interpret results accordingly
        const detection_boxes = results[1];
        const detection_classes = results[3];
        const detection_scores = results[0];
        const num_detections = results[2];

        // console.log(detection_boxes)

        for (let i = 0; i < detection_boxes.length; i += 4) {
          const confidence = detection_scores[0];
          if (confidence > 0.5) {
            const top = detection_boxes[0];
            const left = detection_boxes[1];
            const bottom = detection_boxes[2];
            const right = detection_boxes[3];

            box.value = { top, left, bottom, right };

            const labels = ["Monkeypox", "Chickenpox", "Acne", "Measles"];
            const label = labels[detection_classes[0]] || "Unknown";

            if (box.value) {
              const rect = Skia.XYWHRect(
                box.value.left * w,
                box.value.top * h,
                (box.value.right - box.value.left) * w,
                (box.value.bottom - box.value.top) * h
              );

              const rectPaint = Skia.Paint();
              rectPaint.setStyle(PaintStyle.Stroke);
              rectPaint.setStrokeWidth(5);
              rectPaint.setColor(Skia.Color("red"));
              frame.drawRect(rect, rectPaint);

              if (font) {
                const fontPaint = Skia.Paint();
                fontPaint.setColor(Skia.Color("red"));

                const text = Skia.TextBlob.MakeFromText(label, font);
                frame.drawTextBlob(
                  text,
                  box.value.left * w,
                  box.value.top * h - 10,
                  fontPaint
                );
              }
            }
          }
        }
      });
    },
    [Model]
  );

  useEffect(() => {
    requestPermission();
  }, [requestPermission]);

  return (
    <View style={styles.container}>
      {hasPermission && device != null ? (
        <>
          <Camera
            device={device}
            style={StyleSheet.absoluteFill}
            isActive={true}
            isMirrored={false}
            frameProcessor={frameProcessor}
            enableFpsGraph={true}
            pixelFormat="yuv"
          />
        </>
      ) : (
        <Text>Tidak Ada Camera Tersedia.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
});
