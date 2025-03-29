import React, { FC, useState, useEffect } from "react";
// eslint-disable-next-line import/namespace
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { CodeField, useBlurOnFulfill, useClearByFocusCell } from "react-native-confirmation-code-field";

const CELL_COUNT = 6;
const CORRECT_OTP = "123456"; // Тестовий правильний код
const RESEND_TIME = 300; // 5 хвилин у секундах

const OTPInput: FC = () => {
  const [value, setValue] = useState<string>("");
  const [error, setError] = useState<boolean>(false);
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(RESEND_TIME);
  const [canResend, setCanResend] = useState<boolean>(false);

  const ref = useBlurOnFulfill({ value, cellCount: CELL_COUNT });
  const [props, getCellOnLayoutHandler] = useClearByFocusCell({ value, setValue });

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
      return () => clearInterval(interval);
    } else {
      setCanResend(true);
    }
  }, [timer]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${minutes}:${sec < 10 ? "0" : ""}${sec}`;
  };

  const handleChangeText = (text: string) => {
    const numericText = text.replace(/[^0-9]/g, ""); // Фільтр цифр
    setValue(numericText);

    if (error && numericText.length < CELL_COUNT) {
      setError(false); // При видаленні хоч одного символу прибираємо помилку
    }

    if (numericText.length === CELL_COUNT) {
      handleVerifyCode(numericText);
    } else {
      setIsVerified(false); // Якщо видалили хоча б одну цифру після вірного коду — сірий бордер
    }
  };

  const handleVerifyCode = (code: string) => {
    if (code === CORRECT_OTP) {
      setIsVerified(true);
      setError(false);
    } else {
      setIsVerified(false);
      setError(true);
    }
  };

  const handleResendCode = () => {
    setValue("");
    setError(false);
    setIsVerified(false);
    setTimer(RESEND_TIME);
    setCanResend(false);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Введіть код підтвердження</Text>

      <CodeField
        ref={ref}
        {...props}
        value={value}
        onChangeText={handleChangeText}
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
              isVerified && value.length === CELL_COUNT ? styles.verifiedCell : null
            ]}>
            <Text style={styles.cellText}>{symbol || " "}</Text>
          </View>
        )}
      />

      {/* Текст помилки або підтвердження */}
      <Text style={[styles.messageText, error && styles.errorText, isVerified && value.length === CELL_COUNT && styles.successText]}>
        {error ? "Невірний код, спробуйте ще раз" : isVerified && value.length === CELL_COUNT ? "Вітаю, код підтвердження вірний!" : ""}
      </Text>

      {/* Таймер або кнопка повторної відправки */}
      {!canResend ? (
        <Text style={styles.timerText}>Отримати новий код верифікації через <Text style={styles.timerStyle}>{formatTime(timer)}</Text></Text>
      ) : (
        <TouchableOpacity onPress={handleResendCode} style={styles.resendButton}>
          <Text style={styles.resendText}>Надіслати код повторно</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // display: 'flex',
    // alignItems: "center",
    // padding: 20,
    // justifyContent: "center",
    // marginTop: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 40,
    color: "#212121"
  },
  codeFieldRoot: {
    // marginTop: 20,
  },
  cell: {
    width: "14.5%",
    height: 60,
    borderWidth: 3,
    borderColor: "#ccc",
    backgroundColor: "#EEEEEE",
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 5
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
    height: 20 // Фіксована висота, щоб не зміщувало макет
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

export default OTPInput;
