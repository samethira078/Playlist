<template>
<!--    Navbar left side of page-->
    <nav>
        <v-navigation-drawer fixed class=" grey darken-4" width="100" permanent>
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title class="mb-12 mt-5">
                        <v-img contain src="/images/logo.png">
                        </v-img>
                    </v-list-item-title>
                    <div v-if="token === null">
                        <v-list-item-title class="mt-3">
                            <v-btn text :to="{name: 'Login'}"><v-icon style="color: #5a8f49" large>mdi-login-variant
                            </v-icon></v-btn>
                            <p class="text-center grey--text mr-4">Login</p>
                        </v-list-item-title>
                        <v-list-item-title class="mt-3">
                            <v-btn text :to="{name: 'Register'}"><v-icon style="color: #5a8f49" large>mdi-account-plus
                            </v-icon></v-btn>
                            <p class="text-center grey--text mr-4">Sign Up {{token}}</p>
                        </v-list-item-title>
                    </div>

                    <div>
                        <v-list-item-title class="mt-3">
                            <v-btn text :to="{name: 'Music'}"><v-icon style="color: #5a8f49"  class="" large>mdi-music
                            </v-icon></v-btn>
                            <p class="text-center grey--text">Music</p>
                        </v-list-item-title>
                        <v-list-item-title class="mt-3">
                            <v-icon style="color: #5a8f49"  class="ml-4" large>mdi-playlist-music
                            </v-icon>
                            <p class="text-center grey--text">Playlists</p>
                        </v-list-item-title>
                        <v-list-item-title class="mt-3">
                            <v-icon style="color: #5a8f49"  class="ml-4" large>mdi-cog
                            </v-icon>
                            <p class="text-center grey--text">Settings</p>
                        </v-list-item-title>
                    </div>
                </v-list-item-content>
            </v-list-item>
        </v-navigation-drawer>
    </nav>
</template>

<script>
export default {
    name: "Navbar",
    data(){
        return{
          token: localStorage.getItem('token')
        }
    },
    watch:{

    }
}
</script>

<style scoped>

</style>
