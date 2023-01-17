import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import LocationComponent from "./components/location";

export default function App() {

  return (
    <View>
      <LocationComponent/>
    </View>
  );
}