import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState, useCallback } from "react";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createTheme, ThemeProvider } from "@rneui/themed";
import LocationComponent from "./components/location";
import CameraComponent from "./components/camera";
import { RecoilRoot } from "recoil";
import ListScreen from "./components/cameraList/listScreen";
import { useFonts } from "expo-font";
import NavigationHeader from "./components/navigation/header";
import { LinearGradient } from "expo-linear-gradient";
import * as SplashScreen from 'expo-splash-screen';
SplashScreen.preventAutoHideAsync();


const SetupStack = createNativeStackNavigator();
const CamerasStack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function StackTitle() {
  return (
    <Text style={{ backgroundColor: "black", width: "50%", height: "50%" }}>
      Stack Title
    </Text>
  );
}

function SetupScreen() {
  return (
    <SetupStack.Navigator
      screenOptions={{
        header: (props) => <NavigationHeader {...props} />,
        headerStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }}
    >
      <SetupStack.Screen name="ScanComponent" options={{title: "Scan"}} component={CameraComponent}/>
      <SetupStack.Screen
        name="LocationComponent"
        component={LocationComponent}
        options={{ title: "Camera overzicht" }}
      />
    </SetupStack.Navigator>
  );
}

function CamerasScreen() {
  return (
    <CamerasStack.Navigator
      screenOptions={{
        header: (props) => <NavigationHeader {...props} />,
        headerStyle: {
          backgroundColor: "transparent",
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
        },
      }}
    >
      <SetupStack.Screen
        name="ListScreen"
        component={ListScreen}
        options={{ title: "Camera's" }}
      />
      <SetupStack.Screen
        name="LocationComponent"
        component={LocationComponent}
        options={{ title: "Camera overzicht" }}
      />
    </CamerasStack.Navigator>
  );
}

const theme = createTheme({
  lightColors: {
    primary: "#1273de",
  },
  darkColors: {
    primary: "#000",
  },
});

export default function App() {
  const [fontsLoaded] = useFonts({
    'Open Sans': require('./assets/fonts/OpenSans.ttf'),
  });

  const onLayoutRootView = useCallback(async () => {
    if (fontsLoaded) {
      await SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <View onLayout={onLayoutRootView} style={{flex: 1}}>
      <RecoilRoot>
        <ThemeProvider theme={theme}>
          <NavigationContainer>
            <Tab.Navigator
              screenOptions={({ route }) => ({
                tabBarIcon: ({ focused, color, size }) => {
                  let iconName;
                  switch (route.name) {
                    case "Setup":
                      iconName = focused ? "home-sharp" : "home-outline";
                      break;
                    case "Cameras":
                      iconName = focused ? "camera-sharp" : "camera-outline";
                      break;
                  }
                  return <Ionicons name={iconName} size={size} color={color} />;
                },
                tabBarActiveTintColor: "#1273de",
                tabBarInactiveTintColor: "gray",
              })}
            >
              <Tab.Screen
                name="Setup"
                component={SetupScreen}
                options={{ headerShown: false }}
              />
              <Tab.Screen
                name="Cameras"
                component={CamerasScreen}
                options={{ headerShown: false }}
              />
            </Tab.Navigator>
          </NavigationContainer>
        </ThemeProvider>
      </RecoilRoot>
    </View>
  );
}

