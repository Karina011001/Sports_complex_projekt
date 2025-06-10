// frontend/src/services/trainer.service.js
import axios from 'axios'; // Используем axios напрямую для публичных запросов

const API_URL = 'http://localhost:5000/'; // Базовый URL вашего бэкенда

class TrainerService {
  getAllTrainers() {
    // Этот маршрут public, поэтому без токена
    // Добавляем "api/" здесь, так как это прямой axios запрос к бэкенду
    return axios.get(API_URL + 'api/public/trainers');
  }

  // Здесь могут быть и другие методы для тренеров, если они будут добавлены (например, для админа)
  // getTrainerById(id) { ... }
  // createTrainer(data) { ... }
  // updateTrainer(id, data) { ... }
  // deleteTrainer(id) { ... }
}

export default new TrainerService();