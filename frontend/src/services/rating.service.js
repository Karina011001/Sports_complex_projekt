import api from './api'; 
import axios from 'axios'; 

const RATING_API_URL = '/api/ratings'; 

class RatingService {
  createRating(treenerId, ratingValue, comment) {
    return api.post(RATING_API_URL, {
      TreenerID: treenerId,
      Rating: ratingValue,
      Kommentaar: comment
    });
  }
  getTrainerRatings(trainerId) {
    return axios.get(`http://localhost:5000/api/trainers/${trainerId}/ratings`);
  }
}

export default new RatingService();