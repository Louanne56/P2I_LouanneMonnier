import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from "react-native";
import { useAuth } from "../services/AuthContext";
import { api } from "../services/apiService";

const Connexion = ({ navigation }) => {
  const [pseudo, setPseudo] = useState("");
  const [motDePasse, setMotDePasse] = useState("");
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();

  const handleConnexion = async () => {
    // Validation des champs
    if (!pseudo || !motDePasse) {
      Alert.alert("Erreur", "Veuillez entrer un pseudo et un mot de passe");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/auth/connexion", { 
        pseudo,
        motDePasse
      });
      
      console.log("Réponse du serveur:", response.data);
      
      // Stockage des informations utilisateur et du token dans le contexte
      await login({
        user: response.data.utilisateur,
        token: response.data.token
      });
      
      Alert.alert("Connexion réussie", `Bienvenue ${response.data.utilisateur.pseudo} !`);
      navigation.navigate("MainTabs");
    } catch (error) {
      console.error("Erreur de connexion:", error.response?.data || error.message);
      
      // Message d'erreur approprié selon le type d'erreur
      if (error.response?.status === 401) {
        Alert.alert("Erreur", "Identifiants incorrects");
      } else {
        Alert.alert(
          "Erreur de connexion", 
          error.response?.data?.message || "Problème de connexion au serveur"
        );
      }
    } finally {
      setLoading(false);
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
          autoCapitalize="none"
          editable={!loading}
        />
        <TextInput
          style={styles.champ}
          placeholder="Entrez votre mot de passe"
          value={motDePasse}
          onChangeText={setMotDePasse}
          secureTextEntry={true}
          editable={!loading}
        />
        
        <TouchableOpacity 
          style={[styles.bouton, loading && styles.boutonDesactive]} 
          onPress={handleConnexion}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.texteBouton}>Se connecter</Text>
          )}
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.bouton} 
          onPress={() => navigation.navigate("Inscription")}
          disabled={loading}
        >
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
  boutonDesactive: {
    backgroundColor: "#cccccc",
    borderColor: "#999999",
  },
  texteBouton: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default Connexion;