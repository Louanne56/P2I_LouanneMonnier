import React, { useState, useEffect } from 'react';
import { StyleSheet, View, TouchableOpacity, Text, Alert, ActivityIndicator } from 'react-native';
import DropdownSelector from '../components/DropdownSelector';
import ProgressionCard from '../components/ProgressionCard';
import { getProgressions } from '../services/apiService';
import { useAuth } from "../services/AuthContext";
import { useFavorites } from '../services/FavoritesContext'; // Import du contexte

const notesData = [
  { value: 'C', label: 'Do' }, { value: 'Csharp', label: 'Do#' },
  { value: 'D', label: 'Ré' }, { value: 'Dsharp', label: 'Ré#' },
  { value: 'E', label: 'Mi' }, { value: 'F', label: 'Fa' },
  { value: 'Fsharp', label: 'Fa#' }, { value: 'G', label: 'Sol' },
  { value: 'Gsharp', label: 'Sol#' }, { value: 'A', label: 'La' },
  { value: 'Asharp', label: 'La#' }, { value: 'B', label: 'Si' }
];

const modeData = [
  { value: 'Majeur', label: 'Majeur' }, { value: 'Mineur', label: 'Mineur' }
];

const styleData = [
  { value: null, label: 'Tous styles' },
  { value: 'Jazz', label: 'Jazz' }, { value: 'Blues', label: 'Blues' },
  { value: 'Rock', label: 'Rock' }, { value: 'Pop', label: 'Pop' }
];

const Home = () => {
  const { user, token } = useAuth();
  //const { favorites, toggleFavorite } = useFavorites(); // Utilisation du contexte des favoris
  const { favoriteIds, toggleFavorite } = useFavorites();
  const [note, setNote] = useState(null);
  const [mode, setMode] = useState(null);
  const [style, setStyle] = useState(null);
  const [progressions, setProgressions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const userId = user?.id;

  const fetchProgressions = async () => {
    if (!note || !mode) {
      Alert.alert('Sélection incomplète', 'Veuillez sélectionner une tonalité et un mode.');
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const data = await getProgressions(note, mode, style);
      setProgressions(data);
    } catch (err) {
      setError(`Impossible de charger les progressions: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.dropdownsContainer}>
        <DropdownSelector data={notesData} selectedValue={note} onSelect={e => setNote(e.value)} placeholder="Tonalité" />
        <DropdownSelector data={modeData} selectedValue={mode} onSelect={e => setMode(e.value)} placeholder="Mode" />
        <DropdownSelector data={styleData} selectedValue={style} onSelect={e => setStyle(e.value)} placeholder="Style" />
      </View>

      <TouchableOpacity style={styles.button} onPress={fetchProgressions}>
        <Text style={styles.buttonText}>Trouver des progressions</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#3498db" />}
      {error && <Text style={styles.errorText}>{error}</Text>}

      <View style={styles.resultsContainer}>
        {progressions.map(progression => (
          <ProgressionCard
            key={progression.id}
            progression={progression}
            isFavorite={favoriteIds.includes(progression.id)} // Vérifier si c'est un favori
            onToggleFavorite={() => toggleFavorite(progression)} // Ajouter/retirer des favoris via le contexte
          />
        ))}
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  mainContainer: { padding: 16, flex: 1 },
  dropdownsContainer: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
  button: { backgroundColor: '#808080', padding: 12, borderRadius: 12, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: 'white', fontSize: 16 },
  resultsContainer: { marginTop: 20 },
  errorText: { color: 'red', textAlign: 'center' }
});
