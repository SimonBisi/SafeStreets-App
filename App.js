import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createTheme, ThemeProvider } from '@rneui/themed';
import LocationComponent from "./components/location";
import CameraComponent from "./components/camera";
import { RecoilRoot } from "recoil";

const SetupStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function SetupScreen() {
  return (
  <SetupStack.Navigator>
  <SetupStack.Screen name="ScanComponent" component={CameraComponent} 
        options={{ title: 'Scan' }}/>
  <SetupStack.Screen name="LocationComponent" component={LocationComponent} 
           options={{ title: 'Location' }}/>
  </SetupStack.Navigator>
  );
 }  

const theme = createTheme({
  lightColors: {
    primary: '#1273de',
  },
  darkColors: {
    primary: '#000',
  },
});

export default function App() {

  return (
    <RecoilRoot>
      <ThemeProvider theme={theme}>
        <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  switch (route.name) {
                    case "Setup":
                      iconName = focused ? 'home-sharp' : 'home-outline';
                      break;
                  }
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: '#1273de',
                tabBarInactiveTintColor: 'gray',
              })}
            >
              <Tab.Screen name="Setup" component={SetupScreen}
                options={{headerShown: false}}
              />
            </Tab.Navigator>
        </NavigationContainer>
      </ThemeProvider>
    </RecoilRoot>
  );
}