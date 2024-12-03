import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { FontAwesome } from "@expo/vector-icons";
import axios from "axios";
import * as AuthSession from "expo-auth-session";
import AsyncStorage from "@react-native-async-storage/async-storage";

const WelcomeScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const githubAuthUrl = "https://github.com/login/oauth/authorize";
  const clientId = "xxx";
  const redirectUri = AuthSession.makeRedirectUri({
    scheme: "myapp",
    path: "redirect",
    preferLocalhost: true,
    isTripleSlashed: false,
  });

  const discovery = {
    authorizationEndpoint: "https://github.com/login/oauth/authorize",
    tokenEndpoint: "https://github.com/login/oauth/access_token",
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId,
      redirectUri,
      scopes: ["user:email", "read:user", "public_repo"],
    },
    discovery
  );

  React.useEffect(() => {
    if (response?.type === "success") {
      const fetchAccessTokenAndUser = async () => {
        try {
          const { code } = response.params;
      
          const tokenResponse = await axios.post(
            "https://github.com/login/oauth/access_token",
            {
              client_id: clientId,
              client_secret: "xxxx",
              code,
              redirect_uri: redirectUri,
            },
            { headers: { Accept: "application/json" } }
          );
      
          const { access_token } = tokenResponse.data;
      
          await AsyncStorage.setItem("authToken", access_token);
      
          const userResponse = await axios.get("https://api.github.com/user", {
            headers: { Authorization: `Bearer ${access_token}` },
          });
      
          Alert.alert("Success", `Welcome, ${userResponse.data.login}`);
        } catch (error) {
          console.error("GitHub Login Error:", error);
          Alert.alert("Error", "GitHub login failed.");
        }
      };
      

      fetchAccessTokenAndUser();
    }
  }, [response]);

  const handleLogin = async () => {
    try {
      const response = await axios.post(
        "http://xxx.xxx.xxx:8082/auth/signin",
        {
          email: email,
          password: password,
        }
      );
      await AsyncStorage.setItem("authToken", response.data);

      const idResponse = await axios.get(
        "http://xxx.xxx.xxx:8082/user/id",
        {
          headers: {
            Authorization: `Bearer ${response.data}`,
          },
        }
      );

      await AsyncStorage.setItem("userId", idResponse.data.toString()); 
      console.log("Login success:", response.data);
      Alert.alert("Success", "Login successful!");

      navigation.navigate("HomeScreen");
    } catch (error) {
      console.error("Login failed:", error);
      Alert.alert("Error", "Login failed. Please check your credentials.");
    }
  };

  return (
    <View style={styles.container}>
      <Image
        source={require("../assets/images/welcome-image.png")}
        style={styles.image}
      />
      <View style={styles.formContainer}>
        <Text style={styles.label}>Email address</Text>
        <TextInput
          style={styles.input}
          placeholder="janek@example.com"
          keyboardType="email-address"
          value={email}
          onChangeText={setEmail}
        />

        <Text style={styles.label}>Password</Text>
        <View style={styles.passwordContainer}>
          <TextInput
            style={[styles.input, styles.passwordInput]}
            placeholder="●●●●●●●●"
            secureTextEntry={!passwordVisible}
            value={password}
            onChangeText={setPassword}
          />
          <TouchableOpacity
            style={styles.eyeIcon}
            onPress={() => setPasswordVisible(!passwordVisible)}
          >
            <FontAwesome
              name={passwordVisible ? "eye-slash" : "eye"}
              size={24}
              color="#666"
            />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.loginButton} onPress={handleLogin}>
          <Text style={styles.loginButtonText}>Log In</Text>
        </TouchableOpacity>

        <Text style={styles.footerText}>
          Don't have an account?{" "}
          <Text
            style={styles.signupText}
            onPress={() => navigation.navigate("RejestracjaScreen")}
          >
            Sign up
          </Text>
        </Text>
        <TouchableOpacity
          style={styles.githubButton}
          onPress={() => promptAsync()}
        >
          <FontAwesome name="github" size={24} color="#fff" />
          <Text style={styles.githubButtonText}>Login with GitHub</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    padding: 16,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 16,
  },
  backButtonText: {
    fontSize: 24,
    color: "#000",
  },
  image: {
    width: 500,
    height: 250,
    marginBottom: 60,
    resizeMode: "contain",
  },
  formContainer: {
    width: "100%",
    backgroundColor: "#c9ad92",
    padding: 24,
    borderRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: "#333",
  },
  input: {
    backgroundColor: "#fff",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    marginBottom: 16,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
  },
  passwordInput: {
    flex: 1,
    paddingRight: 40,
  },
  eyeIcon: {
    position: "absolute",
    right: 10,
    top: 8,
  },

  loginButton: {
    backgroundColor: "#FFA500",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 16,
  },
  loginButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  footerText: {
    fontSize: 14,
    textAlign: "center",
    color: "#666",
  },
  signupText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
  githubButton: {
    backgroundColor: "#333",
    paddingVertical: 15,
    borderRadius: 25,
    alignItems: "center",
    marginVertical: 16,
    flexDirection: "row",
    justifyContent: "center",
  },
  githubButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
    marginLeft: 10,
  },
});

export default WelcomeScreen;
