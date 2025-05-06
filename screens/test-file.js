import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { TextInput, Button, Alert, StyleSheet } from "react-native";
import { db, ref, set } from "../firebaseConfig";
import { get, child } from "firebase/database";



const TestFile = () => {


  return (
    <View>
      <Text>Blank Template</Text>
    </View>
  );
};

export default TestFile;
