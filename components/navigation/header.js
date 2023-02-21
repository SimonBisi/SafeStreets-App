import { StyleSheet, View, Text, SafeAreaView, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { StatusBar } from "react-native";
import { useEffect } from "react";

export default function NavigationHeader(props) {
  
  useEffect(() => {
    StatusBar.setBarStyle("light-content", true);
  }, []);

  return (
    <>
      <View style={styles.container}>
        <LinearGradient
          // Background Linear Gradient
          colors={["#93416d", "#2f7092"]}
          // colors={['black', 'black']}
          style={styles.background}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
        />
        <Pressable style={styles.iconContainer} onPress={props.navigation.goBack}>
          {props.back !== undefined && (
            <Ionicons name="arrow-back" size={25} color="white"/>
          )}
        </Pressable>
        <Text style={styles.text}>
          {props.options !== undefined && props.options.title}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 40,
    paddingBottom: 10,
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    overflow: "hidden",
  },
  iconContainer: {
    width: 25
  },
  background: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    // height: 100,
    height: 100,
  },
  text: {
    fontSize: 25,
    color: "white",
    // fontFamily: 'Open Sans',
    // fontWeight: 700
  },
  icon: {
    color: "white",
  },
});
