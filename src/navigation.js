import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StyleSheet, Text, View } from 'react-native';

import HomeScreen from './Home'
import RestaurantScreen from './Restaurant'
import MapScreen from './Map'

const Stack = createNativeStackNavigator();

class Main extends React.Component {

    render() {
        return (
            <NavigationContainer>
                <Stack.Navigator screenOptions={{ headerShown: false, gestureEnabled: false }}>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="Restaurant" component={RestaurantScreen} />
                    <Stack.Screen name="Map" component={MapScreen} />
                </Stack.Navigator>
            </NavigationContainer >
        )
    }
}

export default Main;