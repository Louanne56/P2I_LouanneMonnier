import React, { createContext, useContext, useState, useEffect } from 'react';
import { getUserFavorites, toggleFavoriteAPI } from './apiService';
import { useAuth } from './AuthContext';

const FavoritesContext = createContext();

export const useFavorites = () => useContext(FavoritesContext);

export const FavoritesProvider = ({ children }) => {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [favoriteIds, setFavoriteIds] = useState([]);

  useEffect(() => {
    if (user?.id) {
      loadUserFavorites();
    }
  }, [user?.id]);

  const loadUserFavorites = async () => {
    try {
      const favs = await getUserFavorites(user.id);
      setFavorites(favs);
      // Extraire les IDs des progressions pour une vérification facile
      setFavoriteIds(favs.map(fav => fav.progressionAccords.id));
    } catch (err) {
      console.error("Erreur lors du chargement des favoris:", err);
    }
  };

  // Dans FavoritesContext.js
const toggleFavorite = async (progression) => {
  try {
    const isFavorite = favoriteIds.includes(progression.id);
    await toggleFavoriteAPI(user.id, progression.id, isFavorite);
    
    if (isFavorite) {
      // Mise à jour optimiste de l'UI avant confirmation du serveur
      setFavoriteIds(prev => prev.filter(id => id !== progression.id));
      setFavorites(prev => prev.filter(fav => fav.progressionAccords.id !== progression.id));
    } else {
      // Pour l'ajout, on peut faire une mise à jour optimiste partielle
      setFavoriteIds(prev => [...prev, progression.id]);
      
      // Et ensuite récupérer l'objet complet du serveur
      const updatedFavorites = await getUserFavorites(user.id);
      setFavorites(updatedFavorites);
    }
  } catch (err) {
    // En cas d'erreur, restaurer l'état précédent
    console.error("Erreur lors de la mise à jour des favoris:", err);
    loadUserFavorites(); // Recharger l'état correct
  }
};

  return (
    <FavoritesContext.Provider value={{ favorites, favoriteIds, toggleFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};