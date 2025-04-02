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
import { API_URL } from '../services/apiConfig';
import Icon from 'react-native-vector-icons/MaterialIcons';

const { width } = Dimensions.get('window');

const Diagram = () => {
    const [accords, setAccords] = useState([]);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      fetch(`${API_URL}/accords`)
        .then(response =>{
           console.log({"voici le corps de la réponse": response});
           return response.json();
        })
        .then(data => {
          setAccords(data);
          setLoading(false);
        })
        .catch(error => {
          console.error('Erreur lors du chargement des accords:', error);
          setLoading(false);
          Alert.alert('Erreur', 'Impossible de charger les accords');
        });
    }, []);
    
    // Fonction pour jouer le son d'un accord
    const playChordSound = async (accordNom, audioFile, audioFile2) => {
      let audioUrl = '';
      if (audioFile) {
        audioUrl = `http://localhost:5007/audio/${audioFile}.mp3`; // Assurez-vous que le format de fichier est correct, ici j'ajoute `.mp3`
      } else if (audioFile2) {
        audioUrl = `http://localhost:5007/audio/${audioFile2}.mp3`; // Assurez-vous que le format de fichier est correct
      } else {
        Alert.alert('Information', `Pas d'audio disponible pour l'accord ${accordNom}`);
        return;
      }
    
      try {
        const { sound } = await Audio.Sound.createAsync({ uri: audioUrl });
        await sound.playAsync();
    
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
    
    
    
    const styles = StyleSheet.create({
      container: {
        flex: 1,
        backgroundColor: '#f4f4f8',
        paddingTop: 20,
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
    
            return diagrams.map((diagram, index) => (
              <TouchableOpacity 
                key={`${accord.id}-${index}`} // Une clé unique pour chaque diagramme
                style={styles.chordCard}
                activeOpacity={0.7}
              >
                <View style={styles.imageContainer}>
                  <TouchableOpacity 
                    style={styles.volumeIcon}
                    onPress={() => playChordSound(accord.id, accord.nom, accord.audio, accord.audio2)}
                  >
                    <Icon name="volume-up" size={14} color="#3498db" />
                  </TouchableOpacity>
    
                  {/* Affichage de l'image du diagramme */}
                  <Image
                    source={{ uri: `http://localhost:5007/images/${encodeURIComponent(diagram)}` }}
                    style={styles.chordImage}
                    onError={(e) => {
                      console.error(`Erreur de chargement de l'image ${diagram}`, e.nativeEvent.error);
                    }}
                  />
                </View>
              </TouchableOpacity>
            ));
          })}
        </View>
      </ScrollView>
    );
    }
    
  
  export default Diagram;