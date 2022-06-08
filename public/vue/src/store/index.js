import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'


Vue.use(Vuex)

axios.defaults.baseURL = 'http://juke.nl/api/'
axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");

export default new Vuex.Store({
  state: {
      //Token
      token: localStorage.getItem('token'),

  },
  mutations: {
      saveToken(state, token) {
          //Save token
          localStorage.setItem('token', token.token);
      },
  },
  actions: {
      //User Login
      login(context, data){
          return new Promise((resolve, reject) => {
              //Post request
              axios.post('user/validate', {
                  name: data[0],
                  password: data[1]
              //Result
              }).then(response => {
                  context.commit('saveToken', response.data);
                  resolve(response.data)
              }).catch(response =>{
                  reject(response)
              })
          })
      },
      register(context, data){
          return new Promise((resolve, reject) => {
              //Post request
              axios.post('user/register', {
                  name: data[0],
                  password: data[1],
                  password_confirmation: data[2]
                  //Result
              }).then(response => {
                  resolve(response.data)
              }).catch(response =>{
                  reject(response)
              })
          })
      },
  },
  modules: {
  }
})
