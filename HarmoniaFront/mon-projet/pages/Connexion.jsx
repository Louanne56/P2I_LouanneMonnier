import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from "react-native";
import axios from "axios";
import { API_URL } from "../services/apiConfig";
import { useAuth } from "../services/AuthContext";

const Connexion = ({ navigation }) => {
  const [pseudo, setPseudo] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const { login } = useAuth();

  const handleConnexion = async () => {
    if (!pseudo || !motDePasse) {
      Alert.alert("Erreur", "Veuillez entrer un pseudo et un mot de passe");
      return;
    }

    try {
      const response = await axios.post(`${API_URL}/auth/connexion`, { 
        pseudo,
        motDePasse
      });
      
      console.log("Réponse du serveur:", response.data);
      
      if (response.status === 200) {
        // Stocker les informations de l'utilisateur et le token dans le contexte
        await login({
          user: response.data.utilisateur,
          token: response.data.token
        });
        
        Alert.alert("Connexion réussie", `Bienvenue ${response.data.utilisateur.pseudo} !`);
        navigation.navigate("MainTabs");
      } else {
        Alert.alert("Erreur", "Identifiants incorrects");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error.response?.data || error.message);
      Alert.alert(
        "Erreur de connexion", 
        error.response?.data?.message || "Problème de connexion au serveur"
      );
    }
  };

  return (
    <View style={styles.conteneurPrincipal}>
      <View style={styles.conteneurFormulaire}>
        <TextInput
          style={styles.champ}
          placeholder="Entrez votre pseudo"
          value={pseudo}
          onChangeText={setPseudo}
        />
        <TextInput
          style={styles.champ}
          placeholder="Entrez votre mot de passe"
          value={motDePasse}
          onChangeText={setMotDePasse}
          secureTextEntry={true}
        />
        <TouchableOpacity style={styles.bouton} onPress={handleConnexion}>
          <Text style={styles.texteBouton}>Se connecter</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bouton} onPress={() => navigation.navigate("Inscription")}>
          <Text style={styles.texteBouton}>Inscris-toi</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  conteneurPrincipal: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
  },
  titre: {
    position: "absolute",
    top: 50,
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
  conteneurFormulaire: {
    width: "80%",
    padding: 20,
    backgroundColor: "#ffffe0",
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 10,
  },
  champ: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: "#fff",
  },
  bouton: {
    backgroundColor: "#808080",
    borderWidth: 1,
    borderColor: "#000",
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginBottom: 10,
    alignItems: "center",
  },
  texteBouton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Connexion;