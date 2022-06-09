<template>
    <div class="d-flex align-center justify-center" style="height: 100vh;">
<!--        Login title-->
        <v-card color="#F5F5F5" width="500">
            <v-alert v-if="error[0].status"
                type="error"
            >{{ error[0].message }}</v-alert>
            <v-card-title >
                Login
            </v-card-title>

<!--            Form data-->
            <v-card-subtitle>
                <v-form>
                    <v-text-field
                        v-model="name"
                        label="Username"
                        required
                    ></v-text-field>
                    <v-text-field
                        v-model="password"
                        label="Password"
                        required
                    ></v-text-field>
                </v-form>
                <v-btn @click="login_user" color="teal lighten-1" width="100%">
                    Login
                </v-btn>
            </v-card-subtitle>
            <v-card-actions class="justify-center align-center text-center">
                <v-btn :to="{name: 'Register'}" class="" small text>New? Click here</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "Login",
    data(){
        return{
            //Form field values
            name: '',
            password: '',
            error: [
                {
                    message: '',
                    status: false
                },
            ]
        }
    },
    methods: {
        login_user(){
            //Request to use store action functionality
            this.$store.dispatch('login', [this.name, this.password]).
            //Correct info
            then(response => {
                //Check if token is saved in browser storage
                // localStorage.setItem('token', response);
                if(response.token === localStorage.getItem('token')){
                    this.$router.push({ name: 'Home' })
                    this.$emit('changeNavbar');
                } else {
                    localStorage.removeItem('token')
                    this.error[0].status = true;
                    this.error[0].message = 'Error. Try again!'
                }
            }).
            catch(response => {
                //Error
                this.error[0].status = true;
                this.error[0].message = response.response.data.message.split('.')[0]
                console.log(response.response.data)
            })
        }
    }
}
</script>

<style scoped>

</style>
