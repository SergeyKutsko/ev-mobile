import { CommonActions } from '@react-navigation/native';
import I18n from 'i18n-js';
import { Icon, IIconProps, Spinner } from 'native-base';
import React from 'react';
import {Keyboard, Text, TextInput, View, StyleSheet} from 'react-native';
import { AuthStackParamList } from '../../../App/AuthNavigator';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import computeFormStyleSheet from '../../../FormStyles';
import ReactNativeRecaptchaV3 from '../../../re-captcha/ReactNativeRecaptchaV3';
import BaseProps from '../../../types/BaseProps';
import { HTTPError } from '../../../types/HTTPError';
import Message from '../../../utils/Message';
import Utils from '../../../utils/Utils';
import BaseScreen from '../../base-screen/BaseScreen';
import AuthHeader from '../AuthHeader';
import computeStyleSheet from '../AuthStyles';
import { StatusCodes } from 'http-status-codes';
import { TenantConnection } from '../../../types/Tenant';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { scale } from 'react-native-size-matters';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Button, Input, CheckBox} from 'react-native-elements';
import HeaderComponent from '../../../components/header/HeaderComponent';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

type SignUpProps = NativeStackScreenProps<AuthStackParamList, 'SignUp'>;

interface State {
  tenantSubDomain?: string;
  tenantName?: string;
  tenantLogo?: string;
  name?: string;
  firstName?: string;
  email?: string;
  phoneNumber: string;
  password: string;
  repeatPassword: string;
  eula?: boolean;
  captchaSiteKey?: string;
  captchaBaseUrl?: string;
  captcha?: string;
  signingUp?: boolean;
  loading?: boolean;
  hidePassword?: boolean;
  hideRepeatPassword?: boolean;
  performSignUp?: boolean;
}

export default class SignUp extends BaseScreen<Props, State, SignUpProps> {
  public state: State;
  public props: Props;
  private phoneNumberInput: TextInput;
  private passwordInput: TextInput;
  private firstNameInput: TextInput;
  private emailInput: TextInput;
  private repeatPasswordInput: TextInput;
  public props: navigation;

  public constructor(props: Props) {
    super(props);
    this.state = {
      tenantSubDomain: Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', '') as string,
      tenantName: '',
      tenantLogo: null,
      name: '',
      firstName: '',
      email: '',
      phoneNumber: '',
      password: '',
      repeatPassword: '',
      eula: false,
      captchaSiteKey: null,
      password: '',
      repeatPassword: '',
      eula: false,
      captchaSiteKey: null,
      captchaBaseUrl: null,
      captcha: null,
      signingUp: false,
      loading: true,
      hidePassword: true,
      hideRepeatPassword: true,
      performSignUp: false
    };
  }

  public setState = (
    state: State | ((prevState: Readonly<State>, props: Readonly<Props>) => State | Pick<State, never>) | Pick<State, never>,
    callback?: () => void
  ) => {
    super.setState(state, callback);
  };

  public async setTenantLogo(tenant: TenantConnection): Promise<void> {
    try {
      if (tenant) {
        const tenantLogo = await this.centralServerProvider.getTenantLogoBySubdomain(tenant);
        this.setState({tenantLogo});
      }
    } catch (error) {
      switch ( error?.request?.status ) {
        case StatusCodes.NOT_FOUND:
          return null;
        default:
          await Utils.handleHttpUnexpectedError(
            this.centralServerProvider,
            error,
            null,
            null,
            null,
            async (redirectedTenant: TenantConnection) => this.setTenantLogo(redirectedTenant)
          );
          break;
      }
    }
    return null;
  }

  public async componentDidMount(): Promise<void> {
    await super.componentDidMount();
    const tenant = await this.centralServerProvider.getTenant(this.state.tenantSubDomain);
    await this.setTenantLogo(tenant);
    this.setState({
      loading: false,
      tenantName: tenant?.name ?? '',
      captchaSiteKey: this.centralServerProvider.getCaptchaSiteKey(),
      captchaBaseUrl: this.centralServerProvider.getCaptchaBaseUrl()
    });
  }

  public async componentDidFocus(): Promise<void> {
    super.componentDidFocus();
    const tenantSubDomain = Utils.getParamFromNavigation(this.props.route, 'tenantSubDomain', this.state.tenantSubDomain) as string;
    const tenant = await this.centralServerProvider.getTenant(tenantSubDomain.toString());
    await this.setTenantLogo(tenant);
  }

  public onCaptchaCreated = (captcha: string) => {
    this.setState({ captcha }, this.state.performSignUp ? async () => this.signUp() : () => {});
  };

  public async signUp(): Promise<void> {
    // Check field
    const { tenantSubDomain, name, firstName, email, password,phoneNumber, eula, captcha } = this.state;
    const formIsValid = this.isFormValid();
    // Force captcha regeneration for next signUp click
    if (formIsValid && captcha) {
      try {
        // Loading
        // Register
        await this.centralServerProvider.register(
          tenantSubDomain,
          name,
          firstName,
          email,
          Utils.getDeviceDefaultSupportedLocale(),
          password,
          phoneNumber,
          eula,
          captcha
        );
        // Reset
        this.setState({ signingUp: false, performSignUp: false });
        // Show
        Message.showSuccess(I18n.t('authentication.registerSuccess'));
        // Navigate
        this.props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [
              {
                name: 'SignUp',
                params: {
                  tenantSubDomain: this.state.tenantSubDomain,
                  email: this.state.email
                }
              }
            ]
          })
        );
      } catch (error) {
        // Reset
        this.setState({ signingUp: false, performSignUp: false });
        // Check request?
        if (error.request) {
          // Show error
          switch (error.request.status) {
            // Email already exists
            case HTTPError.USER_EMAIL_ALREADY_EXIST_ERROR:
              Message.showError(I18n.t('authentication.emailAlreadyExists'));
              break;
            // Invalid Captcha
            case HTTPError.INVALID_CAPTCHA:
              Message.showError(I18n.t('authentication.invalidCaptcha'));
              break;
            default:
              // Other common Error
              await Utils.handleHttpUnexpectedError(this.centralServerProvider, error, 'authentication.registerUnexpectedError', null, null, async () => this.signUp());
          }
        } else {
          Message.showError(I18n.t('authentication.registerUnexpectedError'));
        }
      }
    }
    this.setState({signingUp: false, performSignUp: false});
  }

  public render() {
    const style = computeStyleSheet();
    const formStyle = computeFormStyleSheet();
    const commonColor = Utils.getCurrentCommonColor();
    const navigation = this.props.navigation;
    const { eula,
      signingUp,
      loading,
      captcha,
      tenantName,
      captchaSiteKey,
      captchaBaseUrl,
      hidePassword,
      hideRepeatPassword,
      tenantLogo,
      name,
      firstName,
      email,
      phoneNumber,
      password,
      repeatPassword,
      performSignUp } = this.state;
    const InputIcon = (props: IIconProps) => <Icon size={scale(20)} style={formStyle.inputIcon} {...props} />;
    return loading ? (
      <Spinner style={formStyle.spinner} color="grey" />
    ) : (
      <SafeAreaView edges={['bottom']} style={style.container}>
        <HeaderComponent containerStyle={style.headerContainer} navigation={this.props.navigation} title={I18n.t('authentication.signUp')} />
       {/* <AuthHeader navigation={this.props.navigation} tenantName={tenantName} tenantLogo={tenantLogo} containerStyle={{marginHorizontal: '5%', marginBottom: scale(10)}} />*/}
        <KeyboardAwareScrollView keyboardShouldPersistTaps={'always'} bounces={false} persistentScrollbar={true} contentContainerStyle={style.scrollViewContentContainer} style={style.scrollView}>
     <View style={styles.mainWrapper}>
     <Text style={styles.mainTitle}> Зареєструватись</Text>
        {/*          // <Input
          //   ref={(ref: TextInput) => (this.firstNameInput = ref)}
          //   leftIcon={<InputIcon as={MaterialIcons} name="person" />}
          //   containerStyle={formStyle.inputContainer}
          //   inputStyle={formStyle.inputText}
          //   inputContainerStyle={formStyle.inputTextContainer}
          //   value={firstName}
          //   placeholder={I18n.t('authentication.firstName')}
          //   placeholderTextColor={commonColor.placeholderTextColor}
          //   autoCapitalize="words"
          //   autoCorrect={false}
          //   autoComplete={'name'}
          //   textContentType={'name'}
          //   keyboardType={'default'}
          //   returnKeyType={'next'}
          //   onSubmitEditing={() => this.emailInput.focus()}
          //   renderErrorMessage={false}
          //   onChangeText={(newFirstName) => this.setState({ firstName: newFirstName })}
          // />
          <Input
            ref={(ref: TextInput) => (this.emailInput = ref)}
            leftIcon={<InputIcon  name="email" as={MaterialCommunityIcons} />}
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            inputContainerStyle={formStyle.inputTextContainer}
            value={email}
            placeholder={I18n.t('authentication.email')}
            placeholderTextColor={commonColor.placeholderTextColor}
            autoCapitalize="none"
            autoCorrect={false}
            autoComplete={'email'}
            textContentType={'emailAddress'}
            keyboardType={'email-address'}
            returnKeyType={'next'}
            onSubmitEditing={() => this.passwordInput.focus()}
            renderErrorMessage={false}
            onChangeText={(newEmail) => this.setState({ email: newEmail })}
          />
         
        <Input
          ref={(ref: TextInput) => (this.phoneNumberInput = ref)}
          leftIconContainerStyle={{leftIcon={<InputIcon name="phone" as={MaterialCommunityIcons}}}}{<Text>+380</Text>}}
           />}
          
          containerStyle={formStyle.inputContainer}
          label={"Номер телефону"}
          labelStyle={{marginBottom:4, color:"#c7c7c7", }}
            inputStyle={formStyle.inputText}
            inputContainerStyle={[formStyle.inputTextContainer, !Utils.validatePassword(password) && formStyle.inputTextContainerError]}
            value={phoneNumber}
            placeholder={I18n.t('authentication.phoneNumber')}
            placeholderTextColor={commonColor.placeholderTextColor}
            autoCapitalize="none"
            autoCorrect={false}
            // secureTextEntry={hidePassword}
            textContentType={'phoneNumber'}
            keyboardType={'number-pad'}
            returnKeyType={'next'}
            onSubmitEditing={() => this.phoneNumberInput.focus()}
            renderErrorMessage={!Utils.validatePassword(password)}
            // errorMessage={!Utils.validatePassword(password) ? I18n.t('authentication.phoneNumber') : null}
            errorStyle={formStyle.inputError}
            onChangeText={(text) => this.setState({ phoneNumber: text })}
        />
 */}
 <Input
 ref={(ref: TextInput) => { this.phoneNumberInput = ref; }}
 leftIcon={<InputIcon name="phone" as={MaterialCommunityIcons} />}
 containerStyle={formStyle.inputContainer}
 label="Номер телефону"
 labelStyle={{ marginBottom: 4, color: "#4d4c4c" }}
 inputStyle={formStyle.inputText}
 inputContainerStyle={[
   formStyle.inputTextContainer,
   !Utils.validatePassword(password) && formStyle.inputTextContainerError,
 ]}
 value={phoneNumber}
 placeholder="+380-11-11-111"
 placeholderTextColor={commonColor.placeholderTextColor}
 autoCapitalize="none"
 autoCorrect={false}
 textContentType="telephoneNumber"
 keyboardType="number-pad"
 returnKeyType="next"
 onSubmitEditing={() => this.phoneNumberInput.focus()}
 renderErrorMessage={!Utils.validatePassword(password)}
 errorStyle={formStyle.inputError}
 onChangeText={(text) => this.setState({ phoneNumber: text })}
/>

        

          <Input
            ref={(ref: TextInput) => (this.passwordInput = ref)}
            leftIcon={<InputIcon name="lock" as={MaterialCommunityIcons} />}
            rightIcon={<InputIcon
              name={hidePassword ? 'eye' : 'eye-off'}
              as={MaterialCommunityIcons}
              onPress={() => this.setState({ hidePassword: !hidePassword })}
            />}
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            label={"Пароль"}
            labelStyle={{marginBottom:4, color:"#4d4c4c" }}
            inputContainerStyle={[formStyle.inputTextContainer, !Utils.validatePassword(password) && formStyle.inputTextContainerError]}
            value={password}
            placeholder={("******")}
            placeholderTextColor={commonColor.placeholderTextColor}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={hidePassword}
            textContentType={'password'}
            keyboardType={'default'}
            returnKeyType={'next'}
            onSubmitEditing={() => this.repeatPasswordInput.focus()}
            renderErrorMessage={!Utils.validatePassword(password)}
            errorMessage={!Utils.validatePassword(password) ? I18n.t('authentication.passwordRule') : null}
            errorStyle={formStyle.inputError}
            onChangeText={(text) => this.setState({ password: text })}
          />
          <Input
            ref={(ref: TextInput) => (this.repeatPasswordInput = ref)}
            leftIcon={<InputIcon name="lock" as={MaterialCommunityIcons} />}
            rightIcon={<InputIcon
              name={hideRepeatPassword ? 'eye' : 'eye-off'}
              as={MaterialCommunityIcons}
              onPress={() => this.setState({ hideRepeatPassword: !hideRepeatPassword })}
            />}
            containerStyle={formStyle.inputContainer}
            inputStyle={formStyle.inputText}
            label={"Повторити пароль"}
            labelStyle={{marginBottom:4, color:"#4d4c4c"}}
            inputContainerStyle={[formStyle.inputTextContainer, !this.checkPasswords() && formStyle.inputTextContainerError]}
            value={repeatPassword}
            placeholder={("******")}
            placeholderTextColor={commonColor.placeholderTextColor}
            autoCapitalize="none"
            autoCorrect={false}
            secureTextEntry={hideRepeatPassword}
            keyboardType={'default'}
            returnKeyType={'done'}
            onSubmitEditing={() => Keyboard.dismiss()}
            renderErrorMessage={!this.checkPasswords()}
            errorMessage={!this.checkPasswords() ? I18n.t('authentication.passwordNotMatch') : null}
            errorStyle={formStyle.inputError}
            onChangeText={(text) => this.setState({ repeatPassword: text })}
          />
          {/* <OTPInput/>*/}
          <CheckBox
            containerStyle={[formStyle.checkboxContainer, style.checkboxContainer={display: 'flex'}]}
            textStyle={{backgroundColor: 'transparent'}}
            checked={eula}
            onPress={() => this.setState({ eula: !eula })}
            title={
              <Text style={formStyle.checkboxText}>
                {I18n.t('authentication.acceptEula')}
                <Text onPress={() => navigation.navigate('Eula')} style={style.eulaLink}>
                  {I18n.t('authentication.eula')}
                </Text>
              </Text>
            }
            uncheckedIcon={<InputIcon size={scale(25)} name="checkbox-blank-outline" as={MaterialCommunityIcons} />}
            checkedIcon={<InputIcon size={scale(25)} name="checkbox-outline" as={MaterialCommunityIcons} />}
          />
          <Button
            title={I18n.t('authentication.next')}
            titleStyle={formStyle.buttonTitle}
            // disabled={this.isFormValid()}
            disabledStyle={formStyle.buttonDisabled}
            disabledTitleStyle={formStyle.buttonTextDisabled}
            containerStyle={formStyle.buttonContainer={display: 'flex'}}
            buttonStyle={formStyle.button}
            loading={signingUp}
            loadingProps={{color: commonColor.light}}
            // onPress={() => this.setState({performSignUp: true, signingUp: true })}
            onPress={() => navigation.navigate('OTPScreen')}
          />
          </View>
          {!captcha && captchaSiteKey && captchaBaseUrl && performSignUp && (
            <ReactNativeRecaptchaV3
              action="RegisterUser"
              onHandleToken={(newCaptcha) => this.onCaptchaCreated(newCaptcha)}
              url={captchaBaseUrl}
              siteKey={captchaSiteKey}
            />
          )}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }

  private checkPasswords(): boolean {
    const { password, repeatPassword } = this.state;
    return !repeatPassword || repeatPassword === password;
  }

  private isFormValid(): boolean {
    const {email, password, eula, name, firstName, repeatPassword} = this.state;
    return !!name && !!firstName && !!email && !!password && !!repeatPassword && eula && this.checkPasswords() && Utils.validatePassword(password);
  }
}

const styles = StyleSheet.create({
  container: {

  },

  mainWrapper: {
    flex: 1,
    justifyContent: 'center',
    padding: scale(10),
  },
  mainTitle: {
    fontSize: scale(24),
    fontWeight: 'bold',
    marginBottom: scale(60),
    textAlign: 'center',
    color: '#212121'
  },
  })
