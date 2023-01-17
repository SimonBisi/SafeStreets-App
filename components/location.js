import {Alert, Modal, StyleSheet, Text, Pressable, View} from 'react-native';
import React, { useEffect, useState } from "react";
import * as Location from "expo-location";


function LocationComponent() {
  const [location, setLocation] = useState("");
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    Location.requestForegroundPermissionsAsync();
  }, []);

  async function getLocation() {
    const locationResult = await Location.getCurrentPositionAsync({});
    console.log(locationResult);
    const locationString = `${locationResult.coords.latitude}, ${locationResult.coords.longitude}`;
    setLocation(locationString);
  }

  return (
    <View style={styles.container}>
      <Text style={{ fontSize: 30 }}>Raspberry Pi id: "1" {'\n'} </Text>
        <Modal animationType="slide" transparent={true} visible={modalVisible} onRequestClose={() => {
          Alert.alert('Modal has been closed.');
          setModalVisible(!modalVisible);
        }}>
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalText}>Location set!</Text>
            <Pressable style={[styles.button, styles.buttonClose]}
              onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyle}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
      <Pressable style={[styles.button, styles.buttonOpen]}
        onPress={
          async() => { await
            getLocation()
            setModalVisible(true)
          }}>
        <Text style={styles.textStyle}>Set location</Text>
      </Pressable>
      <Text style={{ fontSize: 30 }}>{location}</Text>
    </View>
  );
}

export default LocationComponent;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexGrow: 1,
  },
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
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
  buttonOpen: {
    backgroundColor: '#2196F3',
  },
  buttonClose: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
  },
});
