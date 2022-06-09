import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'


Vue.use(Vuex)

axios.defaults.baseURL = 'http://juke.nl/api/'
axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");

export default new Vuex.Store({
  state: {
      //Token
      token: localStorage.getItem('token'),
      temp_playlists: [],
      playlists: [],
      playlist_id_temp: 0,
  },
  mutations: {
      saveToken(state, token) {
          //Save token
          localStorage.setItem('token', token.token);
      },
      savePlaylist(state, data) {
          //Save token
          state.playlists = data;
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
      getSongs(){
        return new Promise((resolve, reject) => {
            axios.get('songs/all').then(response => {resolve(response.data)
            }).catch(() => {
                reject(reject)
            })
        })
      },
      getPlaylist(context){
          return new Promise((resolve, reject) => {
              axios.get('user/playlist').then(response => {
                  context.commit('savePlaylist', response.data);
                  resolve(response.data)
              }).catch(() => {
                  reject(reject)
              })
          })
      },
      savePlaylist(context, data){
          return new Promise((resolve, reject) => {
              //Post request
              axios.post('/user/playlist/save', {
                  playlist: data,
                  //Result
              }).then(response => {
                  resolve(response.data)
              }).catch(response =>{
                  reject(response)
              })
          })
      },
      viewPlaylist(context, data){
          return new Promise((resolve, reject) => {
              //Post request
              axios.post('/user/playlist/songs', {
                  id: data,
                  //Result
              }).then(response => {
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
      removeSongs(context, data){
          return new Promise((resolve, reject) => {
              //Post request
              axios.post('user/remove/song', {
                  songs: data[0],
                  playlist: data[1]
              }).then(response => {
                  resolve(response.data)
              }).catch(response =>{
                  reject(response)
              })
          })
      },
      removePlaylist(context, data){
          return new Promise((resolve, reject) => {
              //Post request
              axios.post('user/playlist/remove', {
                  id: data
              }).then(response => {
                  resolve(response.data)
              }).catch(response =>{
                  reject(response)
              })
          })
      },
      createPlaylist(context, data){
          return new Promise((resolve, reject) => {
              //Post request
              axios.post('user/playlist/create', {
                  name: data,
              }).then(response => {
                  resolve(response.data)
              }).catch(response =>{
                  reject(response)
              })
          })
      },
      addToPlaylist(context, data){
          return new Promise((resolve, reject) => {
              //Post request
              axios.post('user/add/song', {
                  playlist_id: data[0],
                  song_id: data[1],
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
  },
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
})
