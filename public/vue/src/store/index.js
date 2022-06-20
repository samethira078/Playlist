import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import createPersistedState from 'vuex-persistedstate'


Vue.use(Vuex)
//AXIOS DEFAULT ROUTES
axios.defaults.baseURL = 'http://juke.nl/api/'
axios.defaults.headers.common["Authorization"] = "Bearer " + localStorage.getItem("token");

export default new Vuex.Store({
    //SAVE VUEX STATES IN SESSION STORAGE
    plugins: [createPersistedState({
        storage: window.sessionStorage,
    })],
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
      //SAVE ON RELOAD
      savePlaylist(state, data) {
          //Save token
          state.playlists = data;
      },
      //SAVE ON CREATION ON RELOAD
      createTempPlaylist(state, data){
          state.temp_playlists.push({id: state.playlist_id_temp,name: data, 'songs': []})
          state.playlist_id_temp +=1;
      },
      //REMOVE TEMP PLAYLIST ON RELOAD
      removeTempPlaylist(state, data){
          let index = state.temp_playlists.findIndex(i => i.id === data);
          state.temp_playlists.splice(index, 1);
      },
      //ADD SONG ON RELOAD
      addSongToTempPlaylist(state, data){
          console.log(data)
          let index = state.temp_playlists.findIndex(i => i.id === data[1]);
          state.temp_playlists[index].songs.push({song_id: data[0].id, name: data[0].name, length: data[0].length})
      },
      //REMOVE SONG OF TEMPLIST ON RELOAD
      removeTempPlaylistSongs(state, data){
          console.log(state.temp_playlists[data[0]].songs)
          console.log(data[1])
          // let index = state.temp_playlists.findIndex(i => i.id === data[0]);
          for(const song of data[1]){
             state.temp_playlists = state.temp_playlists[data[0]].songs.filter(selected => selected.song_id !== song);
          }
          console.log(state.temp_playlists)
      }
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
      //GRAB SONGS FROM DB
      getSongs(){
        return new Promise((resolve, reject) => {
            axios.get('songs/all').then(response => {resolve(response.data)
            }).catch(() => {
                reject(reject)
            })
        })
      },
      //GET SPECIFIC PLAYLIST OF USER
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
      //DATA PLAYLIST
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
      //CHANGE NAME OF PLAYLIST
      changeName(context, data){
          return new Promise((resolve, reject) => {
              //Post request
              axios.post('/user/playlist/rename', {
                  id: data[0],
                  name: data[1]
                  //Result
              }).then(response => {
                  resolve(response.data)
              }).catch(response =>{
                  reject(response)
              })
          })
      },
      //VIEW PLAYLISTS
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
      //REGISTER AN USER
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
      //REMOVE A SONG FROM A PLAYLIST
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
      //REMOVE PLAYLIST
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
      //CREATE PLAYLIST TO DB
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
      //ADD SONGS TO PLAYLIST
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
})
