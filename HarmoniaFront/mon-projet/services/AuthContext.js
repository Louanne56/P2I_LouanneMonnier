/*import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur et le token à partir du stockage local au démarrage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        
        if (userData) {
          setUser(JSON.parse(userData));
        }
        
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Connecter l'utilisateur
  const login = async ({ user: userData, token: authToken }) => {
    try {
      // Stocker l'utilisateur
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      // Stocker le token
      await AsyncStorage.setItem('token', authToken);
      setToken(authToken);
      
      console.log("Authentification réussie:", { userData, authToken });
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  };

  // Déconnecter l'utilisateur
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const authContext = {
    user,
    token,
    loading,
    login,
    logout,
    isLoggedIn: !!user,
  };

  console.log("État actuel du contexte d'authentification:", { user, token, isLoggedIn: !!user });

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => { //useAuth est un hook personnalisé qui permet de récupérer le contexte d'authentification, équivalent à useContext(AuthContext)
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
}; */

// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from './apiService';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [loading, setLoading] = useState(true);

  // Charger l'utilisateur et les tokens à partir du stockage local au démarrage
  useEffect(() => {
    const loadUserData = async () => {
      try {
        const userData = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');
        const storedRefreshToken = await AsyncStorage.getItem('refreshToken');
        
        if (userData) {
          setUser(JSON.parse(userData));
        }
        
        if (storedToken) {
          setToken(storedToken);
        }

        if (storedRefreshToken) {
          setRefreshToken(storedRefreshToken);
        }
      } catch (error) {
        console.error('Erreur lors du chargement des données utilisateur:', error);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  // Vérification de l'expiration du token
  const isTokenExpired = (token) => {
    try {
      const decoded = JSON.parse(atob(token.split('.')[1])); // Décoder le JWT
      const expirationTime = decoded.exp * 1000; // Convertir l'expiration en ms
      return Date.now() > expirationTime;
    } catch (error) {
      console.error('Erreur de décodage du token:', error);
      return true; // En cas d'erreur, considérer que le token est expiré
    }
  };

  // Connecter l'utilisateur
  const login = async ({ user: userData, token: authToken, refreshToken: authRefreshToken }) => {
    try {
      // Stocker l'utilisateur et les tokens
      await AsyncStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      await AsyncStorage.setItem('token', authToken);
      setToken(authToken);
      
      await AsyncStorage.setItem('refreshToken', authRefreshToken);
      setRefreshToken(authRefreshToken);
      
      console.log("Authentification réussie:", { userData, authToken });
      return true;
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      return false;
    }
  };

  // Rafraîchir le token uniquement si nécessaire
  const refreshUserToken = async () => {
    if (!token || !refreshToken || !isTokenExpired(token)) return false; // Si le token est valide, ne pas rafraîchir
    
    try {
      const response = await api.post('/auth/refresh-token', {
        token: token,
        refreshToken: refreshToken
      });
      
      const { token: newToken, refreshToken: newRefreshToken } = response.data;
      
      // Mettre à jour les tokens dans AsyncStorage
      await AsyncStorage.setItem('token', newToken);
      setToken(newToken);
      
      await AsyncStorage.setItem('refreshToken', newRefreshToken);
      setRefreshToken(newRefreshToken);
      
      return true;
    } catch (error) {
      console.error('Erreur lors du rafraîchissement du token:', error);
      
      // Si le refresh token est invalide, déconnecter l'utilisateur
      if (error.response?.status === 400) {
        await logout();
      }
      
      return false;
    }
  };

  // Déconnecter l'utilisateur
  const logout = async () => {
    try {
      await AsyncStorage.removeItem('user');
      await AsyncStorage.removeItem('token');
      await AsyncStorage.removeItem('refreshToken');
      setUser(null);
      setToken(null);
      setRefreshToken(null);
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
    }
  };

  const authContext = {
    user,
    token,
    refreshToken,
    loading,
    login,
    logout,
    refreshUserToken,
    isLoggedIn: !!user && !!token,
  };

  return (
    <AuthContext.Provider value={authContext}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth doit être utilisé à l\'intérieur d\'un AuthProvider');
  }
  return context;
};
