/* eslint-disable @typescript-eslint/no-var-requires */
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  ActivityIndicator,
  Dimensions,
} from "react-native";
import { useTensorflowModel } from "react-native-fast-tflite";
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useFrameProcessor,
  useSkiaFrameProcessor,
} from "react-native-vision-camera";
import { useResizePlugin } from "vision-camera-resize-plugin";
import { Skia } from "@shopify/react-native-skia";

export default function App() {
  const { hasPermission, requestPermission } = useCameraPermission();
  const device = useCameraDevice("back");

  const objectDetection = useTensorflowModel(
    require("./assets/model/detect.tflite")
  );
  const Model =
    objectDetection.state === "loaded" ? objectDetection.model : undefined;

  const { resize } = useResizePlugin();

  const frameProcessor = useSkiaFrameProcessor((frame) => {
    "worklet";
    frame.render();

    const centerX = frame.width / 2;
    const centerY = frame.height / 2;
    const rect = Skia.XYWHRect(centerX, centerY, 150, 150);
    const paint = Skia.Paint();
    paint.setColor(Skia.Color("red"));
    frame.drawRect(rect, paint);
  }, []);

  // const frameProcessor = useSkiaFrameProcessor(
  //   (frame) => {
  //     "worklet"
  //     // if (Model == null) {
  //     //   return;
  //     // }

  //     // const resized = resize(frame, {
  //     //   scale: { width: 300, height: 300 },
  //     //   pixelFormat: "rgb",
  //     //   dataType: "uint8",
  //     // });

  //     // // Run the inference on the resized image
  //     // const output = Model.runSync([resized]);

  //     // const [detection_boxes, labels, detection_scores] = output;

  //     // for (let i = 0; i < detection_boxes.length; i += 4) {
  //     //   const confidence = detection_scores[i / 4];
  //     //   if (confidence > 0.5) {
  //     //     const top = detection_boxes[i];
  //     //     const left = detection_boxes[i + 1];
  //     //     const bottom = detection_boxes[i + 2];
  //     //     const right = detection_boxes[i + 3];

  //     //     const rect = Skia.XYWHRect(
  //     //       top * frame.width,
  //     //       top * frame.height,
  //     //       (right - left) * frame.width,
  //     //       (bottom - top) * frame.height
  //     //     );

  //     //     const rectPaint = Skia.Paint();
  //     //     rectPaint.setStyle(PaintStyle.Stroke);
  //     //     rectPaint.setStrokeWidth(20);
  //     //     rectPaint.setColor(Skia.Color("red"));
  //     //     frame.drawRect(rect, rectPaint);
  //     //   }
  //     // }
  //   },
  //   []
  // );

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
            isMirrored={true}
            frameProcessor={frameProcessor}
            pixelFormat="rgb"
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
