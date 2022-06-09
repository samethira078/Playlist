<template>
    <div>
        <div>
<!--        LIST ALL GENRES-->
        <v-row class="ma-5">
            <v-col v-for="genre in genres" :key="genre" cols="12" md="4" sm="6" xs="6">
                <v-card>
                    <v-card-title class="text-center justify-center align-center">
                        <v-btn @click="artists_list(genre)" x-large text class="align-center justify-center text-center">
                            {{genre}}
                        </v-btn>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
        <v-row justify="center">
<!--            SINGERS OF GENRE-->
            <v-dialog
                persistent
                v-model="artist_dialog"
                max-width="600"
            >
            <template>
                <v-card>
                    <v-card-title>
                        Artists
                    </v-card-title>
                    <p v-for="artist in artists" :key="artist.id">
                        <v-btn @click="selectedSong(artist.artist_id)" class="mt-1 mb-1 ml-2 green--text darken-4" text>{{artist.artist}}</v-btn>
                    </p>
                    <v-card-actions>
                        <v-btn @click="artist_dialog = !artist_dialog" text>
                            Close
                        </v-btn>
                    </v-card-actions>
                </v-card>
            </template>
            </v-dialog>
<!--            SONGS OF ARTIST-->
            <v-dialog
                v-model="songs_dialog"
                max-width="400"
            >
                <template>
                    <v-card>
                        <v-card-title>
                            Songs of {{songs.artist}}
                        </v-card-title>
                        <p v-for="artist in songs.songs" :key="artist.id">
                            <v-btn @click="song_info(artist, songs.artist)" class="mt-1 mb-1 ml-2 red--text darken-4" text>{{artist}}</v-btn>
                        </p>
                        <v-card-actions>
                            <v-btn @click="songs_dialog = !songs_dialog" text>
                                Close
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>
<!--            SONG INFO-->
            <v-dialog
                v-model="song_info_dialog"
                max-width="400"
            >
                <template>
                    <v-card >
                        <v-card-title>
                            {{song.name}}
                        </v-card-title>
                        <p v-if="song.artist" class="ml-6">
                            Singer: {{song.artist.name}}
                        </p>
                        <p v-if="song.artist" class="ml-6">
                            Genre: {{song.genre.name}}
                        </p>
                        <p class="ml-6">
                            Length: {{Math.floor(song.length / 60) + ':' + ('0' + Math.floor(song.length % 60)).slice(-2)}} minutes
                        </p>
                        <v-card-actions>
                            <v-btn @click="song_info_dialog = !song_info_dialog" text>
                                Close
                            </v-btn>
                            <v-btn color="orange" style="float: right" @click="moveToPlaylist(song)">
                                Add to playlist
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </template>
            </v-dialog>
        </v-row>
        </div>
        <v-overlay
            v-model="playlist_dialog"
            class="my-overlay"
        >
            <playlist v-on:backToMusic="cancelSelectedSong()" :song="song"></playlist>
        </v-overlay>
    </div>
</template>

<script>
import Playlist from "@/components/Playlist";
export default {
    name: "Music.vue",
    components: {Playlist},
    data(){
        return{
            media: [],
            genres: [],
            artists: [],
            songs: [],
            forceRerender: 0,
            song: [],
            artist_dialog: false,
            songs_dialog: false,
            song_info_dialog: false,
            playlist_dialog: false,
        }
    },
    methods:{
      getSongs(){
          //Grab all songs merged with genres and artists
          this.$store.dispatch('getSongs').then(response => {
              let temp_genres;
              this.media = response;
              //Grab all genres
              temp_genres = response.map(object => object.genre.name);
              this.genres = [...new Set(temp_genres)];
          })
      },
      cancelSelectedSong(){
          this.artist_dialog =  true;
          this.songs_dialog = true;
          this.song_info_dialog = true;
          this.playlist_dialog = false;
      },
      artists_list(genred){
          this.artists = this.media.filter(({genre}) => genre.name.includes(genred))
          let filtered = []
          for(let row of this.artists){
              if(filtered.find(x => x.artist_id == row.artist_id)){
                  let find = filtered.find(x => x.artist_id == row.artist_id);
                  find.songs.push(row.name)
              } else {
                  filtered.push({artist_id: row.artist_id, artist: row.artist.name, songs: [row.name]})
              }
          }
          this.artists = filtered;
          this.artist_dialog = !this.artist_dialog;
      },
      selectedSong(artist_id){
            this.songs = this.artists.find(x => x.artist_id == artist_id);
            this.songs_dialog = !this.songs_dialog;
        },
      song_info(song, artist){
          this.song = this.media.filter(o => o.name == song && o.artist.name == artist)[0]
          this.song_info_dialog = !this.song_info_dialog
      },
      moveToPlaylist(song){
          this.$emit('addSong', song);
          this.playlist_dialog = !this.playlist_dialog;
          this.artist_dialog =  false;
          this.songs_dialog = false;
          this.song_info_dialog = false;
      }
    },
    beforeMount() {
        this.getSongs();
    }
}
</script>

<style scoped>
.my-overlay >>> .v-overlay__content {
    margin-left: 100px;
    width: 100%;
    height: 100%;
    background-color: #424242;
}
</style>
