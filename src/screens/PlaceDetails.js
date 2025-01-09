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
import { getPlaceByName } from "../services/placesService";
import { imageMapping } from "../config/imageMapping"; // Importing image mapping
import { stateMapping } from "../config/stateMapping"; // Importing state mapping
import { styles } from "../styles/placeStyles"; // Importing styles
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

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

  // Recursive function to render fields and skip 'id' fields
  const renderFields = (data) => {
    return Object.keys(data).map((key) => {
      // Skip 'id' field
      if (key.toLowerCase() === "id") return null;
      if (key.toLowerCase() === "image") return null;
      if (key.toLowerCase() === "name") return null;
      if (key.toLowerCase() === "location") return null;

      const value = data[key];

      // If the value is an object or array, recursively render it
      if (typeof value === "object" && value !== null) {
        return (
          <View key={key} style={styles.section}>
            <Text style={styles.sectionTitle}>{key}:</Text>
            {Array.isArray(value)
              ? value.map((item, index) => (
                  <View key={index} style={styles.value}>
                    {typeof item === "object" ? (
                      renderFields(item)
                    ) : (
                      <Text>{item}</Text>
                    )}
                  </View>
                ))
              : renderFields(value)}
          </View>
        );
      }

      // If it's a simple value (string or number), render it inside a <Text> component
      return (
        <View key={key} style={styles.section}>
          <Text style={styles.sectionTitle}>{key}:</Text>
          <Text style={styles.value}>{value}</Text>
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
      <Text style={styles.heading}>{place.name}</Text>

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
        {renderFields(place)}

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
                title={place.name}
                description={place.address}
              />
            </MapView>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
};

// InfoSection Component for reusable text display
const InfoSection = ({ title, content }) => {
  return (
    content && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>{title}:</Text>
        <Text style={styles.value}>{content}</Text>
      </View>
    )
  );
};

export default PlaceDetails;
