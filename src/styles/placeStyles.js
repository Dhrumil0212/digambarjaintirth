// styles.js

import { StyleSheet } from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";

export const styles = StyleSheet.create({
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
  section: {
    marginBottom: hp(2),
  },
  sectionTitle: {
    fontSize: wp(4.5),
    fontWeight: "bold",
    color: "#343a40",
  },
  value: {
    fontSize: wp(4),
    color: "#495057",
  },
  mapContainer: {
    marginVertical: hp(2),
  },
  map: {
    height: hp(30),
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
