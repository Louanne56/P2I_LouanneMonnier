import React from 'react';
import { TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { StyleSheet } from 'react-native';

const BoutonFavoris = ({ isFavorite, onToggle }) => (
  <TouchableOpacity onPress={onToggle} style={styles.heartIconContainer}>
    <Icon
      name={isFavorite ? 'heart' : 'heart-o'}
      size={20}
      color={isFavorite ? 'red' : 'gray'}
    />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  heartIconContainer: { position: 'absolute', top: 10, right: 10, zIndex: 1 },
});

export default BoutonFavoris;
