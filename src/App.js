import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import StatesGrid from './screens/StatesGrid';
import PlacesGrid from './screens/PlacesGrid';
import PlaceDetails from './screens/PlaceDetails';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="StatesGrid">
        <Stack.Screen name="StatesGrid" component={StatesGrid} />
        <Stack.Screen name="PlacesGrid" component={PlacesGrid} />
        <Stack.Screen name="PlaceDetails" component={PlaceDetails} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;