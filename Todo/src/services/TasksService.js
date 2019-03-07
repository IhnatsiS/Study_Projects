import axios from 'axios'

const url = 'http://localhost:8081/';

export default {
  fetchUserData() {
    return axios.get(`${url}user`);
  },
  fetchExactUserData(id) {
    return axios.get(`${url}user/${id}`);
  },
  authUser(authData) {
    return axios.post(`${url}auth`, authData);
  },
  signUpUser(signUpData) {
    return axios.post(`${url}signup`, signUpData);
  },
  addTask(newTaskData) {
    return axios.put(`${url}task`, newTaskData);
  }
}


