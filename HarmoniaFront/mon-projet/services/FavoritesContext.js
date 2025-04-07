import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserFavorites, toggleFavoriteAPI } from './apiService';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user, token } = useAuth();
  const [favorites, setFavorites] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadUserFavorites();
    }
  }, [user?.id]);

  const loadUserFavorites = async () => {
    try {
      const favs = await getUserFavorites(user.id, token);
      setFavorites(favs);
    } catch (err) {
      console.error("Erreur lors du chargement des favoris:", err);
    }
  };

  const toggleFavorite = async (progression) => {
    try {
      const isFavorite = favorites.includes(progression.id);
      await toggleFavoriteAPI(user.id, progression.id, token, isFavorite);
  
      // Mise à jour immédiate du tableau des favoris sans recharger depuis l'API
      setFavorites(prevFavorites => {
        if (isFavorite) {
          // Si c'était un favori, on le retire de la liste
          return prevFavorites.filter(fav => fav !== progression.id);
        } else {
          // Sinon, on l'ajoute à la liste
          return [...prevFavorites, progression.id];
        }
      });
    } catch (err) {
      console.error("Erreur lors de la mise à jour des favoris:", err);
    }
  };

  return (
    <FavoritesContext.Provider value={{ favorites, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};
 