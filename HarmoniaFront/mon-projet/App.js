import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './services/AuthContext';

// Import des pages
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Home from './pages/Home';
import Accords from './pages/Accords';
import FavoritesPage from './pages/FavoritesPage';

// Création des navigateurs
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Création de la navigation par onglets pour les pages principales
const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'Accords') {
            iconName = focused ? 'musical-notes' : 'musical-notes-outline';
          } else if (route.name === 'Favoris') {
            iconName = focused ? 'heart' : 'heart-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#6200ee',
        tabBarInactiveTintColor: 'gray',
        headerShown: false, // Masque le header pour les écrans de l'onglet
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Accords" component={Accords} />
      <Tab.Screen name="Favoris" component={FavoritesPage} />
    </Tab.Navigator>
  );
};

// Application principale
const App = () => {
  return (
    <AuthProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Connexion">
          <Stack.Screen 
            name="Connexion" 
            component={Connexion} 
            options={{ headerShown: true }}
          />
          <Stack.Screen 
            name="Inscription" 
            component={Inscription} 
            options={{ headerShown: true }}
          />
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator} 
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;