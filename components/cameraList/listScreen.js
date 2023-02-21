import { useEffect, useState } from "react";
import {
  StyleSheet,
  Button,
  FlatList,
  View,
  Text,
  ScrollView,
} from "react-native";
import SafestreetsApi from "../../apis/safestreetsApi";
import CameraItem from "./cameraItem";
import { useNavigation } from "@react-navigation/native";

export default function ListScreen() {
  const navigation = useNavigation();
  const [cameras, setCameras] = useState([]);
  const [loadingStatus, setLoadingStatus] = useState({ status: "done" });

  async function getCameras() {
    let cameraResult;
    setLoadingStatus({ status: "get", message: "...camera's ophalen" });
    try {
      cameraResult = await SafestreetsApi.getCameras();
    } catch (error) {
      console.log(JSON.stringify(error));
      setLoadingStatus({ status: "failed", message: error.message });
      return;
    }
    setCameras(cameraResult.data);
    setLoadingStatus({ status: "done" });
  }

  function handleCameraPress(macAddress) {
    navigation.navigate("LocationComponent", { cameraMac: macAddress });
  }

  useEffect(() => {
    getCameras();
  }, []);

  return (
    <View style={styles.container}>
      {loadingStatus.status === "get" ||
        (loadingStatus.status === "failed" && (
          <View
            style={{
              flex: 1,
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            {loadingStatus.status === "get" && (
              <Text style={styles.errorMessage}>{loadingStatus.message}</Text>
            )}
            {loadingStatus.status === "failed" && (
              <>
                <Text style={styles.errorMessage}>{loadingStatus.message}</Text>
                <View style={{ paddingTop: 20 }}>
                  <Button title="Retry" onPress={getCameras} />
                </View>
              </>
            )}
          </View>
        ))}
      {loadingStatus.status === "done" && (
        <FlatList
          data={cameras}
          keyExtractor={(item) => item.cameraId}
          renderItem={({ item }) => (
            <CameraItem camera={item} handleOnPress={handleCameraPress} />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
    marginHorizontal: 5,
  },
  errorMessage: {
    fontSize: 30,
  },
});
