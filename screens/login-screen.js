import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert, StyleSheet } from 'react-native';
import { db, ref, set } from '../firebaseConfig';
import { get, child } from 'firebase/database';
import { getId } from 'firebase/installations';


const LoginScreen = () => { 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');




return(

    

    <View style={styles.container}>
        <Text style={styles.head_text}>Hello Every Meow You're at the Login Screen Right Now.</Text>
    </View>

    

)};





  const checkIfEmailExisting = async (email) => {
  try{
  const snapshot = await get(child(ref(db), 'users'));
    if(snapshot.exists()) {
    const users = snapshot.val(); // Get all users from the snapshot 
    const emailExists = Object.values(users).some(user => user.email === email); // Check if any user has the same email
    if(emailExists) {
      return true;
    } else {
      return false;
      }
    }
  } catch (error) {
      console.error('Error checking email: ', error);
      Alert.alert('Error', 'Failed to check email');
    }
  };




  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      padding: 20,
      backgroundColor: '#f5f5f5',
      justifyContent: 'center',
      alightItems: 'center',

    },
    label: {
      fontSize: 18,
      fontWeight: 'bold',
      marginBottom: 10,
    },
    head_text: {
      fontSize: 24,
      fontWeight: 'bold',
      marginBottom: 20,
      textAlign: 'center',
      color: 'red',
    },
    input: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      padding: 10,
      backgroundColor: '#fff',
      marginBottom: 20,
    },
  });
  
  
export default LoginScreen;


