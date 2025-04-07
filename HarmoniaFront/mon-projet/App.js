import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider } from './services/AuthContext';
import { FavoritesProvider } from './services/FavoritesContext';

// Import des pages
console.log("Début des imports de composants");
import Connexion from './pages/Connexion';
console.log("Connexion importé:", !!Connexion);
import Inscription from './pages/Inscription';
console.log("Inscription importé:", !!Inscription);
import Home from './pages/Home';
console.log("Home importé:", !!Home);
import Accords from './pages/Accords';
console.log("Accords importé:", !!Accords);
import FavoritePage from './pages/FavoritePage';
console.log("FavoritePage importé:", !!FavoritePage);
console.log("FavoritesProvider importé:", !!FavoritesProvider);
console.log("AuthProvider importé:", !!AuthProvider);

// Création des navigateurs
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
console.log("Navigateurs créés");

// Création de la navigation par onglets pour les pages principales
const TabNavigator = () => {
  console.log("TabNavigator rendu");
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
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Accords" component={Accords} />
      <Tab.Screen 
        name="Favoris" 
        component={FavoritePage} 
        listeners={{
          tabPress: e => {
            console.log("Tab Favoris pressé");
          }
        }}
      />
    </Tab.Navigator>
  );
};

// Application principale
const App = () => {
  console.log("App rendu");
  
  // Vérifiez que les providers sont définis
  console.log("AuthProvider défini:", typeof AuthProvider);
  console.log("FavoritesProvider défini:", typeof FavoritesProvider);
  
  return (
    <AuthProvider>
      {console.log("Dans AuthProvider")}
      <FavoritesProvider>
        {console.log("Dans FavoritesProvider")}
        <NavigationContainer>
          {console.log("Dans NavigationContainer")}
          <Stack.Navigator initialRouteName="Connexion">
            {console.log("Dans Stack.Navigator")}
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
      </FavoritesProvider>
    </AuthProvider>
  );
};

export default App;