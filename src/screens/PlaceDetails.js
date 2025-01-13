import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  ScrollView,
  ActivityIndicator,
  Linking,
  TouchableOpacity,
  Platform,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getPlaceByName } from "../services/getStateENG"; // Import service to fetch place details
import { imageMapping } from "../config/imageMapping"; // Importing image mapping
import { styles } from "../styles/placeStyles"; // Importing styles
import { stateMapping } from "../config/stateMapping"; // Importing state mapping

import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import finalData from "../data/final.json"; // Import finalData from final.json

const PlaceDetails = ({ route }) => {
  const { placeName } = route.params;

  // Updated inferStateName to use stateMapping from the imported file
  const inferStateName = (place) => {
    return stateMapping[place] || "Unknown";
  };

  const stateName = route.params.stateName || inferStateName(placeName);
  const [place, setPlace] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    getPlaceByName(placeName)
      .then((placeData) => {
        setPlace(placeData);
        loadImages(stateName, placeName);
      })
      .catch(() => setPlace({ error: true }));
  }, [placeName, stateName]);

  const loadImages = (state, place) => {
    if (!state || !imageMapping[state]) return;

    const placeImages = imageMapping[state]?.[place];

    if (placeImages?.length > 0) {
      setImages(placeImages);
    }
  };

  // Function to render fields with translated keys and values for the given place
  const renderFields = (placeName) => {
    // Filter finalData for the place that matches the `placeName`
    const placeData = finalData.Sheet1.filter(
      (item) => item["Name teerth"] === placeName
    );

    if (placeData.length === 0) return null;

    // Create an object to track unique keys and values
    const uniqueFields = {};

    placeData.forEach((item) => {
      // Skip irrelevant fields
      if (
        item["Key"] === "Formatted Text" ||
        item["Key"] === "Original Value" ||
        item["Key"] === "Tirth" ||
        item["Key"] === "Name teerth" ||
        item["Key"] === "Naam" ||
        item["Key"] === "State" ||
        item["Key"] === "Rajya"
      ) {
        return;
      }

      // Use `Translated Key` as the unique identifier
      const key = item["Translated Key"] || item["Key"];
      const value = item["Translated Value"] || item["Original Value"];

      // Only add unique fields (filter duplicates)
      if (!uniqueFields[key]) {
        uniqueFields[key] = value;
      }
    });

    // Map over unique fields and render them
    return Object.keys(uniqueFields).map((key) => {
      return (
        <View key={key} style={styles.section}>
          <Text style={styles.sectionTitle}>{key}:</Text>
          <Text style={styles.textContent}>{uniqueFields[key]}</Text>
        </View>
      );
    });
  };

  // Function to handle opening the map in the native app
  const openMap = (latitude, longitude) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${latitude},${longitude}`,
      android: `geo:${latitude},${longitude}?q=${latitude},${longitude}`,
    });

    Linking.openURL(url).catch((err) =>
      console.error("Error opening map:", err)
    );
  };

  if (!place) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#343a40" />
        <Text style={styles.loadingText}>Loading place details...</Text>
      </View>
    );
  }

  if (place.error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>
          Failed to load place details. Please try again later.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.heading}>{place["Name teerth"]}</Text>

      {/* Image Slider */}
      <ScrollView horizontal style={styles.imageSlider}>
        {images.length > 0 ? (
          images.map((img, index) => (
            <Image key={index} source={img} style={styles.image} />
          ))
        ) : (
          <Text style={styles.noImageText}>No images available</Text>
        )}
      </ScrollView>

      {/* Info Container */}
      <View style={styles.infoContainer}>
        {renderFields(place["Name teerth"])}

        {/* Map View */}
        {place.location && (
          <TouchableOpacity
            style={styles.mapContainer}
            onPress={() =>
              openMap(place.location.latitude, place.location.longitude)
            }
          >
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: place.location.latitude,
                longitude: place.location.longitude,
                latitudeDelta: 0.05,
                longitudeDelta: 0.05,
              }}
            >
              <Marker
                coordinate={{
                  latitude: place.location.latitude,
                  longitude: place.location.longitude,
                }}
                title={place["Name teerth"]}
                description={place["Tirth"]}
              />
            </MapView>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

export default PlaceDetails;
