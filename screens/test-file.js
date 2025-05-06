import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Image, TouchableOpacity, ScrollView, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { get, child } from "firebase/database";
import { getDatabase, ref, set, push } from 'firebase/database'; // Firebase imports

const TestFile = () => {
  const [id, setId] = useState("");
  const [image, setImage] = useState("");
  const [status, setStatus] = useState("");
  const [description, setDescription] = useState("");
  const [ingredients, setIngredients] = useState([{ name: '', amount: '', unit: '' }]); // Store ingredients as an array with name, amount, and unit
  const [steps, setSteps] = useState(['']);
  const [title, setTitle] = useState("");
  const db = getDatabase(); // Firebase database reference




  // Function to handle image selection
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

  // Function to upload image to Cloudinary and return the URL
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
    data.append('upload_preset', 'Flavorfind');
    data.append('cloud_name', 'djrpuf5yu');

    try {
      const res = await fetch('https://api.cloudinary.com/v1_1/djrpuf5yu/image/upload', {
        method: 'POST',
        body: data,
      });
      const result = await res.json();

      if (result.secure_url) {
        Alert.alert("Upload Successful!");
        setImage(result.secure_url); // Update image URI with the URL returned from Cloudinary
        return result.secure_url; // Return the Cloudinary URL for later use
      } else {
        throw new Error('No secure URL in response');
      }
    } catch (err) {
      console.error('Upload failed:', err);
      setStatus('Upload Failed');
      return null;
    }
  };

  // Function to handle adding a new ingredient
  const addIngredient = () => {
    setIngredients([...ingredients, { name: '', amount: '', unit: '' }]);
  };

  // Function to handle input change for ingredients
  const handleIngredientChange = (index, field, value) => {
    const updatedIngredients = [...ingredients];
    updatedIngredients[index][field] = value;
    setIngredients(updatedIngredients);
  };

  const handleStepChange = (index, value) => {
    const updatedSteps = [...steps];
    updatedSteps[index] = value;
    setSteps(updatedSteps);
  };
  
  // Function to add a new step
  const addStep = () => {
    setSteps([...steps, '']);
  };


  
  const getIdCount = async () => {
    try {
      const snapshot = await get(child(ref(db), "posts"));
      if (snapshot.exists()) {
        const posts = snapshot.val();
        let nextId = Object.keys(posts).length + 1; // Start with post count + 1
        // Keep incrementing if ID already exists
        while (await checkIfExisting(nextId.toString())) {
          nextId += 1;
        }
        return nextId;
      } else {
        return 1;
      }
    } catch (error) {
      console.error("Error fetching user count: ", error);
      Alert.alert("Error", "Failed to fetch user count");
      return null;
    }
  };

  const checkIfExisting = async (id) => {
    if (!id) return false;
    const snapshot = await get(child(ref(db), `posts/${id}`));
    if (snapshot.exists()) return true;
    return false;
  };


  // Function to handle submitting the recipe
 // Function to handle submitting the recipe
 const submitRecipe = async () => {
    console.log("Submit Recipe function started.");
  
    // Get the next available ID
    const nextId = await getIdCount();
    console.log("Next ID:", nextId); // Log the ID fetched

    if (!nextId) {
      Alert.alert("Error", "Failed to fetch the next ID");
      return;
    }

    // Check if any required fields are empty
    if (!title.trim() || !description.trim() || steps.some(step => !step.trim()) || !image || ingredients.some(ingredient => !ingredient.name || !ingredient.amount || !ingredient.unit)) {
      console.log("Validation failed! Fields missing:");

      if (!title.trim()) console.log("Title is empty.");
      if (!description.trim()) console.log("Description is empty.");
      if (steps.some(step => !step.trim())) console.log("Steps are empty.");
      if (!image) console.log("Image is missing.");

      ingredients.forEach((ingredient, index) => {
        if (!ingredient.name || !ingredient.amount || !ingredient.unit) {
          console.log(`Ingredient at index ${index} is incomplete:`, ingredient);
        }
      });

      Alert.alert("Error", "Please fill in all fields, including all ingredients.");
      return;
    }

    try {
      // Upload image to Cloudinary and get the image URL
      console.log("Uploading image...");
      const imageUrl = await uploadImage();

      if (imageUrl) {
        console.log("Image URL from Cloudinary:", imageUrl);

        // Prepare the recipe object with all fields, including the image URL
        const recipe = {
          id: nextId.toString(), // Convert nextId to string for the database key
          title,
          description,
          ingredients,
          steps,
          image: imageUrl, // Include the image URL from Cloudinary
        };

        console.log("Recipe Data to Firebase:", recipe); // Log the recipe data before adding to Firebase

        // Add the recipe to Firebase Realtime Database
        await set(ref(db, 'posts/' + nextId), recipe);

        Alert.alert("Success", "Recipe added successfully!");

        // Reset input fields
        setTitle('');
        setDescription('');
        setIngredients([{ name: '', amount: '', unit: '' }]);
        setSteps(['']);
        setImage('');
      } else {
        console.log("No image URL received from Cloudinary.");
        Alert.alert("Error", "Failed to upload image");
      }
    } catch (error) {
      console.error("Error adding recipe:", error);
      Alert.alert("Error", "Failed to add recipe");
    }
  };


  
  
  
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={styles.head_text}>ADD RECIPE</Text>

        <Text style={styles.label}>Title</Text>
        <TextInput
          style={styles.input}
          placeholder="Add Title"
          value={title}
          onChangeText={setTitle}
        />

        <Text style={styles.label}>Description</Text>
        <TextInput
          style={styles.input}
          placeholder="Add Description"
          value={description}
          onChangeText={setDescription}
        />

        <Text style={styles.label}>Ingredients</Text>
        {ingredients.map((ingredient, index) => (
          <View key={index} style={styles.ingredientContainer}>
            <TextInput
              style={styles.ingredientInput}
              placeholder="Ingredient Name"
              value={ingredient.name}
              onChangeText={(value) => handleIngredientChange(index, 'name', value)}
            />
            <TextInput
              style={styles.ingredientInput}
              placeholder="Amount"
              value={ingredient.amount}
              onChangeText={(value) => handleIngredientChange(index, 'amount', value)}
            />
            <TextInput
              style={styles.ingredientInput}
              placeholder="Unit"
              value={ingredient.unit}
              onChangeText={(value) => handleIngredientChange(index, 'unit', value)}
            />
          </View>
        ))}
        <TouchableOpacity onPress={addIngredient} style={styles.addIngredientButton}>
          <Text style={styles.addIngredientButtonText}>Add Ingredient</Text>
        </TouchableOpacity>

        <Text style={styles.label}>Steps</Text>
{steps.map((step, index) => (
  <TextInput
    key={index}
    style={styles.input}
    placeholder={`Step ${index + 1}`}
    value={step}
    onChangeText={(value) => handleStepChange(index, value)}
  />
))}
<TouchableOpacity onPress={addStep} style={styles.addIngredientButton}>
  <Text style={styles.addIngredientButtonText}>Add Step</Text>
</TouchableOpacity>


        <TouchableOpacity style={styles.signIn} onPress={pickImage}>
          <Text style={styles.signInText}>Select Recipe Image From Gallery</Text>
        </TouchableOpacity>

        {image && (
          <TouchableOpacity onPress={pickImage}>
            <Image source={{ uri: image }} style={styles.imagePreview} />
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.upload} onPress={submitRecipe}>
          <Text style={styles.signInText}>Submit Recipe</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  label: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  head_text: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "red",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    backgroundColor: "#fff",
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  ingredientContainer: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  ingredientInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 12,
    fontSize: 15,
    padding: 12,
    backgroundColor: "#fff",
    marginRight: 10,
  },
  addIngredientButton: {
    height: 40,
    backgroundColor: "#FFDB64",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 12,
  },
  addIngredientButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  signIn: {
    height: 50,
    backgroundColor: "#FFDB64",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 12,
    marginTop: 10,
  },
  upload: {
    height: 50,
    backgroundColor: "#FFDB64",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    marginBottom: 50,
    borderRadius: 12,
  },
  signInText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#000",
  },
  imagePreview: {
    width: '100%',
    height: 200,
    alignSelf: 'center',
    marginTop: 20,
    borderRadius: 12,
    resizeMode: 'cover',
  },
});

export default TestFile;
