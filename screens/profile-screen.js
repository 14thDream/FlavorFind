import { useState, useEffect, useMemo, useContext } from "react";
import {
  StyleSheet,
  View,
  ScrollView,
  Text,
  TouchableOpacity,
  Image,
  Alert,
} from "react-native";
import { onValue, get, child, ref } from "firebase/database";
import { db } from "../firebaseConfig";
import RecipeFeed from "../components/RecipeFeed";
import { useNavigation } from "@react-navigation/native";
import SearchHeader from "../components/SearchHeader.js"; 
import { spacing, colors, fonts } from "../styles";
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

const ProfileScreen = () => {
  const DefaultProfileURL = "https://res.cloudinary.com/djrpuf5yu/image/upload/v1746711602/28-05_uaqupm.jpg";
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRecipeId, setSelectedRecipeId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [viewMode, setViewMode] = useState("my"); // "my" or "all"


  const [userId] = useContext(UserContext); // ✅ This gives you the current user's UID
  const navigator = useNavigation();

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const snapshot = await get(child(ref(db), `users/${userId}`));
        if (snapshot.exists()) {
          const data = snapshot.val();
          setUsername(data.username);
          setEmail(data.email);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      }
    };

    fetchUserDetails();
  }, [userId]);
  


  useEffect(() => {
    const listener = onValue(ref(db, "posts"), (snapshot) => {
      const data = snapshot.val();
      setPosts(data ? Object.values(data) : []);
    });
  
    return () => listener();
    }, []);
  

    
  const visiblePosts = useMemo(() => {
    const filtered = viewMode === "my" ? posts.filter((post) => post.userId === userId) : posts;
    return filtered.filter(({ title }) => isSearchableBy(title, searchQuery));
  }, [posts, searchQuery, viewMode, userId]);



  return (
    <View style={styles.container}>
      <SearchHeader size={24} color="black" onChangeText={setSearchQuery} />
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image source={{ uri: DefaultProfileURL }} style={styles.profileImage} />
          <Text style={styles.username}>@{username || "Loading..."}</Text>
          <Text style={styles.email}>{email || "Loading..."}</Text>

          <TouchableOpacity onPress={() => navigator.navigate("Login")} style={styles.signOutButton}>
            <Text style={styles.signOutText}>Sign Out</Text>
          </TouchableOpacity>
        </View>




        <View style={styles.buttonBarContainer}>
          <TouchableOpacity style={styles.containerButtons} onPress={() => setViewMode("my")}>
            <Text style={styles.signOutText}>MY RECIPES</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.containerButtons} onPress={() => setViewMode("all")}>
            <Text style={styles.signOutText}>FAVORITES</Text>
          </TouchableOpacity>
        </View>



        {/* Recipe Feed */}
        <View style={styles.container3}>
          {selectedRecipeId === null ? (
            <RecipeFeed
              data={visiblePosts}
              onPress={setSelectedRecipeId}
              itemStyle={styles.feed} // Add spacing between recipes
            />
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
    backgroundColor: "#FFD966", 
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
  container3: {
    width: "100%",
    marginBottom: 20,
    paddingHorizontal: 10, // Optional, for inner spacing if needed
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
  containerButtons: {
    backgroundColor: "#D9D9D9",
    paddingVertical: 10,
    paddingHorizontal: 35,
    borderRadius: 10,
  },
  signOutText: {
    fontSize: 16,
    fontFamily: fonts?.body || "System",
  },
  feed: {
    marginBottom: 10, //spacing for each recipe
  },
});

export default ProfileScreen;
