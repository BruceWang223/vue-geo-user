<template>
    <div class="map">
        <div class = 'google-map' id="map">
        </div>
    </div>
</template>

<script>
import firebase from 'firebase'
import db from '@/firebase/init'
export default {
    name: 'GMap',
    data(){
        return{
            lat: 43,
            lng: -3
        }
    },
    methods:{
        renderMap(){
            const map = new google.maps.Map(document.getElementById('map'), {
                center: {lat: this.lat, lng: this.lng},
                zoom: 5,
                maxZoom: 10,
                minZoom: 3,
                streetViewControl: false
            });

            db.collection('users').get().then(snapshot => {
                snapshot.docs.forEach(doc => {
                    let data = doc.data();
                    if(data.geoLocation){
                        const marker = new google.maps.Marker({
                            map : map,
                            position : {
                                lat: data.geoLocation.lat,
                                lng: data.geoLocation.lng
                            }
                        })
                        // not to use function(){} as the this will point to the global object...
                        marker.addListener('click', () => {
                            this.$router.push({name : 'ViewProfile', params: {id: doc.id}});
                        })
                        
                    }
                })
            })
        }
    },
    mounted(){
        let user = firebase.auth().currentUser;
        if(navigator.geolocation){
            navigator.geolocation.getCurrentPosition((pos) => {
                const crd = pos.coords;
                this.lat = crd.latitude;
                this.lng = crd.longitude;
                // find the user in db and update it;
                db.collection('users').where('id', '==', user.uid).get()
                .then(snapShot => {
                    // possibly an array so best to loop through it 
                    snapShot.forEach(doc => {
                        db.collection('users').doc(doc.id).update({
                            geoLocation: {
                                lat: this.lat,
                                lng: this.lng
                            }
                        })
                    });
                })
                .then(() => {
                    this.renderMap();
                })
            }, (err) => {
                console.log(err);
                this.renderMap();
            }, {
                maximumAge : 60000,
                timeout: 3000
            })
        }
        else{
            // render default location
            this.renderMap();
        }
    }
}
</script>

<style lang="scss" scoped>
    .google-map{
        width: 100%;
        height: 100%;
        position: absolute;
        z-index: -1;
        top: 0;
        left: 0;
        background: #fff;
    }
</style>

