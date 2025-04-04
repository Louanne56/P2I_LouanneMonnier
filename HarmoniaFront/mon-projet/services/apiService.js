/*import axios from 'axios';
import { API_URL } from './apiConfig';

export const getProgressions = async (tonalite, mode, style = null) => {
  let url = `${API_URL}/progressions/filtred?tonalite=${tonalite}&mode=${mode}`;
  if (style) url += `&style=${style}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
  return await response.json();
};

export const getUserFavorites = async (userId, token) => {
  const response = await axios.get(`${API_URL}/suites-favorites/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.map(fav => fav.progressionAccordsId);
};

export const toggleFavoriteAPI = async (userId, progressionId, token, isFavorite) => {
  if (isFavorite) {
    await axios.delete(`${API_URL}/suites-favorites/user/${userId}/progression/${progressionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } else {
    await axios.post(`${API_URL}/suites-favorites`, {
      userId: userId,
      progressionAccordsId: progressionId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
*/

import axios from 'axios';
import { API_URL, BASE_URL } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Création d'une instance axios avec une configuration de base
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 secondes de timeout
  headers: {
    'Content-Type': 'application/json',
  }
});

// Intercepteur pour ajouter le token d'authentification à chaque requête si disponible
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (error) {
      console.error('Erreur lors de la récupération du token:', error);
    }
    return config;
  },
  error => Promise.reject(error)
);

export const getProgressions = async (tonalite, mode, style = null) => {
  try {
    let url = `/progressions/filtred?tonalite=${tonalite}&mode=${mode}`;
    if (style) url += `&style=${style}`;
    
    const response = await fetch(`${API_URL}${url}`);
    if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
    return await response.json();
  } catch (error) {
    console.error('Erreur dans getProgressions:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId, token) => {
  try {
    const response = await apiClient.get(`/suites-favorites/user/${userId}`, {
      headers: token ? { Authorization: `Bearer ${token}` } : {}
    });
    return response.data.map(fav => fav.progressionAccordsId);
  } catch (error) {
    console.error('Erreur dans getUserFavorites:', error);
    throw error;
  }
};

export const toggleFavoriteAPI = async (userId, progressionId, token, isFavorite) => {
  try {
    if (isFavorite) {
      await apiClient.delete(`/suites-favorites/user/${userId}/progression/${progressionId}`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    } else {
      await apiClient.post(`/suites-favorites`, {
        userId: userId,
        progressionAccordsId: progressionId
      }, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
    }
    return true;
  } catch (error) {
    console.error('Erreur dans toggleFavoriteAPI:', error);
    throw error;
  }
};

// Fonction utilitaire pour obtenir l'URL complète d'une ressource (images, fichiers, etc.)
export const getResourceUrl = (path) => {
  if (!path) return null;
  // Si le chemin commence déjà par http ou https, on le retourne tel quel
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Sinon on préfixe avec l'URL de base
  return `${BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;
};

// Exporter l'instance axios pour une utilisation ailleurs si nécessaire
export const api = apiClient;