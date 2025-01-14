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
  const { stateName } = route.params; // Get the state name passed via route
  const [places, setPlaces] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    getPlacesByState(stateName).then((placesData) => {
      if (Array.isArray(placesData) && placesData.length > 0) {
        const transformedData = placesData.map((placeName) => {
          // Decode the place name to handle '%20' as a space
          const decodedPlaceName = decodeURIComponent(placeName);
          // Get the image for the decoded place name
          const placeImage =
            imageMapping[stateName]?.[decodedPlaceName]?.[0] || null;

          return {
            "Name teerth": decodedPlaceName,
            image: placeImage ? decodeURIComponent(placeImage) : null, // Decode the image URL if necessary
          };
        });

        const uniquePlacesMap = new Map();

        transformedData.forEach((place) => {
          const nameTeerth = place["Name teerth"];
          if (nameTeerth && !uniquePlacesMap.has(nameTeerth)) {
            uniquePlacesMap.set(nameTeerth, place);
          }
        });

        const uniquePlaces = Array.from(uniquePlacesMap.values());
        setPlaces(uniquePlaces);
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
        navigation.navigate("PlaceDetails", {
          placeName: item["Name teerth"],
          stateName: stateName, // Pass stateName along with placeName
        })
      }
    >
      {item.image ? (
        <Image source={{ uri: item.image }} style={styles.cardImage} />
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
        <Text style={styles.heading}>{stateName} Tirthkshetras</Text>
        <FlatList
          data={sortedPlaces}
          renderItem={renderPlaceCard}
          numColumns={2}
          keyExtractor={(item) => item["Name teerth"]}
          contentContainerStyle={styles.grid}
          style={styles.flatList}
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
    flex: 1,
  },
  heading: {
    fontSize: wp(6),
    fontWeight: "bold",
    textAlign: "center",
    marginVertical: hp(2),
    color: "#343a40",
  },
  grid: {
    alignItems: "flex-start",
    justifyContent: "flex-start",
    paddingBottom: hp(2),
  },
  flatList: {
    flexGrow: 1,
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
    resizeMode: "cover",
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    paddingHorizontal: wp(2),
    paddingVertical: hp(1),
  },
  cardTitle: {
    fontSize: wp(4),
    fontWeight: "600",
    color: "#343a40",
    textAlign: "left",
    flexWrap: "wrap",
    flex: 1,
    marginRight: wp(2),
    paddingBottom: hp(0.5),
  },
});

export default PlacesGrid;
