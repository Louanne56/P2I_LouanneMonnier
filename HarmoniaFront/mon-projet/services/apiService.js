import axios from 'axios';
import { API_URL } from './apiConfig';

export const getProgressions = async (tonalite, mode, style = null) => {
  let url = `${API_URL}/progressions/filtred?tonalite=${tonalite}&mode=${mode}`;
  if (style) url += `&style=${style}`;

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Erreur API: ${response.status}`);
  return await response.json();
};

export const getUserFavorites = async (userId, token) => {
  const response = await axios.get(`${API_URL}/suites-favorites/user/${userId}`, {
    headers: { Authorization: `Bearer ${token}` }
  });
  return response.data.map(fav => fav.progressionAccordsId);
};

export const toggleFavoriteAPI = async (userId, progressionId, token, isFavorite) => {
  if (isFavorite) {
    await axios.delete(`${API_URL}/suites-favorites/user/${userId}/progression/${progressionId}`, {
      headers: { Authorization: `Bearer ${token}` }
    });
  } else {
    await axios.post(`${API_URL}/suites-favorites`, {
      userId: userId,
      progressionAccordsId: progressionId
    }, {
      headers: { Authorization: `Bearer ${token}` }
    });
  }
};
