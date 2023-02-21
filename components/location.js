import {
  Alert,
  Modal,
  StyleSheet,
  Text,
  Pressable,
  View,
  ActivityIndicator,
  BackHandler,
  SafeAreaView,
  TextInput,
  ScrollView,
  Button,
  Switch,
} from "react-native";
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";
import SafestreetsApi from "../apis/safestreetsApi";
import SwitchSelector from "react-native-switch-selector";

const emptyLocation = {
  locationId: 0,
  street: "",
  streetNumber: "",
  city: "",
  zipcode: "",
  speedLimit: "",
};

const initialUpdateCamera = true;

function LocationComponent({ route }) {
  const { cameraMac } = route.params;
  const [camera, setCamera] = useState(null);
  const [originalCamera, setOriginalCamera] = useState(null);
  const [updateCamera, setUpdateCamera] = useState(initialUpdateCamera);
  const [modalVisible, setModalVisible] = useState(false);
  const [modalMsg, setModalMsg] = useState("");
  const [loadingStatusCamera, setLoadingStatusCamera] = useState("done");
  const [loadingStatusGPS, setLoadingStatusGPS] = useState("done");
  const [loadingStatusLocation, setLoadingStatusLocation] = useState("done");

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setModalMsg({
          success: false,
          message: "Permission to access location was denied",
        });
        setModalVisible(true);
        return;
      }
    })();

    getCamera();
  }, []);

  async function getCamera() {
    let cameraResult;
    setLoadingStatusCamera("get");
    try {
      cameraResult = await SafestreetsApi.getCamera(cameraMac);
    } catch (error) {
      setLoadingStatusCamera("failed");
      setModalMsg({
        success: false,
        message: error.message,
      });
      setModalVisible(true);
      return;
    }
    const cameraObject = { ...cameraResult.data };
    if (cameraObject.location === null) {
      cameraObject.location = { ...emptyLocation };
      setUpdateCamera(false);
    }
    setLoadingStatusCamera("done");
    setCamera(cameraObject);
    setOriginalCamera(cameraObject);
    setUpdateCamera(true);
  }

  async function getLocation() {
    setLoadingStatusGPS("location");
    let locationResult;
    try {
      locationResult = await Location.getCurrentPositionAsync({});
    } catch (error) {
      setLoadingStatusGPS("failed");
      setModalMsg({ success: false, message: error.message });
      setModalVisible(true);
      return;
    }

    setLoadingStatusGPS("api");

    try {
      await SafestreetsApi.setGpsLocation({
        longitude: locationResult.coords.longitude,
        latitude: locationResult.coords.latitude,
        macAddress: cameraMac,
      });
    } catch (error) {
      setLoadingStatusGPS("failed");
      setModalMsg({ success: false, message: error.message });
      setModalVisible(true);
      return;
    }
    await getCamera();
    setLoadingStatusGPS("done");
    setModalMsg({
      success: true,
      message: "successfully updated gps location",
    });
    setModalVisible(true);
  }

  function setLocationEmpty() {
    setCamera({
      ...camera,
      location: { ...camera.location, ...emptyLocation },
    });
  }

  function resetLocation() {
    setCamera(originalCamera);
  }

  async function handleSend() {
    if (updateCamera) {
      setLoadingStatusLocation("update");
      try {
        const updateResult = await SafestreetsApi.updateLocation(
          camera.location
        );
      } catch (error) {}
      setLoadingStatusLocation("failed");
      setModalMsg({
        success: true,
        message: "successfully updated location",
      });
      setModalVisible(true);
    } else {
      setLoadingStatusLocation("create");
      try {
        const updateResult = await SafestreetsApi.createLocationCamera({
          ...camera.location,
          speedLimit: parseFloat(camera.location.speedLimit),
          cameraId: camera.cameraId,
        });
      } catch (error) {
        setLoadingStatusLocation("failed");
        setModalMsg({ success: false, message: error.message });
        setModalVisible(true);
        return;
      }
      setLoadingStatusLocation("done");
      setModalMsg({
        success: true,
        message: "successfully added new location",
      });
      setModalVisible(true);
    }

    getCamera();
  }

  function handleChangeStreet(value) {
    setCamera({ ...camera, location: { ...camera.location, street: value } });
  }

  function handleChangeStreetNumber(value) {
    setCamera({
      ...camera,
      location: { ...camera.location, streetNumber: value },
    });
  }

  function handleChangeCity(value) {
    setCamera({ ...camera, location: { ...camera.location, city: value } });
  }

  function handleChangeZipcode(value) {
    setCamera({ ...camera, location: { ...camera.location, zipcode: value } });
  }

  function handleChangeSpeedLimit(value) {
    setCamera({
      ...camera,
      location: { ...camera.location, speedLimit: value },
    });
  }

  return (
    <>
      {loadingStatusCamera === "get" && (
        <View style={styles.loadingContainer}>
          <Text>...loading camera</Text>
        </View>
      )}
      {loadingStatusCamera === "failed" && (
        <View style={styles.loadingContainer}>
          <Text>...failed to load camera</Text>
          <Button title="Retry" onPress={getCamera} />
        </View>
      )}
      {camera !== null && (
        <ScrollView contentContainerStyle={styles.container}>
          <View style={styles.cameraContainer}>
            <Text style={styles.title}>Camera: </Text>
            <Text style={styles.item}>{`Naam:`}</Text>
            <TextInput style={styles.input} value={camera.name} />
            <Text style={styles.item}>{`Mac-adres:`}</Text>
            <TextInput style={styles.input} value={camera.macAddress} />
            <Text style={styles.title}>Locatie: </Text>
            <Text style={styles.item}>{"GPS-locatie:"}</Text>
            {(() => {
              switch (loadingStatusGPS) {
                case "location":
                  return (
                    <>
                      <Text>Getting gps coordinates</Text>
                      <ActivityIndicator size="large" />
                    </>
                  );
                case "api":
                  return (
                    <>
                      <Text>Updating coordinates </Text>
                      <ActivityIndicator size="large" />
                    </>
                  );
              }
            })()}
            {loadingStatusGPS === "done" &&
              camera.location.latitude !== undefined && (
                <Text
                  style={{ fontSize: 30 }}
                >{`${camera.location.latitude}, ${camera.location.longitude}`}</Text>
              )}
            {loadingStatusGPS === "done" &&
              camera.location.latitude === undefined && (
                <Text style={{ fontSize: 30 }}>Leeg</Text>
              )}
            <Pressable
              style={[styles.button, styles.buttonOpen]}
              onPress={getLocation}
            >
              <Text style={styles.textStyle}>Locatie veranderen</Text>
            </Pressable>
            <Text style={styles.item}>{`Straat:`}</Text>
            <TextInput
              style={styles.input}
              value={camera.location.street}
              onChangeText={handleChangeStreet}
            />
            <Text style={styles.item}>{`Huisnummer:`}</Text>
            <TextInput
              style={styles.input}
              value={camera.location.streetNumber}
              onChangeText={handleChangeStreetNumber}
            />
            <Text style={styles.item}>{`Gemeente:`}</Text>
            <TextInput
              style={styles.input}
              value={camera.location.city}
              onChangeText={handleChangeCity}
            />
            <Text style={styles.item}>{`Postcode:`}</Text>
            <TextInput
              style={styles.input}
              value={camera.location.zipcode}
              onChangeText={handleChangeZipcode}
            />
            <Text style={styles.item}>{`Snelheidslimiet:`}</Text>
            <TextInput
              style={styles.input}
              keyboardType="number-pad"
              value={
                camera.location.speedLimit !== null &&
                camera.location.speedLimit.toString()
              }
              onChangeText={handleChangeSpeedLimit}
            />
            {/* <Switch
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={updateCamera ? "#f5dd4b" : "#f4f3f4"}
              ios_backgroundColor="#3e3e3e"
              ac
              onValueChange={() => setUpdateCamera(!updateCamera)}
              value={updateCamera}
            /> */}

            {originalCamera !== null &&
              originalCamera.location.locationId !== 0 && (
                <View style={[styles.marginButton]}>
                  <SwitchSelector
                  buttonColor="#93416d"
                  borderColor="#93416d"
                    options={[
                      { label: "Update", value: true },
                      { label: "Nieuw", value: false },
                    ]}
                    initial={0}
                    onPress={(value) => {
                      if (value) {
                        resetLocation();
                      } else {
                        setLocationEmpty();
                      }

                      setUpdateCamera(value);
                    }}
                  />
                </View>
              )}
            {(() => {
              switch (loadingStatusLocation) {
                case "update":
                  return (
                    <>
                      <Text>locatie updaten</Text>
                      <ActivityIndicator size="large" />
                    </>
                  );
                case "create":
                  return (
                    <>
                      <Text>locatie maken</Text>
                      <ActivityIndicator size="large" />
                    </>
                  );
              }
            })()}
            {(loadingStatusLocation === "done" ||
              loadingStatusLocation === "failed") && (
              <Pressable
                style={[styles.button, styles.buttonOpen]}
                onPress={handleSend}
              >
                <Text style={styles.textStyle}>
                  {updateCamera ? "Update" : "Toevoegen"}
                </Text>
              </Pressable>
            )}
          </View>

          <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible}
            onRequestClose={() => {
              Alert.alert("Modal has been closed.");
              setModalVisible(!modalVisible);
            }}
          >
            <View style={styles.centeredView}>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>{modalMsg.message}</Text>
                <Pressable
                  style={[styles.button, styles.buttonClose]}
                  onPress={() => setModalVisible(!modalVisible)}
                >
                  <Text style={styles.textStyle}>Close</Text>
                </Pressable>
              </View>
            </View>
          </Modal>
        </ScrollView>
      )}
    </>
  );
}

export default LocationComponent;

const styles = StyleSheet.create({
  loadingContainer: {
    width: "100%",
    height: "100%",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  cameraContainer: {
    display: "flex",
    width: "100%",
  },
  container: {
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "stretch",
    flexGrow: 1,
    width: "100%",
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  marginButton: {
    marginVertical: 10,
  },
  buttonOpen: {
    backgroundColor: "#2f7092",
  },
  buttonClose: {
    backgroundColor: "#2f7092",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
  title: {
    fontSize: 30,
  },
  section: {
    fontSize: 20,
  },
  item: {
    fontSize: 15,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
  },
});
