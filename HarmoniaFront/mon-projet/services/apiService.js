/*

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

// Processus pour traiter la file d'attente des requêtes
const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  
  failedQueue = [];
};

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
    return response.data
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

// Intercepteur pour gérer les erreurs 401 (token expiré)
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 et que nous n'avons pas déjà tenté de rafraîchir le token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // Si un refresh est déjà en cours, mettre la requête dans la file d'attente
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        // Récupérer les tokens actuels
        const token = await AsyncStorage.getItem('token');
        const refreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (!token || !refreshToken) {
          throw new Error("Tokens non disponibles");
        }
        
        // Appeler l'endpoint de refresh
        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          token,
          refreshToken
        });
        
        const { token: newToken, refreshToken: newRefreshToken } = response.data;
        
        // Sauvegarder les nouveaux tokens
        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);
        
        // Mettre à jour l'en-tête Authorization pour la requête originale
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
        
        // Traiter la file d'attente avec le nouveau token
        processQueue(null, newToken);
        
        return apiClient(originalRequest);
      } catch (refreshError) {
        // En cas d'échec du refresh, vider les tokens et traiter la file d'attente avec l'erreur
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('refreshToken');
        await AsyncStorage.removeItem('user');
        
        processQueue(refreshError, null);
        
        // Rediriger vers la page de connexion (à implémenter avec un event global ou une navigation)
        // événement de déconnexion à implémenter
        
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }
    
    return Promise.reject(error);
  }
);
export const getResourceUrl = (path) => {
  if (!path) return null;
  // Si le chemin commence déjà par http ou https, on le retourne tel quel
  if (path.startsWith('http://') || path.startsWith('https://')) {
    return path;
  }
  // Construire l'URL de base sans le chemin /api
  const baseUrl = BASE_URL || API_URL.replace('/api', '');
  // Normaliser le chemin pour éviter les doubles slashes
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// Exporter l'instance axios pour une utilisation ailleurs si nécessaire
export const api = apiClient; */

import axios from 'axios';
import { API_URL, BASE_URL } from './apiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Création d'une instance axios avec une configuration de base
const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  }
});

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

// Intercepteur pour ajouter automatiquement le token dans les headers
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

// Intercepteur pour gérer les erreurs 401 (token expiré)
apiClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then(token => {
            originalRequest.headers['Authorization'] = `Bearer ${token}`;
            return apiClient(originalRequest);
          })
          .catch(err => Promise.reject(err));
      }

      isRefreshing = true;

      try {
        const token = await AsyncStorage.getItem('token');
        const refreshToken = await AsyncStorage.getItem('refreshToken');

        if (!token || !refreshToken) throw new Error("Tokens non disponibles");

        const response = await apiClient.post('/auth/refresh-token', {
          token,
          refreshToken,
        });

        const { token: newToken, refreshToken: newRefreshToken } = response.data;

        await AsyncStorage.setItem('token', newToken);
        await AsyncStorage.setItem('refreshToken', newRefreshToken);

        apiClient.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        processQueue(null, newToken);
        return apiClient(originalRequest);

      } catch (refreshError) {
        await AsyncStorage.multiRemove(['token', 'refreshToken', 'user']);
        processQueue(refreshError, null);

        // 👉 Ici tu peux déclencher un logout global si besoin
        // Exemple : EventEmitter.emit('logout')
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

// Fonctions d'API

export const getProgressions = async (tonalite, mode, style = null) => {
  try {
    let url = `/progressions/filtred?tonalite=${tonalite}&mode=${mode}`;
    if (style) url += `&style=${style}`;

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error('Erreur dans getProgressions:', error);
    throw error;
  }
};

export const getUserFavorites = async (userId) => {
  try {
    const response = await apiClient.get(`/suites-favorites/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Erreur dans getUserFavorites:', error);
    throw error;
  }
};

export const toggleFavoriteAPI = async (userId, progressionId, isFavorite) => {
  try {
    if (isFavorite) {
      await apiClient.delete(`/suites-favorites/user/${userId}/progression/${progressionId}`);
    } else {
      await apiClient.post(`/suites-favorites`, {
        userId: userId,
        progressionAccordsId: progressionId
      });
    }
    return true;
  } catch (error) {
    console.error('Erreur dans toggleFavoriteAPI:', error);
    throw error;
  }
};

// Gestion des ressources médias
export const getResourceUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;

  const baseUrl = BASE_URL || API_URL.replace('/api', '');
  return `${baseUrl}${path.startsWith('/') ? path : `/${path}`}`;
};

// Export principal
export const api = apiClient;
