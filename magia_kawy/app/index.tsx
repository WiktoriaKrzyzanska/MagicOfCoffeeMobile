import React from "react";
import "react-native-gesture-handler";
import AppNavigator from "@/navigation/AppNavigator";
import { useFonts, Righteous_400Regular } from "@expo-google-fonts/righteous";
import { View } from "react-native";
import LottieView from "lottie-react-native";
import { DarkModeProvider } from "@/contexts/DarkModeProvider";

export default function Index() {
  let [fontsLoaded] = useFonts({
    Righteous_400Regular,
  });

  if (!fontsLoaded) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <LottieView
          source={require("../assets/animations/coffee_pour.json")}
          autoPlay
          loop
          style={{ width: 200, height: 200 }}
        />
      </View>
    );
  }
  return (
    <DarkModeProvider>
      <AppNavigator />
    </DarkModeProvider>
  );
}
