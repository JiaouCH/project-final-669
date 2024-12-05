import { signIn, signOut, signUp, subscribeToAuthChanges } from "../AuthManager";
import { useState, useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Alert, Image } from 'react-native';
import { Button } from '@rneui/themed';
import { useDispatch } from 'react-redux';
import { addUser } from "../features/petSlice";
import SigninBox from "../components/SigninBox";
import SignupBox from "../components/SignupBox";

function LoginScreen({ navigation }) {
  const [loginMode, setLoginMode] = useState(true);
  useEffect(() => {
    subscribeToAuthChanges(navigation);
  }, []);
  return (
    <View style={styles.container}>
      <View style={styles.bodyContainer}>
        {loginMode ?
          <SigninBox navigation={navigation} />
          :
          <SignupBox navigation={navigation} />
        }
      </View>
      <View style={styles.modeSwitchContainer}>
        {loginMode ?
          <Text>New user?
            <Text
              onPress={() => { setLoginMode(!loginMode) }}
              style={{ color: 'blue' }}> Sign up </Text>
            instead!
          </Text>
          :
          <Text>Returning user?
            <Text
              onPress={() => { setLoginMode(!loginMode) }}
              style={{ color: 'blue' }}> Sign in </Text>
            instead!
          </Text>
        }
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f6c2c2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bodyContainer: {
    flex: 0.5,
    justifyContent: 'center',
    alignItems: 'center',
  },
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
    paddingBottom: '5%'
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
  modeSwitchContainer: {
    flex: 0.2,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  loginButtonRow: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center'
  },
  listContainer: {
    flex: 0.7,
    backgroundColor: '#ccc',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  logo: {
    width: 100,
    height: 100,
  }
});

export default LoginScreen;