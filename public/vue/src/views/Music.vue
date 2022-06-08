<template>
    <div>
<!--        LIST ALL GENRES-->
        <v-row class="ma-5">
            <v-col v-for="genre in genres" :key="genre" cols="12" md="4" sm="6" xs="6">
                <v-card>
                    <v-card-title class="text-center justify-center align-center">
                        <v-btn @click="artists(genre)" x-large text class="align-center justify-center text-center">
                            {{genre}}
                        </v-btn>
                    </v-card-title>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script>
export default {
    name: "Music.vue",
    data(){
        return{
            media: [],
            genres: [],
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
              console.log(temp_genres);
          })
      },
      artists(genre){
          alert(genre)
      }
    },
    beforeMount() {
        this.getSongs();
    }
}
</script>

<style scoped>

</style>
