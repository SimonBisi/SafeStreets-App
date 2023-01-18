import { Camera, CameraType } from "expo-camera";
import { BarCodeScanner } from "expo-barcode-scanner";
import { useEffect, useState } from "react";
import {
  Button,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {
  useIsFocused,
  useNavigation,
  useRoute,
} from "@react-navigation/native";

const { height, width } = Dimensions.get("window");

export default function CameraComponent() {
  const route = useRoute();
  const navigation = useNavigation();
  const isFocused = useIsFocused();
  const [permission, requestPermission] = Camera.useCameraPermissions();

  if (!permission) {
    // Camera permissions are still loading
    return <View />;
  }

  if (!permission.granted) {
    // Camera permissions are not granted yet
    return (
      <View style={styles.container}>
        <Text style={{ textAlign: "center" }}>
          We need your permission to show the camera
        </Text>
        <Button onPress={requestPermission} title="grant permission" />
      </View>
    );
  }

  function onScanned({ data }) {
    navigation.navigate("LocationComponent", { cameraMac: data });
  }

  return (
    <View style={styles.container}>
      {isFocused && (
        <Camera
          style={styles.camera}
          type={CameraType.back}
          ratio="1:1"
          barCodeScannerSettings={{
            barCodeTypes: [BarCodeScanner.Constants.BarCodeType.qr],
          }}
          onBarCodeScanned={isFocused ? onScanned : undefined}
        >
          {/* <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.button} onPress={toggleCameraType}>
            <Text style={styles.text}>Flip Camera</Text>
          </TouchableOpacity>
        </View> */}
        </Camera>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: width,
    height: width,
    justifyContent: "center",
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "transparent",
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});
