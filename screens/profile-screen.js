import { useState, useEffect, useMemo } from "react";
import { StyleSheet, View, ScrollView, Text, TouchableOpacity, Image, Alert } from "react-native";
import { onValue } from "firebase/database";
import { ref, db } from "../firebaseConfig";
import RecipeFeed from "../components/RecipeFeed";

import { spacing, colors, fonts } from "../styles";
import {  get, child } from "firebase/database";


import { useContext } from "react";
import { UserContext } from "../Contexts";


const containsKeyword = (title, keyword) => {
  return title
    .toLowerCase()
    .split(" ")
    .some((word) => word.startsWith(keyword));
};

const isSearchableBy = (title, keywords) => {
  return keywords
    .toLowerCase()
    .split(" ")
    .every((keyword) => containsKeyword(title, keyword));
};

const getDetails = () => {
  const [userId] = useContext(UserContext);
  const [username, setUsername] = useState('');


  get(child(ref(db), `users/${userId}`)).then((snapshot) => {
    if(snapshot.exists()){
      setUsername(snapshot.val().username);
    }
  })
  Alert.alert("Used the Debug Button! Username is:" + username);
};
    


const ProfileScreen = () => {
  const DefaultProfileURL ="https://res.cloudinary.com/djrpuf5yu/image/upload/v1746711602/28-05_uaqupm.jpg";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [posts, setPosts] = useState([]);


  

  const visiblePosts = useMemo(() => {
    return posts.filter(({ title }) => isSearchableBy(title, searchQuery));
  }, [posts, searchQuery]);

  useEffect(() => {
    const listener = onValue(ref(db, "posts"), (snapshot) => {
      const posts = Object.values(snapshot.val());
      setPosts(posts);
    });


    return () => listener();
  }, []);

  const debugDetails = () => {
    Alert.alert("Used the Debug Button! Username is: " + username);
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: DefaultProfileURL }} style={styles.profileImage} />
          <Text style={styles.username}>@CaoBreaded</Text>
          <Text style={styles.email}>caobreaded@gmail.com</Text>
          
          
          <TouchableOpacity onPress={debugDetails} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
          

        </View>

        <View style={styles.buttonBarContainer}>
          <TouchableOpacity style={styles.containerButtons}>
            <Text style={styles.signOutText}>MY RECIPES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.containerButtons}>
            <Text style={styles.signOutText}>FAVORITES</Text>
          </TouchableOpacity>
        </View>

        {/* Recipe Feed */}


        <View style={styles.container3}>
          {selectedRecipeId === null ? (
            <RecipeFeed data={visiblePosts} onPress={setSelectedRecipeId} />
          ) : (
            <RecipeView
              editable
              id={selectedRecipeId}
              onClose={() => setSelectedRecipeId(null)}
            />
          )}
        </View>


        
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFD966", // yellow background
  },
  scrollContainer: {
    alignItems: "center",
    paddingVertical: 15,
  },
  profileCard: {
    backgroundColor: "white",
    width: "95%",
    borderRadius: 20,
    alignItems: "center",
    paddingVertical: 30,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  buttonBarContainer: {
    backgroundColor: "white",
    width: "95%",
    borderRadius: 20,
    flexDirection: "row", // This makes the buttons align horizontally
    justifyContent: "space-between", // This distributes space between buttons
    alignItems: "center", // This centers the buttons vertically
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 10,
  },
  container2: {
    width: "95%",  // Make this the same as the profile card
    marginBottom: 20,
  },
  container3: {
    width: "100%",  // Make this the same as the profile card
    marginBottom: 20,
  },
  profileImage: {
    width: 165,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    marginBottom: 16,
  },
  username: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 4,
    fontFamily: fonts.primary,
  },
  email: {
    fontSize: 14,
    color: "gray",
    marginBottom: 20,
    fontFamily: fonts.primary,
  },
  signOutButton: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 10,
    paddingHorizontal: 100,
    borderRadius: 10,
  },
  containerButtons:{
      backgroundColor: "#D9D9D9",
      paddingVertical: 10,
      paddingHorizontal: 35,
      borderRadius: 10,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: fonts?.body || "System",
  },
});

export default ProfileScreen;