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
import { getPlacesByState } from "../services/placesService"; // Ensure this function is updated to provide image paths
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { HeartIcon } from "react-native-heroicons/solid";

// Your imageMapping object should be imported here
import { imageMapping } from "../config/imageMapping"; // Adjust the import based on where your imageMapping is located

const PlacesGrid = ({ route }) => {
  const { stateName } = route.params;
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    // Fetch places and images based on stateName
    getPlacesByState(stateName).then((placesData) => {
      // console.log(placesData);
      const updatedPlaces = placesData.map((place) => {
        const images = imageMapping[stateName]?.[place.name] || []; // Default to empty if no images
        return {
          ...place,
          image: images[0] || null, // Use the first image from the mapping
        };
      });
      setPlaces(updatedPlaces);
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
        navigation.navigate("PlaceDetails", { placeName: item.name })
      }
    >
      <Image source={item.image} style={styles.cardImage} />
      <View style={styles.cardContent}>
        <Text style={styles.cardTitle}>{item.name}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.name)}>
          <HeartIcon
            size={24}
            color={favorites.includes(item.name) ? "red" : "gray"}
          />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  // Sort places to display favorites at the top
  const sortedPlaces = places.sort((a, b) => {
    const isAFavorite = favorites.includes(a.name);
    const isBFavorite = favorites.includes(b.name);
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
      <SafeAreaView>
        <Text style={styles.heading}>{stateName} Places</Text>
        <FlatList
          data={sortedPlaces}
          renderItem={renderPlaceCard}
          numColumns={2}
          keyExtractor={(item) => item.id.toString()} // Ensure unique IDs for each item
          contentContainerStyle={styles.grid}
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
  heading: {
    fontSize: wp(6),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: hp(2),
    color: "#343a40",
  },
  grid: {
    alignItems: "center",
    justifyContent: "center",
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
    width: "100%",
    height: hp(20),
    resizeMode: "cover", // Changed to 'cover' to make the image fill the container
  },
  cardContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: wp(3),
  },
  cardTitle: {
    fontSize: wp(4.5),
    fontWeight: "600",
    color: "#343a40",
  },
});

export default PlacesGrid;
