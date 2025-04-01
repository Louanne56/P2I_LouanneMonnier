import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal, Image } from 'react-native';
import BoutonFavoris from './BoutonFavoris';

const ProgressionCard = ({ progression, isFavorite, onToggleFavorite }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedAccord, setSelectedAccord] = useState(null);

  const handleAccordPress = (accord) => {
    setSelectedAccord(accord);
    setModalVisible(true);
  };

  return (
    <View style={styles.progressionCard}>
      <BoutonFavoris
        isFavorite={isFavorite}
        onToggle={onToggleFavorite}
        accessibilityLabel={`Marquer ${progression.nom} comme favori`}
      />
      <Text style={styles.progressionName}>{progression.nom}</Text>

      {progression.accords.length > 0 && (
        <View style={styles.accordsList}>
          {progression.accords.map((accord, index) => (
            <TouchableOpacity key={index} style={styles.accordBox} onPress={() => handleAccordPress(accord)}>
              <Text style={styles.accordText}>{accord}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}

      {/* Modal pour afficher l'image de l'accord */}
      <Modal visible={modalVisible} transparent={true} animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            {selectedAccord && (
              <Image
              source={require(`../assets/images/${"G7"}.png`)} // Si les images sont en local// Si les images sont en ligne
                // 
                style={styles.accordImage}
                resizeMode="contain"
              />
            )}
            <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
              <Text style={styles.closeButtonText}>Fermer</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  progressionCard: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    position: 'relative',
  },
  progressionName: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    textAlign: 'left',
  },
  accordsList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  accordBox: {
    backgroundColor: '#d9b3ff',
    borderRadius: 4,
    paddingVertical: 8,
    paddingHorizontal: 12,
    alignItems: 'center',
    justifyContent: 'center',
    width: 60,
    height: 45,
    marginBottom: 10,
  },
  accordText: {
    color: 'white',
    fontWeight: '500',
    textAlign: 'center',
    fontSize: 14,
  },
  // Styles pour le Modal
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  accordImage: {
    width: 200, // Ajuste selon la taille de tes images
    height: 200,
  },
  closeButton: {
    marginTop: 15,
    backgroundColor: '#d9b3ff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ProgressionCard;
