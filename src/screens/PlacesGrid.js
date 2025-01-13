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
import { getPlacesByState } from "../services/getStateENG"; // Fetch places for the state
import { imageMapping } from "../config/imageMapping"; // Import image mapping
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { HeartIcon } from "react-native-heroicons/solid";

const PlacesGrid = ({ route }) => {
  const { stateName } = route.params;
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getPlacesByState(stateName).then((placesData) => {
      // console.log("Fetched places data:", placesData);

      if (Array.isArray(placesData) && placesData.length > 0) {
        const transformedData = placesData.map((placeName) => ({
          "Name teerth": placeName,
          image: imageMapping[stateName]?.[placeName]?.[0] || null,
        }));

        // console.log("Transformed places data:", transformedData);

        const uniquePlacesMap = new Map();

        transformedData.forEach((place) => {
          const nameTeerth = place["Name teerth"];

          if (nameTeerth && !uniquePlacesMap.has(nameTeerth)) {
            uniquePlacesMap.set(nameTeerth, place);
          }
        });

        const uniquePlaces = Array.from(uniquePlacesMap.values());
        // console.log("Unique places after filtering duplicates:", uniquePlaces);
        setPlaces(uniquePlaces);
      } else {
        // console.log("No valid places data found for this state");
      }
    });
  }, [stateName]);

  const toggleFavorite = (placeName) => {
    setFavorites((prev) =>
      prev.includes(placeName)
        ? prev.filter((name) => name !== placeName)
        : [...prev, placeName]
    );
  };

  const renderPlaceCard = ({ item }) => (
    <TouchableOpacity
      style={styles.cardContainer}
      onPress={() =>
        navigation.navigate("PlaceDetails", { placeName: item["Name teerth"] })
      }
    >
      {item.image ? (
        <Image source={item.image} style={styles.cardImage} />
      ) : (
        <View style={styles.placeholderImage}>
          <Text style={styles.placeholderText}>Image not available</Text>
        </View>
      )}
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item["Name teerth"]}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item["Name teerth"])}>
          <HeartIcon
            size={24}
            color={favorites.includes(item["Name teerth"]) ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Sort places to display favorites at the top
  const sortedPlaces = places.sort((a, b) => {
    const isAFavorite = favorites.includes(a["Name teerth"]);
    const isBFavorite = favorites.includes(b["Name teerth"]);
    if (isAFavorite && !isBFavorite) {
      return -1; // Move favorites to the top
    }
    if (!isAFavorite && isBFavorite) {
      return 1; // Keep non-favorites below
    }
    return 0; // Keep the order unchanged if both are either favorite or non-favorite
  });

  return (
    <View style={styles.container}>
      <StatusBar style="dark" />
      <SafeAreaView style={styles.safeAreaView}>
        <Text style={styles.heading}>{stateName} Places</Text>
        <FlatList
          data={sortedPlaces}
          renderItem={renderPlaceCard}
          numColumns={2}
          keyExtractor={(item) => item["Name teerth"]}
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
    paddingHorizontal: wp(4),
  },
  safeAreaView: {
    flex: 1, // Allow SafeAreaView to take up the full height
  },
  heading: {
    fontSize: wp(6),
    fontWeight: "bold",
    textAlign: "center", // Keep the heading centered
    marginVertical: hp(2),
    color: "#343a40",
  },
  grid: {
    alignItems: "flex-start", // Align grid items to the start (left-aligned)
    justifyContent: "flex-start", // Ensure no space is wasted at the bottom
    paddingBottom: hp(2), // Add bottom padding for better visual spacing
  },
  flatList: {
    // flexGrow: 1, // Ensures the list grows to fill the available space
  },
  cardContainer: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    margin: wp(2),
    width: wp(42),
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
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
    flexDirection: "row", // Arrange title and heart icon horizontally
    justifyContent: "space-between", // Space out title and heart icon
    alignItems: "flex-start", // Ensure title is aligned properly
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
  },
  cardTitle: {
    fontSize: wp(4),
    fontWeight: "600",
    color: "#343a40",
    textAlign: "left", // Align text to the left
    flexWrap: "wrap", // Allow the title to wrap to the next line if it's too long
    flex: 1, // Allow the title to take remaining space
    marginRight: wp(2), // Provide some margin between the title and heart icon
    paddingBottom: hp(0.5), // Allow some padding at the bottom of the title to prevent overlap with the icon
  },
});

export default PlacesGrid;
