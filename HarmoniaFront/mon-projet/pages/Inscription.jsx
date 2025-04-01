import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_URL } from '../services/apiConfig';

const Inscription = ({ navigation }) => {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [motDePasse, setMotDePasse] = useState('');
  const [confirmationMotDePasse, setConfirmationMotDePasse] = useState('');
  const [loading, setLoading] = useState(false);

  const handleInscription = async () => {
    // Validation basique
    if (!pseudo || !email || !motDePasse || !confirmationMotDePasse) {
      Alert.alert('Erreur', 'Veuillez remplir tous les champs');
      return;
    }

    if (motDePasse !== confirmationMotDePasse) {
      Alert.alert('Erreur', 'Les mots de passe ne correspondent pas');
      return;
    }

    if (motDePasse.length < 6) {
      Alert.alert('Erreur', 'Le mot de passe doit contenir au moins 6 caractères');
      return;
    }

    setLoading(true);

    try {
      console.log("Envoi des données:", { pseudo, email, motDePasse }); // Debug
      
      const response = await axios.post(`${API_URL}/auth/inscription`, {
        pseudo,
        email,
        motDePasse
      }, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });

      console.log("Réponse du serveur:", response.data); // Debug

      // Navigation directe sans alerte qui peut bloquer
      navigation.navigate('Connexion', { 
        newlyRegistered: true,
        email: email,
        message: `Inscription réussie ! Bienvenue ${pseudo}`
      });

    } catch (error) {
      console.error("Erreur détaillée:", {
        message: error.message,
        response: error.response?.data,
        config: error.config
      });

      // Gestion spécifique des erreurs Identity
      let errorMessage = "Erreur lors de l'inscription";
      if (error.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors)
          .flat()
          .join('\n');
      } else if (error.response?.data?.Message) {
        errorMessage = error.response.data.Message;
      }

      Alert.alert('Erreur', errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.conteneurPrincipal}>
      <Text style={styles.titre}>Inscription</Text>

      <View style={styles.conteneurFormulaire}>
        <TextInput
          style={styles.champ}
          placeholder="Pseudo"
          value={pseudo}
          onChangeText={setPseudo}
          autoCapitalize="none"
          autoCorrect={false}
        />
        
        <TextInput
          style={styles.champ}
          placeholder="Email"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoComplete="email"
        />
        
        <TextInput
          style={styles.champ}
          placeholder="Mot de passe (6 caractères min)"
          value={motDePasse}
          onChangeText={setMotDePasse}
          secureTextEntry={true}
        />
        
        <TextInput
          style={styles.champ}
          placeholder="Confirmez le mot de passe"
          value={confirmationMotDePasse}
          onChangeText={setConfirmationMotDePasse}
          secureTextEntry={true}
        />

        {loading ? (
          <ActivityIndicator size="large" color="#808080" style={styles.loader} />
        ) : (
          <TouchableOpacity 
            style={styles.bouton} 
            onPress={handleInscription}
            disabled={loading}
          >
            <Text style={styles.texteBouton}>S'inscrire</Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity 
          style={styles.lienConnexion}
          onPress={() => navigation.navigate('Connexion')}
        >
          <Text style={styles.texteLien}>Déjà un compte ? Connectez-vous</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneurPrincipal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  titre: {
    position: 'absolute',
    top: 50,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  conteneurFormulaire: {
    width: '80%',
    padding: 20,
    backgroundColor: '#ffffe0',
    borderWidth: 2,
    borderColor: '#000',
    borderRadius: 10,
  },
  champ: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    backgroundColor: '#fff',
  },
  bouton: {
    backgroundColor: '#808080',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: 'center',
  },
  texteBouton: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  lienConnexion: {
    marginTop: 10,
    alignItems: 'center',
  },
  texteLien: {
    color: '#3498db',
    textDecorationLine: 'underline',
  },
});

export default Inscription;