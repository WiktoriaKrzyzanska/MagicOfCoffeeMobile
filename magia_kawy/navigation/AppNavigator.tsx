import React from "react";
import { createStackNavigator } from "@react-navigation/stack";
import WelcomeScreen from "../screens/WelcomeScreen";
import RejestracjaScreen from "../screens/RejestracjaScreen";
import HomeScreen from "../screens/HomeScreen";
import { NavigationContainer } from "@react-navigation/native";
import CartScreen from "../screens/CartScreen";

export type RootStackParamList = {
  Welcome: undefined;
  RejestracjaScreen: undefined;
  Home: undefined;
};
const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="WelcomeScreen" component={WelcomeScreen} />
        <Stack.Screen name="RejestracjaScreen" component={RejestracjaScreen} />
        <Stack.Screen name="HomeScreen" component={HomeScreen} />
        <Stack.Screen name="CartScreen" component = {CartScreen}/>
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default AppNavigator;
