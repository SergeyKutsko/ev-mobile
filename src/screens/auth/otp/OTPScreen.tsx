import React, { useState } from "react";
import { SafeAreaView, TouchableOpacity, Alert, Text, View, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import OTPInput from "../../../components/otp-input/OTPInput";

type OTPScreenProps = NativeStackScreenProps<any, "OTPScreen">;

const OTPScreen: React.FC<OTPScreenProps> = ({ navigation, route }) => {
  const [enteredCode, setEnteredCode] = useState<string>("");
  const correctOTP = route?.params?.otp;

  const handleVerifyCode = () => {
    if (enteredCode === correctOTP) {
      navigation.navigate("Tenants");
    } else {
      Alert.alert("Невірний код", "Будь ласка, перевірте код і спробуйте ще раз.");
    }
  };

  return (
    <SafeAreaView>
      <View style={styles.container}>
        <View>
          <OTPInput code={enteredCode} setCode={setEnteredCode} />
          <TouchableOpacity style={styles.button} onPress={handleVerifyCode}>
            <Text style={styles.buttonText}>Зареєструватись</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default OTPScreen;

const styles = StyleSheet.create({
  container: {
    padding: 20,
    textAlign: "center",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between"
  },

  button: {
    marginTop: 50,
    fontSize: 16,
    borderRadius: 22,
    alignItems: "center",
    width: "100%",
    backgroundColor: "#4CAF50"
  },
  buttonText: {
    textAlign: "center",

    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 14,
    paddingHorizontal: 14
  }
});
