import React, { useState } from 'react';
import { View, Button, Image, Text } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Platform } from 'react-native';

export default function App() {
  const [image, setImage] = useState(null);
  const [status, setStatus] = useState(null);

  // Function to handle image picking
  const pickImage = async () => {
    let permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permissionResult.granted === false) {
      alert('Permission to access media library is required!');
      return;
    }
  
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
  
    if (result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
   

  };
  

  // Function to upload the image (example with a dummy API)
  const uploadImage = async () => {
    if (!image) {
      alert('Please select an image first');
      return;
    }
  
    const data = new FormData();
    data.append('file', {
      uri: image,
      type: 'image/jpeg',
      name: 'upload.jpg',
    });
    data.append('upload_preset', 'Flavorfind'); // Your preset name
    data.append('cloud_name', 'djrpuf5yu');     // Your Cloudinary cloud name
  
    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/djrpuf5yu/image/upload', {
        method: 'POST',
        body: data,
      });
  
      const result = await res.json();
      console.log("Uploaded link: "+result.secure_url);
      console.log('Uploaded image URL:', result.secure_url);
      setStatus('Upload Successful!');
    } catch (err) {
      console.error('Upload failed:', err);
      setStatus('Upload Failed');
    }
  };
  


  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Button title="Pick an image from gallery" onPress={pickImage} />
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
      <Button title="Upload Image" onPress={uploadImage} />
      {status && <Text>{status}</Text>}
    </View>
  );
}
