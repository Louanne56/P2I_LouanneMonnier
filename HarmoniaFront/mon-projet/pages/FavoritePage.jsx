import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, FlatList, ActivityIndicator, Alert } from 'react-native';
import { useAuth } from "../services/AuthContext";
import ProgressionCard from '../components/ProgressionCard';
import { getUserFavorites, toggleFavoriteAPI } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { API_URL } from '../services/apiConfig'; // Assurez-vous que le chemin est correct

const FavoritePage = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();
  const userId = user?.id;

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    } else {
      setLoading(false);
      setError("Vous devez être connecté pour voir vos favoris");
    }
  }, [userId]);
  
  const fetchFavorites = async () => {
    try {
      setLoading(true);
      const url = `${API_URL}/suites-favorites/user/${userId}`;
      console.log("URL API utilisée:", url);
      const response = await axios.get(url);
  
      if (response.data) {
        console.log("Données favorites reçues:", JSON.stringify(response.data, null, 2));
        setFavorites(response.data);
      }
  
      setLoading(false);
    } catch (err) {
      console.error("Erreur lors de la récupération des favoris:", err);
      setError("Impossible de charger vos favoris. Veuillez réessayer plus tard.");
      setLoading(false);
    }
  };
  

  const toggleFavorite = async (progression) => {
    try {
      const token = await AsyncStorage.getItem('token'); // Récupération du token
      const progressionId = progression.progressionAccords.id;
      
      await toggleFavoriteAPI(userId, progressionId, token, true);

      // Mise à jour de la liste après suppression
      setFavorites(prevFavorites => prevFavorites.filter(fav => fav.progressionAccords.id !== progressionId));

      Alert.alert("Succès", "Progression retirée des favoris");
    } catch (err) {
      console.error("Erreur lors de la suppression du favori:", err);
      Alert.alert("Erreur", "Impossible de retirer des favoris. Veuillez réessayer.");
    }
  };

  const isValidProgression = (progression) => {
    return progression &&
           progression.progressionAccords &&
           progression.progressionAccords.accords &&
           Array.isArray(progression.progressionAccords.accords) &&
           progression.progressionAccords.accords.length > 0;
  };

  const renderItem = ({ item }) => {
    if (!isValidProgression(item)) {
      console.error("Progression invalide:", item);
      return null;
    }
  
    return (
      <ProgressionCard
        progression={item.progressionAccords}
        isFavorite={true}
        onToggleFavorite={() => toggleFavorite(item)}
      />
    );
  };

  const keyExtractor = (item) => {
    return item?.progressionAccords?.id?.toString() || Math.random().toString();
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#3498db" />
        <Text style={styles.loadingText}>Chargement de vos favoris...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  if (favorites.length === 0) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.noFavoritesText}>Vous n'avez pas encore de favoris</Text>
        <Text style={styles.noFavoritesSubText}>
          Trouvez des progressions d'accords qui vous plaisent et ajoutez-les à vos favoris
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Vos Progressions Favorites</Text>
      <FlatList
        data={favorites}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  listContainer: {
    paddingBottom: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorText: {
    color: '#d8000c',
    fontSize: 16,
    textAlign: 'center',
  },
  noFavoritesText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#555',
    marginBottom: 10,
  },
  noFavoritesSubText: {
    fontSize: 14,
    color: '#777',
    textAlign: 'center',
    paddingHorizontal: 30,
  }
});

export default FavoritePage;


