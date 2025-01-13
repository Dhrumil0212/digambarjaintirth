import finalData from "../data/final.json"; // Importing final.json

// Updated getStates function
export const getStates = () => {
  return Promise.resolve(
    finalData.Sheet1.reduce((acc, item) => {
      const state = item.State; // Extracting the state
      const place = item["Name teerth"]; // Extracting the place

      const existingState = acc.find((s) => s.name === state);
      if (existingState) {
        existingState.places.push(place);
      } else {
        acc.push({
          name: state,
          places: [place],
        });
      }
      return acc;
    }, [])
  );
};

// Updated getPlacesByState function
export const getPlacesByState = (stateName) => {
  const state = finalData.Sheet1.filter((item) => item.State === stateName);
  const allPlaces = state.map((item) => item["Name teerth"]);
  return Promise.resolve(allPlaces);
};

// Updated getPlaceByName function
export const getPlaceByName = (placeName) => {
  const place = finalData.Sheet1.find(
    (item) => item["Name teerth"] === placeName
  );
  if (place) return Promise.resolve(place);
  return Promise.reject(new Error("Place not found"));
};
