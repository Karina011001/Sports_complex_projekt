import api from './api'; 

const API_BASE_URL = 'http://localhost:5000/api'; 
const USER_API_URL = `${API_BASE_URL}/admin/users`; 

class UserService {
  
  getAllUsers() {
    return api.get(USER_API_URL);
  }
  createUser(userData) {
    return api.post(USER_API_URL, userData); 
  }
  updateUser(id, userData) {
    return api.put(`${USER_API_URL}/${id}`, userData); 
  }
  deleteUser(id) {
    return api.delete(`${USER_API_URL}/${id}`); 
  }
}

export default new UserService();
