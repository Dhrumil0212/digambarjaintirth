import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  FlatList,
  StyleSheet,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useNavigation } from "@react-navigation/native";
import { getStates } from "../services/getStateENG"; // Fetch state data
import { imageMapping } from "../config/imageMapping"; // Import image mapping
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const StatesGrid = () => {
  const [states, setStates] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getStates().then((statesData) => {
      const sortedStates = statesData.sort((a, b) =>
        a.name.localeCompare(b.name)
      );

      const updatedStates = sortedStates.map((state) => ({
        ...state,
        image: imageMapping[state.name]?.image || null, // Get image URL from mapping
      }));

      setStates(updatedStates);
    });
  }, []);

  const renderStateCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("PlacesGrid", { stateName: item.name })
      }
    >
      {/* Display the image or a placeholder */}
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Image not available</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.heading}>Bharat</Text>
        <FlatList
          data={states} // Use the sorted states state
          renderItem={renderStateCard}
          numColumns={2} // Display states in a grid format with 2 columns
          keyExtractor={(item) => item.name}
          contentContainerStyle={styles.grid}
          style={styles.flatList} // Added to ensure proper height of the list
        />
      </SafeAreaView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    justifyContent: "flex-start", // Ensure content is at the top
    paddingHorizontal: wp(4),
  },
  safeAreaView: {
    flex: 1, // Allow SafeAreaView to take up the full height
  },
  heading: {
    fontSize: wp(6),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: hp(2),
    color: "#343a40",
  },
  grid: {
    alignItems: "center",
    justifyContent: "flex-start", // Ensure no space is wasted at the bottom
    paddingBottom: hp(2), // Add bottom padding for better visual spacing
  },
  flatList: {
    flexGrow: 1, // Ensures the list grows to fill the available space
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    margin: wp(2),
    width: wp(42),
    height: hp(27), // Slightly adjusted height for the card to accommodate bigger images
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
    marginBottom: hp(2), // Ensure there is space for the last tile's title
    paddingBottom: hp(2), // Ensures space for the title
    justifyContent: "space-between", // Ensure space for image and title
  },
  cardImage: {
    width: "100%", // Fill the card width
    height: hp(20), // Increased image height for a bigger display
    resizeMode: "cover", // Maintain aspect ratio and cover the space
  },
  placeholderImage: {
    width: "100%",
    height: hp(20),
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#e9ecef",
  },
  placeholderText: {
    color: "#6c757d",
    fontSize: wp(4),
  },
  cardContent: {
    flexDirection: "column", // Stack image and title vertically
    justifyContent: "center", // Center title below the image
    alignItems: "center",
    padding: wp(2),
  },
  cardTitle: {
    fontSize: wp(4.5),
    fontWeight: "600",
    color: "#343a40",
    textAlign: "center", // Ensure text is centered inside the card
    flexWrap: "wrap", // Allow the title to wrap to the next line if it's too long
  },
});

export default StatesGrid;
