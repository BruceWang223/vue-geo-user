<template>
    <div class="navbar">
        <nav class="deep-purple darken-1">
            <div class="container">
                <router-link :to='{ path: "/"}' class="brand-logo left">Geo-Users</router-link>
                <ul class="right">
                    <li v-if='!user' ><router-link :to = '{path: "/signup"}'>SignUp</router-link></li>
                    <li v-if='!user' ><router-link :to = '{path: "/login"}'>LogIn</router-link></li>
                    <li v-if='user'><a>{{ id }}</a></li>
                    <li v-if='user'><a @click="logout">LogOut</a></li>
                </ul>
            </div>
        </nav>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
    name: 'Navbar',
    data(){
        return{
            user: null,
            id:null
        }
    },
    methods: {
        logout(){
            firebase.auth().signOut().then(() => {
                this.$router.push({name: 'login'});
            });
        }
    },
    created(){
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                this.user = user;
                db.collection('users').where('id', '==', user.uid).get().then(snapshot => {
                    snapshot.docs.forEach(doc => {
                        this.id = doc.id;
                    })
                });
            }
            else{
                this.user = null
            }
        })
    }
}
</script>

<style>

</style>
