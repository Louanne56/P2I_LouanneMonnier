import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  StyleSheet, 
  ScrollView, 
  ActivityIndicator, 
  Dimensions,
  TouchableOpacity,
  Alert
} from 'react-native';
import { Audio } from 'expo-av';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { api, getResourceUrl } from '../services/apiService';

const { width } = Dimensions.get('window');

const Diagram = () => {
  const [accords, setAccords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/accords')
      .then(response => {
        setAccords(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors du chargement des accords:', error);
        setLoading(false);
        Alert.alert('Erreur', 'Impossible de charger les accords');
      });
  }, []);
  
  // Fonction pour jouer le son d'un accord
  const playChordSound = async (accordNom, audio, audio2) => {
    let audioFileName = audio || audio2;
    
    if (!audioFileName) {
      Alert.alert('Information', `Pas d'audio disponible pour l'accord ${accordNom}`);
      return;
    }
    
    const audioUrl = getResourceUrl(`/audio/${audioFileName}`);
    console.log('Tentative de lecture audio:', audioUrl);

    try {
      const { sound } = await Audio.Sound.createAsync(
        { uri: audioUrl },
        { shouldPlay: true } // Option pour commencer à jouer immédiatement
      ); 
      sound.setOnPlaybackStatusUpdate(status => {
        if (status.didJustFinish) {
          sound.unloadAsync();
        }
      });
  
      console.log(`Lecture de l'accord: ${accordNom}`);
    } catch (error) {
      console.error('Erreur lors de la lecture audio:', error);
      Alert.alert('Erreur', `Impossible de lire l'audio pour l'accord ${accordNom}`);
    }
  };
  
  // Fonction pour construire l'URL d'une image
  const getImageUrl = (imageName) => {
    return getResourceUrl(`/images/${encodeURIComponent(imageName)}`);
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#f4f4f8',
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      textAlign: 'center',
      marginBottom: 20,
      color: '#2c3e50',
      fontFamily: 'BoldonseRegular',
    },
    gridContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-around',
      paddingHorizontal: 10,
    },
    chordCard: {
      width: width / 3 - 20,
      backgroundColor: '#808080',
      borderRadius: 15,
      marginBottom: 15,
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 3,
      overflow: 'hidden',
      borderColor: 'black',
      borderWidth: 1,
    },
    imageContainer: {
      backgroundColor: '#f5f5f5',
      padding: 10,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'relative',
    },
    chordImage: {
      width: '100%',
      height: 100,
      resizeMode: 'contain',
    },
    loadingContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    errorImage: {
      width: '100%',
      height: 100,
      resizeMode: 'contain',
      opacity: 0.5,
    },
    volumeIcon: {
      position: 'absolute',
      top: 3,
      right: 3,
      backgroundColor: 'rgba(255, 255, 255, 0.7)',
      borderRadius: 10,
      padding: 2,
      zIndex: 10,
    }
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#3498db" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Accords de Guitare</Text>
      <View style={styles.gridContainer}>
        {accords.map(accord => {
          // Crée un tableau des diagrammes de l'accord
          const diagrams = [];
          if (accord.diagram1) diagrams.push(accord.diagram1);
          if (accord.diagram2) diagrams.push(accord.diagram2);
  
          return diagrams.map((diagram, index) => {
            // Sélectionner le fichier audio correspondant au diagramme actuel
            const audioFile = index === 0 ? accord.audio : accord.audio2;
            
            return (
              <TouchableOpacity 
                key={`${accord.id}-${index}`}
                style={styles.chordCard}
                activeOpacity={0.7}
              >
                <View style={styles.imageContainer}>
                  <TouchableOpacity 
                    style={styles.volumeIcon}
                    onPress={() => playChordSound(accord.nom, audioFile)}
                  >
                    <Icon name="volume-up" size={14} color="#3498db" />
                  </TouchableOpacity>
          
                  <Image
                    source={{ uri: getImageUrl(diagram) }}
                    style={styles.chordImage}
                    onError={(e) => {
                      console.error(`Erreur de chargement de l'image ${diagram}`, e.nativeEvent.error);
                    }}
                  />
                </View>
              </TouchableOpacity>
            );
          });
        })}
      </View>
    </ScrollView>
  );
};

export default Diagram;