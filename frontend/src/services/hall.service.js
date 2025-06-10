import api from './api'; 
import axios from 'axios'; 

const API_BASE_URL = 'http://localhost:5000/api'; 
const ADMIN_HALL_API_URL = `${API_BASE_URL}/admin/halls`; 
const PUBLIC_HALL_API_URL = `${API_BASE_URL}/public/halls`; 

class HallService {
  getAllHalls() {
    return api.get(ADMIN_HALL_API_URL);
  }
  getAllHallsPublic() {
    return axios.get(PUBLIC_HALL_API_URL);
  }
  createHall(hallData) {
    return api.post(ADMIN_HALL_API_URL, hallData);
  }

  updateHall(id, hallData) {
    return api.put(`${ADMIN_HALL_API_URL}/${id}`, hallData);
  }

  deleteHall(id) {
    return api.delete(`${ADMIN_HALL_API_URL}/${id}`);
  }
}

export default new HallService();