import { Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";

function LocationComponent() {
  const [location, setLocation] = useState("");

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
      <Text style={{ fontSize: 30 }}>{location}</Text>
      <Button onPress={getLocation} title="Get" />
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
});
