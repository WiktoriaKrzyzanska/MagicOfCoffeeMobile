import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Dimensions, ScrollView } from 'react-native';
import React, { useState } from 'react';
import { Shadow } from 'react-native-shadow-2';
import LottieView from 'lottie-react-native';
import axios from 'axios';
import BouncyCheckbox from 'react-native-bouncy-checkbox';

const { height: screenHeight } = Dimensions.get('window');

export default function SignUpScreen() {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [showThankYou, setShowThankYou] = useState(false);
  const [showErrorModal, setShowErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [phoneError, setPhoneError] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [name, setName] = useState('');
  const [nameError, setNameError] = useState('');
  const [lastName, setLastName] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [termsError, setTermsError] = useState('');

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  const handleSignUp = async () => {
    let hasError = false;

    if (!termsAccepted) {
      setTermsError('Please accept the terms and conditions to proceed.');
      hasError = true;
    } else {
      setTermsError('');
    }

    if (!name) {
      setNameError('First name is required.');
      hasError = true;
    } else {
      setNameError('');
    }

    if (!lastName) {
      setLastNameError('Last name is required.');
      hasError = true;
    } else {
      setLastNameError('');
    }

    if (!email) {
      setEmailError('Email is required.');
      hasError = true;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      hasError = true;
    } else {
      setEmailError('');
    }

    if (!phoneNumber) {
      setPhoneError('Phone number is required.');
      hasError = true;
    } else if (!/^[0-9]{9,15}$/.test(phoneNumber)) {
      setPhoneError('Please enter a valid phone number.');
      hasError = true;
    } else {
      setPhoneError('');
    }

    if (!password) {
      setPasswordError('Password is required.');
      hasError = true;
    } else if (password.length < 8) {
      setPasswordError('Password must be at least 8 characters long.');
      hasError = true;
    } else if (password !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      hasError = true;
    } else {
      setPasswordError('');
    }

    if (hasError) {
      setErrorMessage('Please correct the highlighted errors and try again.');
      setShowErrorModal(true);
      return;
    }

    try {
        const response = await axios.post('http://xxx.xxx.xxx.xxx:8082/auth/signup', {
          email,
          password,
          firstName: name,
          lastName,
          phoneNumber,
        });
        console.log('Signup success:', response.data);
        setShowThankYou(true);
      } catch (error) {
        console.error('Signup failed:', error);
        if (axios.isAxiosError(error) && error.response) {
          setErrorMessage(`ERROR ${error.response.status}: ${error.response.data.message || 'An error occurred during signup. Please try again later.'}`);
        } else {
          setErrorMessage('An unexpected error occurred. Please try again later.');
        }
        setShowErrorModal(true);
      }
    };

  return (
    <ScrollView contentContainerStyle={styles.scrollContainer}>
      <View style={styles.container}>
        <View style={styles.headerContainerWithShadow}>
          <Shadow distance={5} startColor={'#00000010'} endColor={'#00000000'} offset={[0, 2]}>
            <Image source={require('../assets/images/signup_image.png')} style={styles.headerImage} />
          </Shadow>
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>First Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Jan"
            placeholderTextColor="#999"
            value={name}
            onChangeText={setName}
          />
          {nameError ? <Text style={styles.errorText}>{nameError}</Text> : null}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Last Name</Text>
          <TextInput
            style={styles.input}
            placeholder="Kowalski"
            placeholderTextColor="#999"
            value={lastName}
            onChangeText={setLastName}
          />
          {lastNameError ? <Text style={styles.errorText}>{lastNameError}</Text> : null}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Email address</Text>
          <TextInput
            style={styles.input}
            placeholder="jannok@example.com"
            keyboardType="email-address"
            placeholderTextColor="#999"
            value={email}
            onChangeText={setEmail}
          />
          {emailError ? <Text style={styles.errorText}>{emailError}</Text> : null}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Phone Number</Text>
          <TextInput
            style={styles.input}
            placeholder="123456789"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
            value={phoneNumber}
            onChangeText={setPhoneNumber}
          />
          {phoneError ? <Text style={styles.errorText}>{phoneError}</Text> : null}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Password</Text>
          <View style={styles.passwordContainer}>
            <TextInput
              style={[styles.input, styles.passwordInput]}
              placeholder="********"
              secureTextEntry={!passwordVisible}
              placeholderTextColor="#999"
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity style={styles.eyeIconContainer} onPress={togglePasswordVisibility}>
              <Text>{passwordVisible ? '🙈' : '👁️'}</Text>
            </TouchableOpacity>
          </View>
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>
        <View style={styles.inputContainer}>
          <Text style={styles.inputLabel}>Confirm Password</Text>
          <TextInput
            style={styles.input}
            placeholder="********"
            secureTextEntry={!passwordVisible}
            placeholderTextColor="#999"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
          />
          {passwordError ? <Text style={styles.errorText}>{passwordError}</Text> : null}
        </View>
        <View style={styles.termsContainer}>
          <BouncyCheckbox
            isChecked={termsAccepted}
            onPress={() => setTermsAccepted(!termsAccepted)}
            text="I agree to the Terms and Conditions"
            textStyle={{
              textDecorationLine: 'none',
              color: termsError ? 'red' : '#333', 
            }}
            fillColor="#FFA500"
          />
          {termsError ? <Text style={styles.errorText}>{termsError}</Text> : null}
          {!termsAccepted && !termsError ? (
            <Text style={styles.agreeToProceedText}>You need to agree to proceed.</Text>
          ) : null}
        </View>
        <TouchableOpacity style={styles.signUpButton} onPress={handleSignUp} disabled={!termsAccepted}>
          <Text style={styles.signUpButtonText}>Sign up</Text>
        </TouchableOpacity>
        <Text style={styles.orText}>Or</Text>
        <TouchableOpacity style={styles.facebookButton}>
          <Text style={styles.facebookButtonText}>Sign up with Facebook</Text>
        </TouchableOpacity>
        <Text style={styles.loginText}>
          Already have an account? <Text style={styles.loginLink}>Log in</Text>
        </Text>
        {showThankYou && (
          <View style={styles.thankYouModal}>
            <View style={styles.thankYouContent}>
              <LottieView
                source={require('../assets/animations/coffee_pour.json')}
                autoPlay
                loop={true}
                style={styles.coffeeAnimation}
              />
              <Text style={styles.thankYouTitle}>Thank You</Text>
              <Text style={styles.thankYouMessage}>
                Your message has been received and we will be contacting you shortly to follow up. If you would like to speak to someone immediately, feel free to call.
              </Text>
              <View style={styles.socialIconsContainer}>
                <Image source={require('../assets/images/facebook.png')} style={styles.socialIcon} />
                <Image source={require('../assets/images/twitter.png')} style={styles.socialIcon} />
                <Image source={require('../assets/images/linkedin.png')} style={styles.socialIcon} />
              </View>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowThankYou(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        {showErrorModal && (
          <View style={styles.thankYouModal}>
            <View style={styles.thankYouContent}>
              <LottieView
                source={require('../assets/animations/error.json')}
                autoPlay
                loop={true}
                style={styles.coffeeAnimation}
              />
              <Text style={styles.thankYouTitle}>Error</Text>
              <Text style={styles.thankYouMessage}>{errorMessage}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={() => setShowErrorModal(false)}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#ffffff',
    justifyContent: 'center',
  },
  headerContainerWithShadow: {
    width: '100%',
    height: screenHeight * 0.35,
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    alignItems: 'center',
    overflow: 'hidden',
    backgroundColor: '#c9ad92',
    marginBottom: 40,
  },
  headerImage: {
    width: 200,
    height: 200,
    resizeMode: 'cover',
    borderRadius: 10,
  },
  inputContainer: {
    marginBottom: 25,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#cccccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  passwordInput: {
    flex: 1,
  },
  eyeIconContainer: {
    position: 'absolute',
    right: 10,
  },
  signUpButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  signUpButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  orText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
    marginBottom: 25,
    marginVertical: 10,
  },
  facebookButton: {
    backgroundColor: '#3b5998',
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 25,
  },
  facebookButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loginText: {
    textAlign: 'center',
    fontSize: 16,
    color: '#333',
  },
  loginLink: {
    color: '#FFA500',
    fontWeight: 'bold',
  },
  thankYouModal: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  thankYouContent: {
    width: 300,
    height: 450, 
    backgroundColor: '#ffffff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  thankYouTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  thankYouMessage: {
    fontSize: 16,
    color: '#333',
    textAlign: 'center',
    marginBottom: 20,
  },
  closeButton: {
    backgroundColor: '#FFA500',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  coffeeAnimation: {
    width: 100,
    height: 100,
  },
  socialIconsContainer: {
    flexDirection: 'row',
    marginTop: 20,
    marginBottom: 20,
  },
  socialIcon: {
    width: 30,
    height: 30,
    marginHorizontal: 10,
  },errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 5,
  },termsContainer: {
    marginVertical: 20,
  },  
  agreeToProceedText: {
    color: 'red',
    fontSize: 12,
    marginTop: 5,
  },
});