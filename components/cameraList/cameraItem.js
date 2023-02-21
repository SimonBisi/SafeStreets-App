import { Pressable, Text, StyleSheet } from "react-native";

export default function CameraItem({ camera, handleOnPress }) {
  return (
    <Pressable
      onPress={() => handleOnPress(camera.macAddress)}
      style={styles.container}
    >
      <Text style={styles.name}>{`${camera.name} ${camera.macAddress}`}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    padding: 8,
    alignContent: "center",
    backgroundColor: "white",
    marginVertical: 5,
    marginHorizontal: 5
  },
  name: {
    fontSize: 15,
    height: 50,
    textAlignVertical: "center",
  },
});
