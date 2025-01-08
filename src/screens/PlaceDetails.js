import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import MapView, { Marker } from "react-native-maps";
import { getPlaceByName } from "../services/placesService"; // Assume you have this service
import { imageMapping } from "../config/imageMapping"; // Import image mapping
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

const PlaceDetails = ({ route }) => {
  const { placeName } = route.params;

  const inferStateName = (place) => {
    const stateMapping = {
      "Hawa Mahal": "Rajasthan",
      "Gateway of India": "Maharashtra",
      // Add other mappings as needed
    };
    return stateMapping[place] || "Unknown";
  };

  const stateName = route.params.stateName || inferStateName(placeName);

  const [place, setPlace] = useState(null);
  const [images, setImages] = useState([]);

  useEffect(() => {
    console.log("Route parameters:", route.params);
    console.log("Inferred stateName:", stateName);

    // Fetch place data (Assume this is a service to get place details)
    getPlaceByName(placeName)
      .then((placeData) => {
        setPlace(placeData);
        loadImages(stateName, placeName);
      })
      .catch(() => setPlace({ error: true }));
  }, [placeName, stateName]);

  const loadImages = (state, place) => {
    if (!state || !imageMapping[state]) {
      console.warn(`State is undefined or not found: ${state}`);
      return;
    }

    const placeImages = imageMapping[state]?.[place];
    if (placeImages?.length > 0) {
      setImages(placeImages);
    } else {
      console.warn(`No images found for ${state}/${place}`);
    }
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
      <ScrollView horizontal style={styles.imageSlider}>
        {images.length > 0 ? (
          images.map((img, index) => (
            <Image key={index} source={img} style={styles.image} />
          ))
        ) : (
          <Text style={styles.noImageText}>No images available</Text>
        )}
      </ScrollView>

      <View style={styles.infoContainer}>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{place.address}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Contact:</Text>
          <Text style={styles.value}>{place.contact}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Historical Info:</Text>
          <Text style={styles.value}>{place.historical_info}</Text>
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.label}>Tourism Info:</Text>
          <Text style={styles.value}>{place.tourism_info}</Text>
        </View>
      </View>

      {place.location && (
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
      )}
    </ScrollView>
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
  imageSlider: {
    marginBottom: hp(2),
  },
  image: {
    width: wp(70),
    height: hp(25),
    borderRadius: wp(3),
    marginRight: wp(2),
  },
  noImageText: {
    fontSize: wp(4),
    color: "#6c757d",
    textAlign: "center",
  },
  infoContainer: {
    backgroundColor: "#fff",
    borderRadius: wp(3),
    padding: wp(4),
    marginBottom: hp(2),
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: wp(2),
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  rowContainer: {
    flexDirection: "row",
    marginBottom: hp(1.5),
  },
  label: {
    fontWeight: "bold",
    fontSize: wp(4),
    color: "#343a40",
    width: "30%",
  },
  value: {
    fontSize: wp(4),
    color: "#495057",
    width: "70%",
  },
  map: {
    height: hp(30),
    marginVertical: hp(2),
    borderRadius: wp(3),
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  loadingText: {
    textAlign: "center",
    fontSize: wp(5),
    marginTop: hp(1),
    color: "#6c757d",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
  errorText: {
    textAlign: "center",
    fontSize: wp(5),
    color: "#dc3545",
  },
});

export default PlaceDetails;
