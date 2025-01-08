import { Image } from "react-native";

// Inside your loadImages function:
const decodedImages = placeImages.map((img) => {
  const imagePath = `../assets/${state}/${img}`;
  const imageSource = Image.resolveAssetSource(require(imagePath)); // Resolve the path dynamically
  return { uri: imageSource.uri }; // or just use imageSource if resolving directly
});
