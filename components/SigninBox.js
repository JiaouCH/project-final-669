import { signIn } from "../AuthManager";
import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { Button } from '@rneui/themed';

/*
References:
- Benjamin Mullins
- 11/24/2024
- Lecture 10 notes Authentication with Firebase, Integration with Firestore & Redux
- Lecture 10 notes
- https://www.dropbox.com/scl/fi/jnpxmkihzhl41bdjixoor/10.-Authentication-with-Firebase%2C-Integration-with-Firestore-%26-Redux.paper?dl=0&rlkey=exv3x13sfhgc49s40iomugatu&st=pdgppv32

- Benjamin Mullins
- 11/24/2024
- Lecture 10 preclass github code
- https://github.com/UMSI579/nov-7-who-the-heck-knows/blob/4-security-measures/features/authSlice.js
*/
function SigninBox({ navigation }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
  
    return (
      <View style={styles.loginContainer}>
        <Image source={require('../assets/logo.png')} style={styles.logo} />
        <Text style={styles.loginHeaderText}>Pet Management</Text>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Email: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput
              style={styles.loginInputBox}
              placeholder='enter email address'
              autoCapitalize='none'
              spellCheck={false}
              onChangeText={text => setEmail(text)}
              value={email}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <View style={styles.loginLabelContainer}>
            <Text style={styles.loginLabelText}>Password: </Text>
          </View>
          <View style={styles.loginInputContainer}>
            <TextInput
              style={styles.loginInputBox}
              placeholder='enter password'
              autoCapitalize='none'
              spellCheck={false}
              secureTextEntry={true}
              onChangeText={text => setPassword(text)}
              value={password}
            />
          </View>
        </View>
        <View style={styles.loginRow}>
          <Button
            onPress={async () => {
              try {
                await signIn(email, password);
              } catch (error) {
                Alert.alert("Sign In Error", error.message, [{ text: "OK" }])
              }
            }}
            buttonStyle={{
              backgroundColor: '#51A39D', 
              padding: 10,            
              borderRadius: 8,     
            }}
          >
            Login
          </Button>
        </View>
      </View>
    );
  }

export default SigninBox;

const styles = StyleSheet.create({
    loginContainer: {
      flex: 1,
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      paddingTop: '30%',
      paddingBottom: '10%',
    },
    loginHeader: {
      width: '100%',
      padding: '3%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    loginHeaderText: {
      fontSize: 24,
      color: 'black',
      paddingBottom: '5%',
      fontFamily: 'gilroy-bold'
    },
    loginRow: {
      flexDirection: 'row',
      justifyContent: 'flex-start',
      alignItems: 'center',
      width: '100%',
      padding: '3%'
    },
    loginLabelContainer: {
      flex: 0.3,
      justifyContent: 'center',
      alignItems: 'flex-end'
    },
    loginLabelText: {
      fontSize: 18
    },
    loginInputContainer: {
      flex: 0.5,
      justifyContent: 'center',
      alignItems: 'flex-start',
      width: '100%'
    },
    loginInputBox: {
      width: '100%',
      borderColor: 'lightgray',
      borderWidth: 1,
      borderRadius: 6,
      fontSize: 18,
      padding: '2%'
    },
    logo: {
        width: 100,
        height: 100,
      },
  });