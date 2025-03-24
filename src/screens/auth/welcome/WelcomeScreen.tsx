import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {AuthStackParamList} from '../../../App/AuthNavigator';

type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'WelcomeScreen'>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => (
  <View style={styles.container}>
    <Text style={styles.title}>Вітаємо в додатку Ninja Taxi!</Text>

    <View style={styles.buttonContainer}>
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('SignUp')}
      >
        <Text style={styles.buttonText}>Зареєструватися</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Login')}
      >
        <Text style={styles.buttonText}>Увійти</Text>
      </TouchableOpacity>
    </View>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginVertical: 10,
    borderRadius: 8,
    width: 200, // Фіксована ширина для центрування
    alignItems: 'center', // Центрує текст в межах кнопки
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default WelcomeScreen;

