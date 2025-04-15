import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

interface OTPInputProps {
  code: string;
  setCode: (val: string) => void;
  correctCode: string;
}

const CELL_COUNT = 6;
const RESEND_TIME = 300; // 5 хвилин у секундах

const OTPInput: React.FC<OTPInputProps> = ({ code, setCode, correctCode }) => {
  const [error, setError] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(RESEND_TIME);
  const [canResend, setCanResend] = useState<boolean>(false);

  const ref = useBlurOnFulfill({ value: code, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value: code, setValue: setCode });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  useEffect(() => {
    if (code.length === CELL_COUNT) {
      handleVerifyCode(code);
    } else {
      setIsVerified(false);
    }
  }, [code]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleVerifyCode = (input: string) => {
    if (input === correctCode) {
      setIsVerified(true);
      setError(false);
    } else {
      setIsVerified(false);
      setError(true);
    }
  };

  const handleResendCode = () => {
    setCode("");
    setError(false);
    setIsVerified(false);
    setTimer(RESEND_TIME);
    setCanResend(false);
    // Тут можна викликати функцію повторної відправки коду, якщо потрібно
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Введіть код підтвердження</Text>

      <CodeField
        ref={ref}
        {...props}
        value={code}
        onChangeText={(text) => {
          const numeric = text.replace(/[^0-9]/g, "");
          setCode(numeric);
          if (error && numeric.length < CELL_COUNT) {
            setError(false);
          }
        }}
        cellCount={CELL_COUNT}
        rootStyle={styles.codeFieldRoot}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        renderCell={({ index, symbol, isFocused }) => (
          <View
            key={index}
            onLayout={getCellOnLayoutHandler(index)}
            style={[
              styles.cell,
              isFocused && styles.focusedCell,
              error && styles.errorCell,
              isVerified && code.length === CELL_COUNT ? styles.verifiedCell : null
            ]}>
            <Text style={styles.cellText}>{symbol || " "}</Text>
          </View>
        )}
      />

      <Text style={[styles.messageText, error && styles.errorText, isVerified && code.length === CELL_COUNT && styles.successText]}>
        {error ? "Невірний код, спробуйте ще раз" : isVerified ? "Вітаю, код підтвердження вірний!" : ""}
      </Text>

      {!canResend ? (
        <Text style={styles.timerText}>
          Отримати новий код через <Text style={styles.timerStyle}>{formatTime(timer)}</Text>
        </Text>
      ) : (
        <TouchableOpacity onPress={handleResendCode} style={styles.resendButton}>
          <Text style={styles.resendText}>Надіслати код повторно</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default OTPInput;

const styles = StyleSheet.create({
  container: {},
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 40,
    color: "#212121"
  },
  codeFieldRoot: {},
  cell: {
    width: "14.5%",
    height: 70,
    borderWidth: 3,
    borderColor: "#ccc",
    backgroundColor: "#EEEEEE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center"
  },
  focusedCell: {
    backgroundColor: "#246BFD14",
    borderColor: "#429DF0"
  },
  errorCell: {
    borderColor: "#FF0000"
  },
  verifiedCell: {
    borderColor: "#4CAF50"
  },
  cellText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#212121"
  },
  messageText: {
    width: "100%",
    textAlign: "left",
    marginTop: 4,
    fontSize: 14,
    height: 20
  },
  errorText: {
    color: "#FF0000"
  },
  successText: {
    color: "#4CAF50"
  },
  timerText: {
    marginTop: 10,
    fontSize: 16,
    color: "#777"
  },
  timerStyle: {
    fontWeight: "700",
    color: "#212121"
  },
  resendButton: {
    marginTop: 40,
    width: "100%",
    paddingVertical: 14,
    paddingHorizontal: 20,
    backgroundColor: "#1E90FF",
    borderRadius: 22
  },
  resendText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "600"
  }
});
