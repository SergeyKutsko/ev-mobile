import React, { useState, useEffect, useRef } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, TextInputProps } from 'react-native';
import Toast from 'react-native-toast-message';
import { confirmCode, db, signInWithPhone } from '../firebase';
import { collection, doc, setDoc } from 'firebase/firestore';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {BackButton} from 'components/backButton/BackButton';

type RootStackParamList = {
  OTPScreen: {
    confirmation: any;
    phone: string;
    password: string;
    fullName?: string;
    email?: string;
  };
  Elua: undefined;
};

type OTPScreenProps = NativeStackScreenProps<RootStackParamList, 'OTPScreen'>;

const OTPScreen: React.FC<OTPScreenProps> = ({ route, navigation }) => {
  const { confirmation, phone, password, fullName, email } = route.params;
  const [otp, setOtp] = useState<string[]>(['', '', '', '', '', '']);
  const [timer, setTimer] = useState<number>(300);
  const [resendDisabled, setResendDisabled] = useState<boolean>(true);
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          setResendDisabled(false);
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleOTPChange = (index: number, value: string) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const verifyOTP = async () => {
    const code = otp.join('');
    if (code.length !== 6) {
      Toast.show({ type: 'error', text1: 'Код має містити 6 цифр' });
      return;
    }
    const isValid = await confirmCode(confirmation, code);
    if (isValid) {
      await setDoc(doc(collection(db, 'users'), phone), {
        phone,
        password,
        fullName,
        email,
      });
      Toast.show({ type: 'success', text1: 'Реєстрація успішна!' });
      navigation.navigate('Elua');
    } else {
      Toast.show({ type: 'error', text1: 'Невірний код' });
    }
  };

  const resendCode = async () => {
    setResendDisabled(true);
    setTimer(300);
    try {
      await signInWithPhone(phone);
      Toast.show({ type: 'success', text1: 'Код відправлено повторно' });
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Помилка повторного відправлення' });
    }
  };

  return (
    <View style={styles.container}>
    <BackButton color={color} size={size}/>
      <Text style={styles.title}>Введіть OTP-код</Text>
      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            value={digit}
            onChangeText={(value) => handleOTPChange(index, value)}
            keyboardType="numeric"
            maxLength={1}
            style={[
              styles.otpInput,
              focusedIndex === index && styles.focusedOtpInput,
              digit ? styles.validOtpInput : styles.invalidOtpInput,
            ]}
            onFocus={() => setFocusedIndex(index)}
            onBlur={() => setFocusedIndex(null)}
          />
        ))}
      </View>
      {timer > 0 ? (
        <Text style={styles.timer}>
          Повторне відправлення через: {Math.floor(timer / 60)}:{(timer % 60).toString().padStart(2, '0')}
        </Text>
      ) : (
        <TouchableOpacity onPress={resendCode} disabled={resendDisabled}>
          <Text style={styles.resendButton}>Відправити код повторно</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity onPress={verifyOTP} style={styles.submitButton}>
        <Text style={styles.submitButtonText}>Зареєструватись</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', justifyContent: 'center', flex: 1 },
  title: { fontSize: 20, marginBottom: 20 },
  otpContainer: { flexDirection: 'row', justifyContent: 'center' },
  otpInput: {
    width: 40,
    height: 50,
    textAlign: 'center',
    borderWidth: 2,
    borderRadius: 10,
    margin: 5,
    fontSize: 18,
  },
  focusedOtpInput: { borderColor: 'blue' },
  validOtpInput: { borderColor: 'green' },
  invalidOtpInput: { borderColor: 'red' },
  timer: { marginTop: 10, fontSize: 16 },
  resendButton: { color: 'blue', marginTop: 10 },
  submitButton: { marginTop: 20, backgroundColor: 'green', padding: 10, borderRadius: 10 },
  submitButtonText: { color: 'white', fontSize: 18 },
});

export default OTPScreen;
