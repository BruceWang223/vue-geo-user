import Vue from 'vue'
import Router from 'vue-router'
import GMap from '@/components/home/GMap'
import signup from '@/components/auth/signup'
import login from '@/components/auth/login'
import ViewProfile from '@/components/profile/ViewProfile'
import firebase from 'firebase'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '/',
      name: 'GMap',
      component: GMap,
      meta: { requiresAuth: true }
    },
    {
      path: '/signup',
      name: 'signup',
      component: signup
    },
    {
      path: '/login',
      name: 'login',
      component: login
    },
    {
      path: '/profile/:id',
      name: 'ViewProfile',
      component: ViewProfile,
      meta: { requiresAuth: true }
    }
  ]
})

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    let user = firebase.auth().currentUser;
    if(user){
      next();
    }
    else{
      next({ name : 'login'})
    }
  }
  else{
    next();
  }
})

export default router;