<template>
    <div class="view-profile container">
        <div v-if = 'profile' class="card">
            <h2 class="deep-purple-text center"> {{ profile.alias }}'s Wall</h2>
            <ul class="collection">
                <ul v-for = '(comment, index) in comments' :key = 'index' class="comments">
                    <li class="from">{{ comment.from }}</li>
                    <li class="time">{{ comment.timestamp }}</li>
                    <li class="content">{{ comment.content }}</li>
                </ul>
            </ul>
            <form @submit.prevent = 'addComment'>
                <div class="field">
                    <label for="comment">Add a comment (press enter to add):</label>
                    <input type="text" name="comment" v-model = 'newComment'>
                    <p v-if='feedback' class="red-text">{{ feedback }}</p>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import db from '@/firebase/init'
import firebase from 'firebase'
import moment from 'moment'
export default {
    name: 'ViewProfile',
    data(){
        return{
            profile : null,
            feedback: null,
            newComment : null,
            user : null,
            comments: []
        }
    },
    created(){
        // get profile data
        db.collection('users').doc(this.$route.params.id).get().then(user => {
            this.profile = user.data();
        });

        //  get current user data
        let currentUser = firebase.auth().currentUser;
        db.collection('users').where('id', '==', currentUser.uid).get()
        .then(snapshot => {
            snapshot.docs.forEach(doc => {
                this.user = doc.data();
                this.user.id = doc.id;
            });
        })

        // get comments data
        db.collection('comments').where('to', '==', this.$route.params.id)
        .onSnapshot((snapshot) => {
            snapshot.docChanges.forEach(doc => {
                if(doc.type == 'added'){
                    this.comments.unshift({
                        from : doc.doc.data().from,
                        content: doc.doc.data().content,
                        timestamp : moment(doc.doc.data().timestamp).format('lll')
                    });
                }
            })
        })
        
    },
    methods: {
        addComment(){
            if(this.newComment){
                db.collection("comments").add({
                    to : this.$route.params.id,
                    from : this.user.alias,
                    content: this.newComment,
                    timestamp: Date.now()
                })
                this.newComment = null;
            }
            else{
                this.feedback = 'You can not enter a null value'
            }
        }
    }
}
</script>

<style lang="scss">

    .view-profile{
        .card{
            padding: 20px;
            margin-bottom: 100px;
        }

        .collection{
            padding: 20px;
            height: 400px;
            overflow: auto;
        }
        .comments{
            display: block;
            padding: 20px;

            .from{
                display: inline-block;   
                font-size: 1.2em;
                color: darkmagenta;
            }

            .time{
                display: inline-block;
                margin-right: 5px;
                font-size: .9em;
                color: purple;
            }

            .content{
                font-size: 1.4em;
            }
            
        }
    }
</style>

