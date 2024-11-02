import { useState } from "react";
import {
  Text,
  Alert,
  StyleSheet,
  View,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { StatusBar } from "expo-status-bar";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import db from "@/database/db";

import Theme from "@/assets/theme";

export default function Login() {
  const [email, setEmail] = useState("");
  const [passcode, setpasscode] = useState("");
  const [loading, setLoading] = useState(false);

  const signInWithEmail = async () => {
    setLoading(true);
    try {
      const { data, error } = await db.auth.signInWithOtp({
        email: email,
        options: {
          shouldCreateUser: false,
        },
      });

      if (error) {
        Alert.alert(error.message);
      } else {
        Alert.alert(
          "Please check your email for a one-time password to sign in."
        );
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
    }
  };

  const verifyCode = async () => {
    setLoading(true);
    try {
      const { session, error } = await db.auth.verifyOtp({
        email: email,
        token: passcode,
        type: "email",
      });

      if (error) {
        Alert.alert(error.message);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  };

  const isSendCodeDisabled = loading || email.length === 0;
  const isSignInDisabled =
    loading || email.length === 0 || passcode.length !== 6;

  return (
    <View style={styles.container}>
      <StatusBar style="light" />
      <View style={styles.splash}>
        <MaterialCommunityIcons
          size={64}
          name="bee-flower"
          color={Theme.colors.iconHighlighted}
        />
        <Text style={styles.splashText}>Buzz</Text>
      </View>
      <TextInput
        onChangeText={(text) => setEmail(text)}
        value={email}
        placeholder="email@address.com"
        placeholderTextColor={Theme.colors.textSecondary}
        autoCapitalize={"none"}
        style={styles.input}
      />
      <TextInput
        onChangeText={(text) => setpasscode(text)}
        value={passcode}
        placeholder="One-time passcode (6 digits)"
        placeholderTextColor={Theme.colors.textSecondary}
        secureTextEntry={true}
        autoCapitalize={"none"}
        style={styles.input}
      />
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          onPress={() => signInWithEmail()}
          disabled={isSendCodeDisabled}
        >
          <Text
            style={[
              styles.button,
              isSendCodeDisabled ? styles.buttonDisabled : undefined,
            ]}
          >
            Send code
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => verifyCode()}
          disabled={isSignInDisabled}
        >
          <Text
            style={[
              styles.button,
              isSignInDisabled ? styles.buttonDisabled : undefined,
            ]}
          >
            Sign in
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingTop: 60,
    padding: 12,
    backgroundColor: Theme.colors.backgroundPrimary,
    flex: 1,
  },
  splash: {
    alignItems: "center",
    marginBottom: 12,
  },
  splashText: {
    fontWeight: "bold",
    color: Theme.colors.textPrimary,
    fontSize: 60,
  },
  buttonContainer: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-around",
  },
  verticallySpaced: {
    marginVertical: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
  input: {
    color: Theme.colors.textPrimary,
    backgroundColor: Theme.colors.backgroundSecondary,
    width: "100%",
    padding: 16,
  },
  button: {
    color: Theme.colors.textHighlighted,
    fontSize: 18,
    fontWeight: 18,
    padding: 8,
  },
  buttonDisabled: {
    color: Theme.colors.textSecondary,
  },
});
