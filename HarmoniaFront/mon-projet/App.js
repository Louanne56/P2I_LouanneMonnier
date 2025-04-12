import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { AuthProvider, useAuth } from './services/AuthContext';
import { FavoritesProvider } from './services/FavoritesContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';


// Import des pages et composants
import Connexion from './pages/Connexion';
import Inscription from './pages/Inscription';
import Home from './pages/Home';
import Accords from './pages/Accords';
import FavoritePage from './pages/FavoritePage';
import Header from './components/Header';

// Création des navigateurs
const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();
const AuthStack = createStackNavigator();

// Écran de chargement
const LoadingScreen = () => (
  <View style={styles.loadingContainer}>
    <ActivityIndicator size="large" color="#6200ee" />
  </View>
);

// Navigation par onglets pour les pages principales (inchangée)
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
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Accords" component={Accords} />
      <Tab.Screen name="Favoris" component={FavoritePage} />
    </Tab.Navigator>
  );
};

// Stack de navigation pour l'authentification
const AuthStackNavigator = () => (
  <AuthStack.Navigator initialRouteName="Connexion">
    <AuthStack.Screen 
      name="Connexion" 
      component={Connexion} 
      options={{ headerShown: true }}
    />
    <AuthStack.Screen 
      name="Inscription" 
      component={Inscription} 
      options={{ headerShown: true }}
    />
  </AuthStack.Navigator>
);

// Composant de navigation principale qui détermine quelle pile afficher
const NavigationManager = () => {
  const { isLoggedIn, loading, token, refreshUserToken } = useAuth();
  
  // À l'initialisation, essayer de rafraîchir le token si disponible
  useEffect(() => {
    const checkTokenAndRefresh = async () => {
      if (token) {
        await refreshUserToken();
      }
    };
    
    checkTokenAndRefresh();
  }, []);

  if (loading) {
    // Afficher l'écran de chargement pendant la vérification des tokens
    return <LoadingScreen />;
  }

  return (
    <NavigationContainer>
      {isLoggedIn ? (
        // L'utilisateur est connecté, afficher l'application principale
        <Stack.Navigator>
          <Stack.Screen 
            name="MainTabs" 
            component={TabNavigator} 
            options={{ 
              headerShown: true,
            header: () => <Header/>,}}
          />
        </Stack.Navigator>
      ) : (
        // L'utilisateur n'est pas connecté, afficher les écrans d'authentification
        <AuthStackNavigator />
      )}
    </NavigationContainer>
  );
};

// Application principale
const App = () => {
  return (
    <SafeAreaProvider>

    <AuthProvider>
      <FavoritesProvider>
        <NavigationManager />
      </FavoritesProvider>
    </AuthProvider>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
});

export default App;