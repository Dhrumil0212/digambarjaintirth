import placesData from '../data/places_db.places.json';

export const getStates = () => {
  return Promise.resolve(placesData.states.map(state => ({
    name: state.name,
    image: state.image
  })));
};

export const getPlacesByState = (stateName) => {
  const state = placesData.states.find(s => s.name === stateName);
  return Promise.resolve(state ? state.places : []);
};

export const getPlaceByName = (placeName) => {
  for (const state of placesData.states) {
    const place = state.places.find(p => p.name === placeName);
    if (place) return Promise.resolve(place);
  }
  return Promise.reject(new Error('Place not found'));
};