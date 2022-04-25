<template>
      <v-app>
          <Navbar/>
          <v-main class="grey darken-3">
              <router-view style="margin-left: 110px"></router-view>
          </v-main>
      </v-app>
</template>

<script>

import Navbar from "@/components/Navbar";

export default {
  name: 'App',
  components: {
      Navbar
  },
  data: () => ({
    //
  }),
};
</script>
