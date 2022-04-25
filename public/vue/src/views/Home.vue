<template>
      <div>
          <Header />
          <Login />
          <Register />
      </div>
</template>

<script>
/*Assign components*/
import Login from "@/components/Login";
import Register from "@/components/Register";
import Header from "@/components/Header";
export default {
    name: "Home",
    components: {Login, Register, Header}
}
</script>

<style scoped>

</style>
