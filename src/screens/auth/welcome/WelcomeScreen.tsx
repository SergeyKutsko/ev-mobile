import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView } from 'react-native';
import { AuthStackParamList } from '../../../App/AuthNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';

type WelcomeScreenProps = NativeStackScreenProps<AuthStackParamList, 'WelcomeScreen'>;

const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ navigation }) => {
  return (
    <SafeAreaView style={{flex:1}}>
    <View style={styles.container}>
    <View style={styles.wrapper}>
    <View style={styles.wrapperText}>
      <Text style={styles.title}>Вітаємо в додатку Ninja Taxi!</Text>
      <Text style={styles.text}>Ninja Taxi – це не просто таксі. Це місія, яка об'єднує сучасні технології, екологічну свідомість і прагнення змінити транспортну реальність України. Ми будуємо сталий світ, де екологічний та безпечний транспорт – це стандарт, а не виключення.</Text>
    </View>
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
    </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    padding: 20,
  },

  wrapper: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
    height: '100%',
  },

  wrapperText: {
    display: 'flex',
    marginBottom:100,

  },

  title: {
    fontSize: 26,
    marginBottom: 30,
    textAlign: 'center',
  },

  text: {
    fontSize: 16,
    textAlign: 'center',
    color: '#0009'
  },

  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },

  button: {
    backgroundColor: '#4CAF50',
    padding: 16,
    marginBottom: 30,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
  },

  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight:'700'
  },

});

export default WelcomeScreen;
