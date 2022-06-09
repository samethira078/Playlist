<template>
    <div v-on:addSong="addSong(song)">
        <v-btn @click="create_playlist_dialog = !create_playlist_dialog">
            CREATE PLAYLIST
        </v-btn>
        <h2 class="ma-4">Playlists
        </h2>
        <v-row class="ml-1">
            <v-col v-for="list in $store.state.playlists" :key="list.id" cols="12" md="4" sm="6" xs="6">
                <v-card>
                    <v-card-title>
                        {{list.name}}
                        <v-btn v-if="song" @click="addToPlaylist(list.id)" text class="orange--text">
                            Add to playlist
                        </v-btn>
                    </v-card-title>
                    <v-card-actions>
                        <v-btn @click="viewPlaylist(list.id)" text class="green--text">
                            View playlist
                        </v-btn>
                        <v-btn text class="red--text">
                            Delete playlist
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
        <h2 class="ma-4">Unsaved playlists</h2>
        <v-row class="ml-1">
            <v-col v-for="list in $store.state.temp_playlists" :key="list.id" cols="12" md="4" sm="6" xs="6">
                <v-card>
                    <v-card-title>
                        {{list.name}}
                        <v-btn v-if="song" @click="addToPlaylistTemp(list.id)" text class="orange--text">
                            Add to playlist
                        </v-btn>
                    </v-card-title>
                    <v-card-actions>
                        <v-btn @click="viewPlaylistTemp(list.id)" text class="green--text">
                            View playlist
                        </v-btn>
                        <v-btn text class="red--text">
                            Delete playlist
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
                        Edit your playlist
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
                        Edit your playlist
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
                    <v-btn @click="createPlaylist()" color="primary" >
                        Add to playlist
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
            songs: [],
            error_text: '',
            playlist_name: '',
            snackbar: true,
            temp_playlist_id: null,
            playlist_id_temp: 1,
            error_dialog: false,
            remove_song_playlist: '',
            remove_song: []
        }
    },
    methods:{
        addToPlaylistTemp(id){
            let exists = this.$store.state.temp_playlists[id].songs.some(el => el.song_id === this.song.id);
            if(exists){
                this.error_text = "This song already exists!";
                return this.error_dialog = true;
            }
            this.$store.state.temp_playlists[id].songs.push({song_id: this.song.id, name: this.song.name, length: this.song.length})
            console.log(this.$store.state.temp_playlists[id])
        },
        removeTempSong(id){
            this.remove_song.push(id);
            // console.log(this.$store.state.temp_playlists[this.temp_playlist_id].songs[0].song_id)

        },
        removeTempSongEntirely(){
            for(let i of this.remove_song){
                this.$store.state.temp_playlists[this.temp_playlist_id].songs.splice(this.$store.state.temp_playlists[this.temp_playlist_id].songs.findIndex(({song_id}) => song_id == i), 1);
            }
            this.songs_temp_dialog = false;
            this.remove_song = [];
        },
        viewPlaylistTemp(id){
            this.temp_playlist_id = id;
            this.remove_song = []
            this.songs_temp_dialog = !this.songs_temp_dialog;
            this.songs = this.$store.state.temp_playlists[id]
            console.log(this.songs)
        },



      grabUserPlaylist(){
          this.$store.dispatch('getPlaylist').then(response => {
              console.log(response)
          });
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
      createPlaylist(){
        if(this.$store.state.token){
            this.$store.dispatch('createPlaylist', this.playlist_name).then(() => {
                let exists = this.$store.state.temp_playlists.some(el => el.name === this.playlist_name);
                if(exists){
                    this.error_text = "This playlist already exists!";
                    return this.error_dialog = true;
                }
                this.$store.state.temp_playlists.push({id: this.$store.state.playlist_id_temp,name: this.playlist_name, 'songs': []})
                this.$store.state.playlist_id_temp = this.$store.state.playlist_id_temp + 1;
                this.create_playlist_dialog = false;
            }).catch(() => {
                this.error_text = "This playlist already exists!";
                this.error_dialog = true;
            });
        } else {
            let exists = this.$store.state.temp_playlists.some(el => el.name === this.playlist_name);
            if(exists){
                this.error_text = "This playlist already exists!";
                return this.error_dialog = true;
            }
            this.$store.state.temp_playlists.push({id: this.$store.state.playlist_id_temp,name: this.playlist_name, 'songs': []})
            this.$store.state.playlist_id_temp = this.$store.state.playlist_id_temp + 1;
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
              this.songs_dialog = !this.songs_dialog;
          })
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
