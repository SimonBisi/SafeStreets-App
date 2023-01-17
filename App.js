import { StatusBar } from "expo-status-bar";
import { Button, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import * as Location from "expo-location";
import { Ionicons } from "@expo/vector-icons";
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createTheme, ThemeProvider } from '@rneui/themed';
import LocationComponent from "./components/location";

const Tab = createBottomTabNavigator();
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
    <ThemeProvider theme={theme}>
      <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarIcon: ({ focused, color, size }) => {
                let iconName;
                switch (route.name) {
                  case "Location":
                    iconName = focused ? 'home-sharp' : 'home-outline';
                    break;
                }
                return <Ionicons name={iconName} size={size} color={color} />;
              },
              tabBarActiveTintColor: '#1273de',
              tabBarInactiveTintColor: 'gray',
            })}
          >
            <Tab.Screen name="Location" component={LocationComponent} 
              // options={{headerShown: false}}
            />
          </Tab.Navigator>
      </NavigationContainer>
    </ThemeProvider>
  );
}