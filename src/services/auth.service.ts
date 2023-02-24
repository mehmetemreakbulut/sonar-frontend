import axios from "axios";

const API_URL = "http://localhost:8000/authmngr/";

class AuthService {
  login(username: string, password: string) {
    return axios
      .post(API_URL + "login/", {
        username,
        password
      })
      .then(response => {
        if (response.data.token) {
          localStorage.setItem("user", JSON.stringify(response.data));
        }

        return response.data;
      });
  }

  logout() {
    localStorage.removeItem("user");
    return axios
      .get(API_URL + "logout/")
      .then(response => {
        return response.data;
      });
  }

  register(username: string, email: string, password: string) {
    return axios.post(API_URL + "register/", {
      username,
      email,
      password
    });
  }

  getCurrentUser() {
    const userStr = localStorage.getItem("user");
    if (userStr) return JSON.parse(userStr);

    return null;
  }
}

export default new AuthService();