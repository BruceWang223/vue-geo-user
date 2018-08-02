<template>
    <div class="signup container">
        <form @submit.prevent = 'signup' class="card-panel">
            <h2 class="center deep-purple-text">SignUp</h2>
            <div class="field">
                <label for="email">Email: </label>
                <input type="email" name="email" v-model='email'>
            </div>
            <div class="field">
                <label for="password">Password: </label>
                <input type="password" name="password" v-model='password'>
            </div>
            <div class="field">
                <label for="alias">Alias: </label>
                <input type="text" name="alias" v-model='alias'>
            </div>
            <p class = 'red-text center' v-if='feedback'>{{ feedback }}</p>
            <div class="field center">
                <button class="btn deep-purple">SignUp</button>
            </div>
        </form>
    </div>
</template>

<script>
import slugify from 'slugify'
import db from '@/firebase/init'
import firebase from 'firebase'
export default {
    name: 'signup',
    data(){
        return{
            email: null,
            password: null,
            alias: null,
            feedback: null,
            slug: null
        }
    },
    methods: {
        signup(){
            if(this.alias && this.email && this.password){
                this.slug = slugify(this.alias, {
                    replacement: '-',
                    lower: true,
                    remove: /[$*_+~.()'"!\-:@]/g
                });

                let ref = db.collection('users').doc(this.slug);
                ref.get().then(doc => {
                    if(doc.exists){
                        this.feedback = 'This alias has already been taken'
                    }
                    else{
                        firebase.auth().createUserWithEmailAndPassword(this.email, this.password)
                        .then((user) => {
                            ref.set({
                                id: user.uid,
                                geoLocation: null,
                                alias: this.alias
                            })
                            // return user;
                        })
                        // .then(user => {
                        //     user.sendEmailVerification();
                        // })
                        .then(() => {
                            this.$router.push({name: 'GMap'});
                        })
                        .catch(err => {
                            this.feedback = err.message;
                        })
                        
                    }
                })

            }else{
                this.feedback = 'You must enter all fields'
                console.log(this.email, this.password, this.alias);
            }
        }
    }
}
</script>

<style lang="scss">
    .signup {
        max-width: 500px;
    }
</style>

