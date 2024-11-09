import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import RejestracjaScreen from '../screens/RejestracjaScreen';
import HomeScreen from '../screens/HomeScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
      <Stack.Navigator initialRouteName="Home">
          <Stack.Screen name="Welcome" component={WelcomeScreen} />
          <Stack.Screen name="RejestracjaScreen" component={RejestracjaScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
      </Stack.Navigator>
  );
};

export default AppNavigator;