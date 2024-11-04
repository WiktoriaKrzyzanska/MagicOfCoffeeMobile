import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import WelcomeScreen from '../screens/WelcomeScreen';
import RejestracjaScreen from '../screens/RejestracjaScreen';

const Stack = createStackNavigator();

const AppNavigator = () => {
  return (
   
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen name="RejestracjaScreen" component={RejestracjaScreen} />
      </Stack.Navigator>
   
  );
};

export default AppNavigator;