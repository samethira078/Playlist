<template>
      <v-app>
          <Navbar :key="forceRerender"/>
          <v-main class="grey darken-3">
<!--              <transition mode="out-in"-->
<!--              enter-active-class="animate__animated animate__fadeIn"-->
<!--              leave-active-class="animate__animated animate__fadeOut">-->
                  <router-view v-on:changeNavbar="updateNavbar()" style="margin-left: 110px"></router-view>
<!--              </transition>-->
          </v-main>
      </v-app>
</template>

<script>

import Navbar from "@/components/Navbar";

export default {
  name: 'App',
  components: {
      Navbar,
  },
  data(){
      return{
          forceRerender: 0,
      }
  },
    methods: {
        updateNavbar() {
            this.forceRerender += 1
        }
    }
};
</script>
