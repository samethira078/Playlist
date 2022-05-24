<template>
    <div>
        <v-card color="#F5F5F5" width="200">
<!--            Title box-->
            <v-card-title class="justify-center">
                Registeren
            </v-card-title>

            <v-card-subtitle>
<!--                Form data-->
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
                        label="Re-enter password"
                        required
                    ></v-text-field>
                </v-form>
                <v-btn color="primary" width="100%">
                    Sign Up
                </v-btn>
            </v-card-subtitle>
            <v-card-actions class="justify-center align-center text-center">
                <v-btn class="" small text>User? Click here</v-btn>
            </v-card-actions>
        </v-card>
    </div>
</template>

<script>
export default {
    name: "Register",
    data(){
        return{
            //Form input fields
            name: '',
            password: '',
            password_confirm: '',
        }
    }
}
</script>

<style scoped>

</style>
