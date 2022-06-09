<template>
    <div class="d-flex align-center justify-center" style="height: 100vh;">
        <!--        Login title-->
        <v-card color="#F5F5F5" width="500">
            <v-alert v-if="error[0].status"
                     type="error"
            >{{ error[0].message }}</v-alert>
            <v-card-title >
                Sign Up
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
                    <v-text-field
                        v-model="password_confirm"
                        label="Confirm Password"
                        required
                    ></v-text-field>
                </v-form>
                <v-btn @click="register_user" color="teal lighten-1" width="100%">
                    Create an account
                </v-btn>
            </v-card-subtitle>
            <v-card-actions class="justify-center align-center text-center">
                <v-btn :to="{name: 'Login'}" class="" small text>Member? Click here</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "Register",
    data(){
        return{
            //Form field values
            name: '',
            password: '',
            password_confirm: '',
            error: [
                {
                    message: '',
                    status: false
                },
            ]
        }
    },
    methods: {
        register_user(){
            this.$store.dispatch('register', [this.name, this.password, this.password_confirm]).
            then(response => {
                console.log(response)
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
