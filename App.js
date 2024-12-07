import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import petSlice from './features/petSlice';
import todoSlice from './features/todoSlice'; 
import PetOverviewScreen from './screens/PetOverviewScreen';
import TodoScreen from './screens/TodoScreen';
import EditScreen from './screens/EditScreen';
import PetDetailScreen from './screens/PetDetailScreen';
import LoginScreen from './screens/LoginScreen';
import { Icon } from '@rneui/themed';
import WeightDetailScreen from './screens/WeightDetailScreen';
import WaterDetailScreen from './screens/WaterDetailScreen';
import ExcretionDetailScreen from './screens/ExcretionDetailScreen';
import FoodDetailScreen from './screens/FoodDetailScreen';

const store = configureStore({
  reducer: {
    pets: petSlice,
    todos: todoSlice, 
  },
});

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function PetStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="PetOverview" component={PetOverviewScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="PetDetailScreen" component={PetDetailScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="WeightDetailScreen" component={WeightDetailScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="WaterDetailScreen" component={WaterDetailScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="ExcretionDetailScreen" component={ExcretionDetailScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="EditScreen" component={EditScreen} options={{ headerShown: false }}/>
      <Stack.Screen name="FoodDetailScreen" component={FoodDetailScreen} options={{ headerShown: false }}/>
    </Stack.Navigator>
  );
}

// Tab navigator
function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: '#51A39D',
      }}
    >
      <Tab.Screen
        name="Pet"
        component={PetStackNavigator} 
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="pets"
                type="materialIcons"
                color={color}
                size={size}
              />
            );
          },
          headerShown: false
        }}
      />
      <Tab.Screen
        name="Todo"
        component={TodoScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => {
            return (
              <Icon
                name="list"
                type="entypo"
                color={color}
                size={size}
              />
            );
          },
          headerShown: false
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Login"
          screenOptions={{ headerShown: false }}
        >
          <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }}/>
          <Stack.Screen name="Home" component={TabNavigator} options={{ headerShown: false }}/>
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
}
