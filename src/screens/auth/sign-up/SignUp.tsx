// import { CommonActions } from '@react-navigation/native';
// import I18n from 'i18n-js';
// import { Icon, IIconProps, Spinner } from 'native-base';
// import React, {useState} from 'react';
// import {Keyboard, Text, TextInput} from 'react-native';
// import { auth } from '../../../config/firebase';
// import { createUserWithEmailAndPassword } from 'firebase/auth';

// import computeFormStyleSheet from '../../../FormStyles';
// import ReactNativeRecaptchaV3 from '../../../re-captcha/ReactNativeRecaptchaV3';
// import BaseProps from '../../../types/BaseProps';
// import { HTTPError } from '../../../types/HTTPError';
// import Message from '../../../utils/Message';
// import Utils from '../../../utils/Utils';
// import BaseScreen from '../../base-screen/BaseScreen';
// import AuthHeader from '../AuthHeader';
// import computeStyleSheet from '../AuthStyles';
// import { StatusCodes } from 'http-status-codes';
// import { TenantConnection } from '../../../types/Tenant';
// import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
// import { scale } from 'react-native-size-matters';
// import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
// import {SafeAreaView} from 'react-native-safe-area-context';
// import {Button, Input, CheckBox} from 'react-native-elements';
// import HeaderComponent from '../../../components/header/HeaderComponent';
// import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

// export interface Props extends BaseProps {}

// interface State {
//   tenantSubDomain?: string;
//   tenantName?: string;
//   tenantLogo?: string;
//   name?: string;
//   firstName?: string;
//   email?: string;
//   phoneNumber?: string;
//   password?: string;
//   repeatPassword?: string;
//   eula?: boolean;
//   captchaSiteKey?: string;
//   captchaBaseUrl?: string;
//   captcha?: string;
//   signingUp?: boolean;
//   loading?: boolean;
//   hidePassword?: boolean;
//   hideRepeatPassword?: boolean;
//   performSignUp?: boolean;
// }

// export default class SignUp extends BaseScreen<Props, State> {
//   public state: State;
//   public props: Props;
//   private passwordInput: TextInput;
//   private phoneNumberInput: TextInput;
//   private firstNameInput: TextInput;
//   private emailInput: TextInput;
//   private repeatPasswordInput: TextInput;

//   public constructor(props: Props) {
//     super(props);
//     this.state = {
//       tenantSubDomain: Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', '') as string,
//       tenantName: '',
//       tenantLogo: null,
//       name: '',
//       firstName: '',
//       email: '',
//       phoneNumber: '',
//       password: '',
//       repeatPassword: '',
//       eula: false,
//       captchaSiteKey: null,
//       captchaBaseUrl: null,
//       captcha: null,
//       signingUp: false,
//       loading: true,
//       hidePassword: true,
//       hideRepeatPassword: true,
//       performSignUp: false
//     };
//   }

//   const [phoneNumber, setPhoneNumber] = useState<string>('');
//   const [isLoading, setIsLoading] = useState<boolean>(false);

//   public setState = (
//     state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
//     callback?: () => void
//   ) => {
//     super.setState(state, callback);
//   };

//   public async setTenantLogo(tenant: TenantConnection): Promise<void> {
//     try {
//       if (tenant) {
//         const tenantLogo = await this.centralServerProvider.getTenantLogoBySubdomain(tenant);
//         this.setState({tenantLogo});
//       }
//     } catch (error) {
//       switch ( error?.request?.status ) {
//         case StatusCodes.NOT_FOUND:
//           return null;
//         default:
//           await Utils.handleHttpUnexpectedError(
//             this.centralServerProvider,
//             error,
//             null,
//             null,
//             null,
//             async (redirectedTenant: TenantConnection) => this.setTenantLogo(redirectedTenant)
//           );
//           break;
//       }
//     }
//     return null;
//   }

//   public async componentDidMount(): Promise<void> {
//     await super.componentDidMount();
//     const tenant = await this.centralServerProvider.getTenant(this.state.tenantSubDomain);
//     await this.setTenantLogo(tenant);
//     this.setState({
//       loading: false,
//       tenantName: tenant?.name ?? '',
//       captchaSiteKey: this.centralServerProvider.getCaptchaSiteKey(),
//       captchaBaseUrl: this.centralServerProvider.getCaptchaBaseUrl()
//     });
//   }

//   public async componentDidFocus(): Promise<void> {
//     super.componentDidFocus();
//     const tenantSubDomain = Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', this.state.tenantSubDomain) as string;
//     const tenant = await this.centralServerProvider.getTenant(tenantSubDomain.toString());
//     await this.setTenantLogo(tenant);
//   }

//   public onCaptchaCreated = (captcha: string) => {
//     this.setState({ captcha }, this.state.performSignUp ? async () => this.signUp() : () => {});
//   };

//   public async signUp(): Promise<void> {
//     // Check field
//     const { tenantSubDomain, name, firstName, email, password, eula, captcha } = this.state;
//     const formIsValid = this.isFormValid();
//     // Force captcha regeneration for next signUp click
//     if (formIsValid && captcha) {
//       try {
//         // Loading
//         // Register
//         await this.centralServerProvider.register(
//           tenantSubDomain,
//           name,
//           firstName,
//           email,
//           Utils.getDeviceDefaultSupportedLocale(),
//           password,
//           eula,
//           captchazzzz
//         );
//         // Reset
//         this.setState({ signingUp: false, performSignUp: false });
//         // Show
//         Message.showSuccess(I18n.t('authentication.registerSuccess'));
//         // Navigate
//         this.props.navigation.dispatch(
//           CommonActions.reset({
//             index: 0,
//             routes: [
//               {
//                 name: 'Login',
//                 params: {
//                   tenantSubDomain: this.state.tenantSubDomain,
//                   email: this.state.email
//                 }
//               }
//             ]
//           })
//         );
//       } catch (error) {
//         // Reset
//         this.setState({ signingUp: false, performSignUp: false });
//         // Check request?
//         if (error.request) {
//           // Show error
//           switch (error.request.status) {
//             // Email already exists
//             case HTTPError.USER_EMAIL_ALREADY_EXIST_ERROR:
//               Message.showError(I18n.t('authentication.emailAlreadyExists'));
//               break;
//             // Invalid Captcha
//             case HTTPError.INVALID_CAPTCHA:
//               Message.showError(I18n.t('authentication.invalidCaptcha'));
//               break;
//             default:
//               // Other common Error
//               await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.registerUnexpectedError', null, null, async () => this.signUp());
//           }
//         } else {
//           Message.showError(I18n.t('authentication.registerUnexpectedError'));
//         }
//       }
//     }
//     this.setState({signingUp: false, performSignUp: false});
//   }

//   public render() {
//     const style = computeStyleSheet();
//     const formStyle = computeFormStyleSheet();
//     const commonColor = Utils.getCurrentCommonColor();
//     const navigation = this.props.navigation;
//     const { eula,
//       signingUp,
//       loading,
//       captcha,
//       tenantName,
//       captchaSiteKey,
//       captchaBaseUrl,
//       hidePassword,
//       hideRepeatPassword,
//       tenantLogo,
//       name,
//       firstName,
//       email,
//       password,
//       repeatPassword,
//       performSignUp } = this.state;

//   // Валідація полів
//   const validateInputs = () => {
//     if (!password || !phoneNumber) {
//       Alert.alert('Помилка', 'Всі поля мають бути заповнені');
//       return false;
//     }
//     return true;
//   };

//     // Обробка натискання кнопки реєстрації
//     const handleRegister = async () => {
//       if (!validateInputs()) {
//         return;
//       }
  
//       setIsLoading(true);
  
//       try {
//         // Заміни на свій API URL
//         const response = await axios.post('https://your-api-endpoint.com/register', {
//           password,
//           phoneNumber
//         });

//     const InputIcon = (props: IIconProps) => <Icon size={scale(20)} style={formStyle.inputIcon} {...props} />;
//     return loading ? (
//       <Spinner style={formStyle.spinner} color="grey" />
//     ) : (
//       <SafeAreaView edges={['bottom']} style={style.container}>
//         <HeaderComponent containerStyle={style.headerContainer} navigation={this.props.navigation} title={I18n.t('authentication.signUp')} />
//         <AuthHeader navigation={this.props.navigation} tenantName={tenantName} tenantLogo={tenantLogo} containerStyle={{marginHorizontal: '5%', marginBottom: scale(10)}} />
//         <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} bounces={false} persistentScrollbar={true} contentContainerStyle={style.scrollViewContentContainer} style={style.scrollView}>
//           // <Input
//           //   leftIcon={<InputIcon as={MaterialIcons} name="person" />}
//           //   containerStyle={formStyle.inputContainer}
//           //   inputStyle={formStyle.inputText}
//           //   inputContainerStyle={formStyle.inputTextContainer}
//           //   value={name}
//           //   placeholder={I18n.t('authentication.name')}
//           //   placeholderTextColor={commonColor.placeholderTextColor}
//           //   autoCapitalize="characters"
//           //   autoCorrect={false}
//           //   autoComplete={'name-family'}
//           //   textContentType={'familyName'}
//           //   keyboardType={'default'}
//           //   returnKeyType={'next'}
//           //   onSubmitEditing={() => this.firstNameInput.focus()}
//           //   renderErrorMessage={false}
//           //   onChangeText={(newName) => this.setState({ name: newName })}
//           // />
//           // <Input
//           //   ref={(ref: TextInput) => (this.firstNameInput = ref)}
//           //   leftIcon={<InputIcon as={MaterialIcons} name="person" />}
//           //   containerStyle={formStyle.inputContainer}
//           //   inputStyle={formStyle.inputText}
//           //   inputContainerStyle={formStyle.inputTextContainer}
//           //   value={firstName}
//           //   placeholder={I18n.t('authentication.firstName')}
//           //   placeholderTextColor={commonColor.placeholderTextColor}
//           //   autoCapitalize="words"
//           //   autoCorrect={false}
//           //   autoComplete={'name'}
//           //   textContentType={'name'}
//           //   keyboardType={'default'}
//           //   returnKeyType={'next'}
//           //   onSubmitEditing={() => this.emailInput.focus()}
//           //   renderErrorMessage={false}
//           //   onChangeText={(newFirstName) => this.setState({ firstName: newFirstName })}
//           // />
//           // <Input
//           //   ref={(ref: TextInput) => (this.emailInput = ref)}
//           //   leftIcon={<InputIcon  name="email" as={MaterialCommunityIcons} />}
//           //   containerStyle={formStyle.inputContainer}
//           //   inputStyle={formStyle.inputText}
//           //   inputContainerStyle={formStyle.inputTextContainer}
//           //   value={email}
//           //   placeholder={I18n.t('authentication.email')}
//           //   placeholderTextColor={commonColor.placeholderTextColor}
//           //   autoCapitalize="none"
//           //   autoCorrect={false}
//           //   autoComplete={'email'}
//           //   textContentType={'emailAddress'}
//           //   keyboardType={'email-address'}
//           //   returnKeyType={'next'}
//           //   onSubmitEditing={() => this.passwordInput.focus()}
//           //   renderErrorMessage={false}
//           //   onChangeText={(newEmail) => this.setState({ email: newEmail })}
//           // />
//           <Input
//           ref={(ref: TextInput)=>(this.phoneNumberInput = ref)}
//           leftIcon={<InputIcon name="phone" as={MaterialCommunityIcons} />}
//           />

//           <Input
//             ref={(ref: TextInput) => (this.passwordInput = ref)}
//             leftIcon={<InputIcon name="lock" as={MaterialCommunityIcons} />}
//             rightIcon={<InputIcon
//               name={hidePassword ? 'eye' : 'eye-off'}
//               as={MaterialCommunityIcons}
//               onPress={() => this.setState({ hidePassword: !hidePassword })}
//             />}
//             containerStyle={formStyle.inputContainer}
//             inputStyle={formStyle.inputText}
//             inputContainerStyle={[formStyle.inputTextContainer, !Utils.validatePassword(password) && formStyle.inputTextContainerError]}
//             value={password}
//             placeholder={I18n.t('authentication.password')}
//             placeholderTextColor={commonColor.placeholderTextColor}
//             autoCapitalize="none"
//             autoCorrect={false}
//             secureTextEntry={hidePassword}
//             textContentType={'password'}
//             keyboardType={'default'}
//             returnKeyType={'next'}
//             onSubmitEditing={() => this.repeatPasswordInput.focus()}
//             renderErrorMessage={!Utils.validatePassword(password)}
//             errorMessage={!Utils.validatePassword(password) ? I18n.t('authentication.passwordRule') : null}
//             errorStyle={formStyle.inputError}
//             onChangeText={(text) => this.setState({ password: text })}
//           />
//           <Input
//             ref={(ref: TextInput) => (this.repeatPasswordInput = ref)}
//             leftIcon={<InputIcon name="lock" as={MaterialCommunityIcons} />}
//             rightIcon={<InputIcon
//               name={hideRepeatPassword ? 'eye' : 'eye-off'}
//               as={MaterialCommunityIcons}
//               onPress={() => this.setState({ hideRepeatPassword: !hideRepeatPassword })}
//             />}
//             containerStyle={formStyle.inputContainer}
//             inputStyle={formStyle.inputText}
//             inputContainerStyle={[formStyle.inputTextContainer, !this.checkPasswords() && formStyle.inputTextContainerError]}
//             value={repeatPassword}
//             placeholder={I18n.t('authentication.repeatPassword')}
//             placeholderTextColor={commonColor.placeholderTextColor}
//             autoCapitalize="none"
//             autoCorrect={false}
//             secureTextEntry={hideRepeatPassword}
//             keyboardType={'default'}
//             returnKeyType={'done'}
//             onSubmitEditing={() => Keyboard.dismiss()}
//             renderErrorMessage={!this.checkPasswords()}
//             errorMessage={!this.checkPasswords() ? I18n.t('authentication.passwordNotMatch') : null}
//             errorStyle={formStyle.inputError}
//             onChangeText={(text) => this.setState({ repeatPassword: text })}
//           />
//           <CheckBox
//             containerStyle={[formStyle.checkboxContainer, style.checkboxContainer]}
//             textStyle={{backgroundColor: 'transparent'}}
//             checked={eula}
//             onPress={() => this.setState({ eula: !eula })}
//             title={
//               <Text style={formStyle.checkboxText}>
//                 {I18n.t('authentication.acceptEula')}
//                 <Text onPress={() => navigation.navigate('Eula')} style={style.eulaLink}>
//                   {I18n.t('authentication.eula')}
//                 </Text>
//               </Text>
//             }
//             uncheckedIcon={<InputIcon size={scale(25)} name="checkbox-blank-outline" as={MaterialCommunityIcons} />}
//             checkedIcon={<InputIcon size={scale(25)} name="checkbox-outline" as={MaterialCommunityIcons} />}
//           />
//           <Button
//             title={I18n.t('authentication.createAccount')}
//             titleStyle={formStyle.buttonTitle}
//             disabled={!this.isFormValid()}
//             disabledStyle={formStyle.buttonDisabled}
//             disabledTitleStyle={formStyle.buttonTextDisabled}
//             containerStyle={formStyle.buttonContainer}
//             buttonStyle={formStyle.button}
//             loading={signingUp}
//             loadingProps={{color: commonColor.light}}
//             onPress={() => this.setState({performSignUp: true, signingUp: true })}
//           />
//           {!captcha && captchaSiteKey && captchaBaseUrl && performSignUp && (
//             <ReactNativeRecaptchaV3
//               action="RegisterUser"
//               onHandleToken={(newCaptcha) => this.onCaptchaCreated(newCaptcha)}
//               url={captchaBaseUrl}
//               siteKey={captchaSiteKey}
//             />
//           )}
//         </KeyboardAwareScrollView>
//       </SafeAreaView>
//     );
//   }

//   private checkPasswords(): boolean {
//     const { password, repeatPassword } = this.state;
//     return !repeatPassword || repeatPassword === password;
//   }

//   private isFormValid(): boolean {
//     const {email, password, eula, name, firstName, repeatPassword} = this.state;
//     return !!name && !!firstName && !!email && !!password && !!repeatPassword && eula && this.checkPasswords() && Utils.validatePassword(password);
//   }
// }

// SignUp.tsx
// import React, { useState, useRef } from 'react';
// import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
// import { auth, db } from './firebaseConfig';
// import { PhoneAuthProvider, signInWithCredential } from "firebase/auth";
// import { collection, addDoc } from 'firebase/firestore';
// // import styles from './styles'; // Додай свої стилі

// const SignUp = () => {
//   const [phoneNumber, setPhoneNumber] = useState('');
//   const [otp, setOtp] = useState('');
//   const [generatedOtp, setGeneratedOtp] = useState('');
//   const [password, setPassword] = useState('');
//   const [confirmPassword, setConfirmPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);
//   const [timer, setTimer] = useState(60);
//   const [isTimerActive, setIsTimerActive] = useState(false);
//   const intervalRef = useRef<NodeJS.Timer>();

//   // Генерація випадкового OTP
//   const generateOtp = () => {
//     return Math.floor(100000 + Math.random() * 900000).toString();
//   };

//   const startTimer = () => {
//     setIsTimerActive(true);
//     setTimer(60);
//     intervalRef.current = setInterval(() => {
//       setTimer((prev) => {
//         if (prev <= 1) {
//           clearInterval(intervalRef.current);
//           setIsTimerActive(false);
//         }
//         return prev - 1;
//       });
//     }, 1000);
//   };

//   const handleSendOtp = async () => {
//     const newOtp = generateOtp();
//     setGeneratedOtp(newOtp);
//     startTimer();
//     Alert.alert('OTP відправлено', `OTP відправлено на номер ${phoneNumber}`);
//   };

//   const handleSignUp = async () => {
//     if (password !== confirmPassword) {
//       Alert.alert('Помилка', 'Паролі не співпадають');
//       return;
//     }

//     if (otp !== generatedOtp) {
//       Alert.alert('Помилка', 'Невірний OTP');
//       return;
//     }

//     try {
//       const userCredential = await signInWithCredential(
//         auth,
//         PhoneAuthProvider.credential(phoneNumber, otp)
//       );

//       await addDoc(collection(db, 'users'), {
//         phoneNumber,
//         password,
//       });

//       Alert.alert('Реєстрація успішна', 'Ваш акаунт було створено!');
//     } catch (error) {
//       console.error('Помилка реєстрації:', error);
//       Alert.alert('Помилка', 'Не вдалося зареєструвати акаунт');
//     }
//   };

//   return (
//     <View style={styles.container}>
//       <Text style={styles.label}>Номер телефону</Text>
//       <TextInput
//         style={styles.input}
//         value={phoneNumber}
//         onChangeText={setPhoneNumber}
//         placeholder="Введіть номер телефону"
//         keyboardType="phone-pad"
//       />

//       <TouchableOpacity
//         onPress={handleSendOtp}
//         disabled={isTimerActive}
//         style={[styles.button, isTimerActive && { opacity: 0.5 }]}
//       >
//         <Text style={styles.buttonText}>Надіслати OTP ({timer}s)</Text>
//       </TouchableOpacity>

//       <Text style={styles.label}>OTP</Text>
//       <TextInput
//         style={styles.input}
//         value={otp}
//         onChangeText={setOtp}
//         placeholder="Введіть OTP"
//         keyboardType="numeric"
//       />

//       <Text style={styles.label}>Пароль</Text>
//       <View style={styles.passwordContainer}>
//         <TextInput
//           style={styles.input}
//           value={password}
//           onChangeText={setPassword}
//           placeholder="Введіть пароль"
//           secureTextEntry={!showPassword}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//           <Text>{showPassword ? '👁️' : '🙈'}</Text>
//         </TouchableOpacity>
//       </View>

//       <Text style={styles.label}>Підтвердження пароля</Text>
//       <View style={styles.passwordContainer}>
//         <TextInput
//           style={styles.input}
//           value={confirmPassword}
//           onChangeText={setConfirmPassword}
//           placeholder="Підтвердіть пароль"
//           secureTextEntry={!showPassword}
//         />
//         <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
//           <Text>{showPassword ? '👁️' : '🙈'}</Text>
//         </TouchableOpacity>
//       </View>

//       <TouchableOpacity
//         style={[
//           styles.button,
//           (password === '' || confirmPassword === '' || otp !== generatedOtp) && { opacity: 0.5 }
//         ]}
//         onPress={handleSignUp}
//         disabled={password === '' || confirmPassword === '' || otp !== generatedOtp}
//       >
//         <Text style={styles.buttonText}>Зареєструватись</Text>
//       </TouchableOpacity>
//     </View>
//   );
// };

// export default SignUp;
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from '@react-native';
import Toast from 'react-native-toast-message';
import signInWithPhone  from '@react-native-firebase/app';
import { collection, doc, setDoc } from 'firebase/firestore';

import  Ionicons  from 'react-native-vector-icons';
import {BackButton} from '../../../components/backButton/BackButton';

interface SignUpProps {
  navigation: any;
}

const SignUp = ({ navigation }:SignUpProps) => {
  const [phone, setPhone] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  
  const validateInputs = (): boolean => {
    const phoneRegex = /^\+\d{10,15}$/;
    if (!phone.match(phoneRegex)) {
      Toast.show({ type: 'error', text1: 'Некоректний номер телефону' });
      return false;
    }
    if (password.length < 6) {
      Toast.show({ type: 'error', text1: 'Пароль має містити мінімум 6 символів' });
      return false;
    }
    if (password !== confirmPassword) {
      Toast.show({ type: 'error', text1: 'Паролі не співпадають' });
      return false;
    }
    if (fullName && (fullName.length < 2 || fullName.length > 30)) {
      Toast.show({ type: 'error', text1: 'Ім’я має містити від 2 до 30 літер' });
      return false;
    }
    if (email && !/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
      Toast.show({ type: 'error', text1: 'Некоректний формат email' });
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validateInputs()) return;
    try {
      const confirmationResult = await signInWithPhone(phone);
      if (confirmationResult) {
        navigation.navigate('OTPScreen', { confirmation: confirmationResult, phone, password, fullName, email });
      }
    } catch (error) {
      Toast.show({ type: 'error', text1: 'Помилка реєстрації' });
    }
  };

  return (
    <View style={styles.container}>
    <BackButton />
      <View style={styles.inputContainer}>
        // <Ionicons name="call" size={20} color="gray" style={styles.icon} />
        <TextInput placeholder="Номер телефону *" value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        // <Ionicons name="mail" size={20} color="gray" style={styles.icon} />
        <TextInput placeholder="Email (необов’язково)" value={email} onChangeText={setEmail} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        // <Ionicons name="person" size={20} color='gray' style={styles.icon} />
        <TextInput placeholder="Повне ім’я (необов’язково)" value={fullName} onChangeText={setFullName} style={styles.input} />
      </View>
      <View style={styles.inputContainer}>
        // <Ionicons name="lock-closed" size={20} color="gray" style={styles.icon} />
        <TextInput placeholder="Пароль *" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} style={styles.input} />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? "eye" : "eye-off"} size={20} color="gray" style={styles.iconRight} />
        </TouchableOpacity>
      </View>
      <View style={styles.inputContainer}>
        <Ionicons name="lock-closed" size={20} color="gray" style={styles.icon} />
        <TextInput placeholder="Підтвердити пароль *" value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry={!showPassword} style={styles.input} />
      </View>
      <TouchableOpacity onPress={handleRegister} style={styles.button}>
        <Text style={styles.buttonText}>Продовжити</Text>
      </TouchableOpacity>
      <Toast />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  inputContainer: { flexDirection: 'row', alignItems: 'center', borderBottomWidth: 1, marginBottom: 10 },
  input: { flex: 1, height: 40, marginLeft: 10 },
  icon: { marginLeft: 10 },
  iconRight: { marginRight: 10 },
  button: { backgroundColor: 'blue', padding: 10, borderRadius: 5, alignItems: 'center', marginTop: 20 },
  buttonText: { color: 'white', fontSize: 18 },
});

export default SignUp;