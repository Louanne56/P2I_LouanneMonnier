// contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
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
};