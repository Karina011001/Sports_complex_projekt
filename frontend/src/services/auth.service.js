
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/auth'; 

class AuthService {
  async signup(eesnimi, perekonnanimi, telNr, email, password, rollId) { 
    console.log("AuthService: Saadan registreerimistaotluse andmetega:", { eesnimi, perekonnanimi, telNr, email, password, rollId });
    return axios.post(API_BASE_URL + '/signup', {
      eesnimi: eesnimi,
      perekonnanimi: perekonnanimi,
      telNr: telNr,
      email: email,
      password: password,
      RollID: rollId 
    });
  }

  async signin(email, password) {
    console.log("AuthService: Saadan sisselogimistaotluse andmetega:", { email, password: '***' });
    const response = await axios.post(API_BASE_URL + '/signin', {
      email,
      password: password,
    });
    if (response.data.accessToken) {
      localStorage.setItem('user', JSON.stringify(response.data));
    }
    return response.data;
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    return JSON.parse(localStorage.getItem('user'));
  }
  async getAllRoles() {
    return axios.get(API_BASE_URL + '/roles'); 
  }
}

export default new AuthService();
