//export const API_URL = "http://127.0.0.1:5007/api";


//export const API_URL = "http://192.168.1.20:5007/api";


import { Platform } from 'react-native';
import Constants from 'expo-constants';

// Fonction pour obtenir l'URL de l'API en fonction de l'environnement
const getApiUrl = () => {
  // Si nous sommes sur un émulateur Android
  if (Platform.OS === 'android' && Constants.expoConfig?.debuggerHost) {
    const hostUri = Constants.expoConfig.debuggerHost.split(':').shift();
    return `http://${hostUri}:5007/api`;
  }
  
  // Si nous sommes sur le web en développement
  if (__DEV__ && Platform.OS === 'web') {
    return 'http://localhost:5007/api';
  }
  
  // Pour les appareils iOS ou en mode production
  return process.env.API_URL || 'http://192.168.1.20:5007/api';
};

// URL principale de l'API avec le chemin /api
export const API_URL = getApiUrl();

// URL de base pour les ressources statiques (sans le /api)
export const BASE_URL = API_URL.replace('/api', '');