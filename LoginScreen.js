import React, { useState } from "react";
import axios from "axios";
import {View,Text,TextInput,TouchableOpacity,StyleSheet,Image,Alert,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { FontAwesome } from "@expo/vector-icons";

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(true);

  const onLogin = async () => {
    if (!email) {
      Alert.alert("Error", "Please enter your email");
      return;
    } else if (!password) {
      Alert.alert("Error", "Please enter your password");
      return;
    }
    try {
      const response = await axios.post("https://reqres.in/api/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        await AsyncStorage.setItem("token", response.data.token); // Save token on login success
        // Alert.alert("Login Successful", `Token: ${response.data.token}`);
        navigation.navigate("HomePage"); // Redirect to HomePage
        navigation.reset({
          index: 0,
          routes: [{ name: "HomePage" }],
        });
      }
    } catch (error) {
      if (error.response) {
        Alert.alert("Login Failed", error.response.data.error);
      } else {
        Alert.alert("Error", "An unexpected error occurred.");
      }
    }
  };
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image
          source={require("./assets/login.jpg")}
          style={styles.image}
          resizeMode="contain"
        />
      </View>

      <Text style={styles.loginText}>Login</Text>

      <View style={styles.inputContainer}>
        <FontAwesome name="envelope" size={20} color="#666" />
        <TextInput
          placeholder="Email ID"
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="lock" size={20} color="#666" />
        <TextInput
          placeholder="Password"
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={showPassword}
        />

        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <FontAwesome
            name={showPassword ? "eye-slash" : "eye"}
            size={20}
            color="grey"
          />
        </TouchableOpacity>
      </View>

      <TouchableOpacity>
        <Text style={styles.forgotPassword}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.loginButton} onPress={onLogin}>
        <Text style={styles.loginButtonText}>Login</Text>
      </TouchableOpacity>

      <Text style={styles.orText}>OR</Text>

      <TouchableOpacity style={styles.googleButton}>
        <Image
          source={require("./assets/GoogleIcon.png")}
          style={{ width: 30, height: 29 }}
        />
        <Text style={styles.googleButtonText}>Login with Google</Text>
      </TouchableOpacity>

      <View style={styles.registerContainer}>
        <Text style={styles.newText}>New to Logistics?</Text>
        <TouchableOpacity>
          <Text style={styles.registerText}> Register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F0F0F0",
    justifyContent: "center",
  },
  imageContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  image: {
    width: "80%",
    height: undefined, 
    aspectRatio: 1, 
  },

  loginText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF",
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    borderColor: "#DDD",
    borderWidth: 1,
  },
  input: {
    flex: 1,
    padding: 10,
  },
  forgotPassword: {
    textAlign: "right",
    color: "#007BFF",
    marginBottom: 20,
  },
  loginButton: {
    backgroundColor: "#007BFF",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  loginButtonText: {
    color: "#FFF",
    textAlign: "center",
    fontWeight: "bold",
    fontSize: 16,
  },
  orText: {
    textAlign: "center",
    color: "#666",
    marginBottom: 20,
  },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    paddingVertical: 15,
    borderRadius: 10,
    marginBottom: 30,
    borderColor: "#DDD",
    borderWidth: 1,
    justifyContent: "center",
  },
  googleButtonText: {
    color: "#666",
    marginLeft: 10,
    fontSize: 16,
  },
  registerContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  newText: {
    color: "#666",
  },
  registerText: {
    color: "#007BFF",
    fontWeight: "bold",
  },
});

export default LoginScreen;
