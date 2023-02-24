import axios from 'axios';
import authHeader from './authHeader';

const API_URL = 'http://localhost:8080/api/test/';


class UserService {
  
  getUserBoard() {
    return axios.get(API_URL + 'user', { headers: authHeader() });
  }

}

export default new UserService();