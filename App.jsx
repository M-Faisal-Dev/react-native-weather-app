import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/HomeScreen';
// import OtherScreen from './screens/OtherScreen'; // example
import "./global.css"
const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Home" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        {/* <Stack.Screen name="Other" component={OtherScreen} /> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
