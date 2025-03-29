import React from 'react';
import { SafeAreaView, TouchableOpacity, Text, View,StyleSheet } from 'react-native';
import OTPInput from '../../../components/otp-input/OTPInput';



const OTPScreen: React.FC =()=> {

    return (
    <SafeAreaView>
        <View style={styles.container}>
           
            <View>
                <OTPInput/>
                <TouchableOpacity onPress={() => {}}>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() =>navigation.navigate('OTPScreen')}><Text style={styles.buttonText}>Зареєструватись</Text>
                </TouchableOpacity>
            </View>
        </View>
            
    </SafeAreaView>
       
    );
}

export default OTPScreen;

const styles = StyleSheet.create({
container: {
    padding:20,
    textAlign: 'center',
    display: 'flex',
    flexDirection: 'column',
justifyContent: 'space-between'
},

button: {
    marginTop: 50,
    fontSize:16,
    borderRadius: 22,
    alignItems: "center",
    width: "100%",
    backgroundColor: '#4CAF50',


},
buttonText: {
    textAlign: 'center',

    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    paddingVertical: 14,
    paddingHorizontal: 14,
}
})
