<template>
    <div v-on:addSong="addSong(song)">
        <v-btn @click="create_playlist_dialog = !create_playlist_dialog">
            CREATE PLAYLIST
        </v-btn>
        <v-btn v-if="!song.name" @click="cancelSelectionManuel()">
            Close playlist
        </v-btn>
        <h2 class="ma-4">Playlists
        </h2>
        <v-row class="ml-1 mr-1">
            <v-col v-for="list in $store.state.playlists" :key="list.id" cols="12" md="6" sm="6" xs="6">
                <v-card>
                    <v-card-title>
                        {{list.name}}
                        <v-btn v-if="song" @click="changeName(list.id)" text class="orange--text">
                            Rename
                        </v-btn>
                        <v-btn v-if="song.name" @click="addToPlaylist(list.id)" text class="orange--text">
                            Add to playlist
                        </v-btn>
                    </v-card-title>
                    <v-card-actions>
                        <v-btn @click="viewPlaylist(list.id)" text class="green--text">
                            View playlist
                        </v-btn>
                        <v-btn @click="removePlaylist(list.id)" text class="red--text">
                            Delete playlist
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <h2 class="ma-4">Unsaved playlists</h2>
        <v-row class="ml-1 mr-1">
            <v-col v-for="list in $store.state.temp_playlists" :key="list.id" cols="12" md="6" sm="6" xs="6">
                <v-card>
                    <v-card-title>
                        {{list.name}}
                        <v-btn v-if="song.name" @click="addToPlaylistTemp(list.id)" text class="orange--text">
                            Add to playlist
                        </v-btn>
                    </v-card-title>
                    <v-card-actions>
                        <v-btn @click="viewPlaylistTemp(list.id)" text class="green--text">
                            View playlist
                        </v-btn>
                        <v-btn @click="removePlaylistTemp(list.id)" text class="red--text">
                            Delete playlist
                        </v-btn>
                        <v-btn @click="savePlaylist(list.id)" text class="blue--text">
                            Save
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog
            v-model="songs_temp_dialog"
            max-width="400"
        >
            <template>
                <v-card v-if="songs_temp_dialog">
                    <v-card-title>
                        Edit your playlist - length: {{total_length}}
                    </v-card-title>
                    <v-card-text>
                        <span v-for="song in songs.songs" :key="song.id">

                        <p v-if="remove_song.indexOf(song.song_id) === -1" class="black--text" style="border-bottom: 1px solid black">
                            {{song.name}}
                            {{Math.floor(song.length / 60) + ':' + ('0' + Math.floor(song.length % 60)).slice(-2)}}
                            <v-btn @click="removeTempSong(song.song_id)" color="red" style="float: right" text small>
                                DELETE
                            </v-btn>
                        </p>
                        </span>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="songs_temp_dialog = !songs_temp_dialog" text color="red" class="ml-9">
                            Cancel
                        </v-btn>
                        <v-btn @click="removeTempSongEntirely()" text color="green" class="ml-15">
                            Save changes
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
        <v-dialog
            v-model="songs_dialog"
            max-width="400"
        >
            <template>
                <v-card v-if="songs_dialog">
                    <v-card-title>
                        Edit your playlist - length: {{total_length}}
                    </v-card-title>
                    <v-card-text>
                        <span v-for="song in songs" :key="song.id">
                        <p v-if="remove_song.indexOf(song.id) === -1" class="black--text" style="border-bottom: 1px solid black">
                            {{song.song[0].name}}
                            {{Math.floor(song.song[0].length / 60) + ':' + ('0' + Math.floor(song.song[0].length % 60)).slice(-2)}}
                            <v-btn @click="removeSong(song.id, song.playlist[0].id)" color="red" style="float: right" text small>
                                DELETE
                            </v-btn>
                        </p>
                        </span>
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="songs_dialog = !songs_dialog" text color="red" class="ml-9">
                            Cancel
                        </v-btn>
                        <v-btn @click="confirmDeleteSong()" text color="green" class="ml-15">
                            Save changes
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </template>
        </v-dialog>
        <v-snackbar
            v-model="snackbar"
            :timeout="-1"
            v-if="song.name"
        >
            Selected song: {{ song.name }}

            <template v-slot:action="{ attrs }">
                <v-btn
                    color="blue"
                    text
                    v-bind="attrs"
                    @click="cancelSelection()"
                >
                    Cancel selection
                </v-btn>
            </template>
        </v-snackbar>
        <v-dialog
            v-model="error_dialog"
            max-width="400"
        >
            <v-card>
                <v-alert
                    dense
                    outlined
                    type="error"
                >
                    {{error_text}}
                </v-alert>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="rename_dialog"
            max-width="400"
        >
            <v-card>
                <v-card-title>
                    Rename playlist
                </v-card-title>
                <v-card-text>
                    <v-form>
                        <v-text-field
                            v-model="rename_name"
                            label="Name"
                            required
                        ></v-text-field>
                    </v-form>
                </v-card-text>
                <v-card-actions>
                    <v-btn @click="changeNameSubmit()" class="primary">
                        Create playlist
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
        <v-dialog
            v-model="create_playlist_dialog"
            max-width="400"
        >
            <v-card>
                <v-card-title>
                    Create playlist
                </v-card-title>
               <v-card-text>
                   <v-form>
                       <v-text-field
                           v-model="playlist_name"
                           label="Name"
                           required
                       ></v-text-field>
                   </v-form>
               </v-card-text>
                <v-card-actions>
                    <v-btn @click="createPlaylist" class="primary">
                        Create playlist
                    </v-btn>
                </v-card-actions>
            </v-card>
        </v-dialog>
    </div>
</template>

<script>
export default {
    name: "Playlist",
    props: {
      song:Object
    },
    data(){
        return{
            songs_dialog: false,
            songs_temp_dialog: false,
            create_playlist_dialog: false,
            rename_dialog: false,
            songs: [],
            error_text: '',
            playlist_name: '',
            rename_name: '',
            playlist_id: null,
            total_length: null,
            snackbar: true,
            // playlist_id_temp: 1,
            error_dialog: false,
            remove_song_playlist: '',
            remove_song: []
        }
    },
    methods:{
        addToPlaylistTemp(id){
            let indexOfStevie = this.$store.state.temp_playlists.findIndex(i => i.id === id);
            let exists = this.$store.state.temp_playlists[indexOfStevie].songs.some(el => el.song_id === this.song.id);
            if(exists){
                this.error_text = "This song already exists!";
                return this.error_dialog = true;
            }
            this.$store.commit('addSongToTempPlaylist', [this.song, id])
        },
        changeName(id){
            this.playlist_id = id;
            this.rename_dialog = true;
        },
        changeNameSubmit(){
            this.$store.dispatch('changeName', [this.playlist_id,this.rename_name]).then(() => {
                this.grabUserPlaylist();
            });
            this.rename_dialog = false;
        },
        removeTempSong(id){
            this.remove_song.push(id);
            console.log(this.$store.state.temp_playlists[this.temp_playlist_id])

        },
        removeTempSongEntirely(){
            for(let i of this.remove_song){
                console.log(this.$store.state.temp_playlists[0].songs)
                let indexOfStevie = this.$store.state.temp_playlists.findIndex(l => l.songs.song_id === i);
                console.log(indexOfStevie);
                // this.$store.state.temp_playlists[indexOfStevie].songs.splice(this.$store.state.temp_playlists[this.temp_playlist_id].songs.findIndex(({song_id}) => song_id == i), 1);
            }
            this.songs_temp_dialog = false;
            this.remove_song = [];
        },
        removePlaylist(id){
            this.$store.dispatch('removePlaylist', id).then(() => {
                this.grabUserPlaylist();
            });
        },
        viewPlaylistTemp(id){
            let indexOfStevie = this.$store.state.temp_playlists.findIndex(i => i.id === id);
            this.temp_playlist_id = id;
            this.remove_song = []
            this.songs_temp_dialog = true;
            this.songs = this.$store.state.temp_playlists[indexOfStevie]
            let length = this.songs.songs.map(({length}) => length)
            let sum = length.reduce(function(a, b){
                return a + b;
            }, 0);
            this.total_length = Math.floor(sum / 60) + ':' + ('0' + Math.floor(sum % 60)).slice(-2)
        },
        savePlaylist(id){
            if(this.$store.state.temp_playlists[0].songs.length > 0){
                let indexOfStevie = this.$store.state.temp_playlists.findIndex(i => i.id === id);
                this.$store.dispatch('savePlaylist', this.$store.state.temp_playlists[indexOfStevie]).then(() => {
                    this.$store.state.temp_playlists.splice(indexOfStevie, 1);
                    this.grabUserPlaylist();
                }).catch(() => {
                    this.$router.push({ name: 'Login' })
                });
            } else {
                this.error_text = "This playlist is empty!";
                return this.error_dialog = true;
            }
        },
      grabUserPlaylist(){
          this.$store.dispatch('getPlaylist').then(response => {
              console.log(response)
          });
      },
      removePlaylistTemp(id){
          this.$store.commit('removeTempPlaylist', id)
      },
      confirmDeleteSong(){
          if(this.remove_song.length === 0){
              return this.songs_dialog = false;
          }
          this.$store.dispatch('removeSongs', [this.remove_song, this.remove_song_playlist]).then(response => {
              console.log(response)
              this.songs_dialog = false;
          });
      },
      //  Creating a playlist
      createPlaylist(){
        if(this.$store.state.token){
            this.$store.dispatch('createPlaylist', this.playlist_name).then(() => {
                let exists = this.$store.state.temp_playlists.some(el => el.name === this.playlist_name);
                if(exists){
                    this.error_text = "This playlist already exists!";
                    return this.error_dialog = true;
                }
                this.$store.commit('createTempPlaylist', this.playlist_name)

                this.create_playlist_dialog = false;
            }).catch(() => {
                this.error_text = "This playlist already exists!";
                this.error_dialog = true;
            });
        } else {
            let exists = this.$store.state.temp_playlists.some(el => el.name === this.playlist_name);
            let exists_real = this.$store.state.playlists.some(el => el.name === this.playlist_name);
            if(exists || exists_real){
                this.error_text = "This playlist already exists!";
                return this.error_dialog = true;
            }
            this.$store.commit('createTempPlaylist', this.playlist_name)
            this.create_playlist_dialog = false;
        }
      },
      removeSong(id, playlist){
          this.remove_song_playlist = playlist
          this.remove_song.push(id);
      },
      addToPlaylist(id){
          this.$store.dispatch('addToPlaylist', [id, this.song.id]).catch(() => {
              this.error_text = "This song already exists in the playlist!";
              this.error_dialog = true;
          })
      },
      viewPlaylist(id){
          this.remove_song = []

          this.$store.dispatch('viewPlaylist', id).then(response => {
              console.log(response)
              this.songs = response;
              let crop = this.songs.map(({song}) => song)
              let length = []
              for(let i of crop){
                  length.push(i[0].length)
              }
              let sum = length.reduce(function(a, b){
                  return a + b;
              }, 0);
              this.total_length = Math.floor(sum / 60) + ':' + ('0' + Math.floor(sum % 60)).slice(-2)
              this.songs_dialog = !this.songs_dialog
          })
      },
      cancelSelectionManuel(){
          this.$emit('backToMusic', 2)
          this.snackbar = false;
      },
      cancelSelection(){
          this.snackbar = false;
          this.song = [];
          this.$emit('backToMusic', true)
      }
    },
    beforeMount() {
        this.$emit('changeNavbar');
        this.songs_dialog =  false;
        if(localStorage.getItem('token')){
            this.grabUserPlaylist();
        }
    }
}
</script>

<style scoped>

</style>
