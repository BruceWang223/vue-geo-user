<template>
    <div class="container login">
        <form @submit.prevent='login' class="card-panel">
            <h2 class="center deep-purple-text">LogIn</h2>
            <div class="field">
                <label for="email">Email: </label>
                <input type="email" name="email" v-model='email'>
            </div>
            <div class="field">
                <label for="password">Password: </label>
                <input type="password" name="password" v-model='password'>
            </div>
            <p class = 'red-text center' v-if='feedback'>{{ feedback }}</p>
            <div class="field">
                <button class="btn deep-purple">LogIn</button>
            </div>
        </form>
    </div>
</template>

<script>
import firebase from 'firebase'
export default {
    name: 'login',
    data(){
        return{
            email: null,
            password: null,
            feedback: null
        }
    },
    methods: {
        login(){
            if(this.email && this.password){
                firebase.auth().signInWithEmailAndPassword(this.email, this.password)
                .then(user => {
                    this.$router.push({path : '/'});
                }).catch(error => {
                    this.feedback = error.message;
                })
            }
            else{
                this.feedback = 'Please fill in both fields'
            }
        }
    }
}
</script>

<style>
    .login{
        max-width: 500px;
        margin-top: 60px;
    }

    .login .field{
        margin-bottom: 10px;
    }
</style>
