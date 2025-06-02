import { createRouter, createWebHistory } from 'vue-router'
import { isEmpty } from 'lodash';
import routes from './routes';
import { AuthMiddelware } from '@/middlewares';

const router = createRouter({
  history: createWebHistory(import.meta.BASE_URL),
  routes 
});

router.beforeEach(AuthMiddelware);

// router.beforeResolve((to, from, next) => {
//   console.log('Before resolving to:', to.name);
//   next();
// })
// router.beforeEach( (to, from, next) => {
//   const { name: routeName, meta: { auth, state } } = to;
//   store.commit('loader',true);
//   window.document.querySelector('title').innerHTML = `${to.meta.title} | ${import.meta.env.VITE_APP_NAME}`;
//   window.scrollTo({top: 0, behavior: 'smooth'});
//   switch( !isEmpty(store.getters.authUser) ){
//     case true:
//       if( routeName == "Login"){
//         next({name:"Overview"});
//       } else {
//         const { getters: { authUser:{ role: { name: roleName, state: roleState } } } } = store;
//         if( roleState >= state ){
//           next();
//         } else {
//           next({name:"Forbidden"})
//         }
//       }   
//     break;
//     case false:
//       // store.commit('auth',{});
//       if( auth && to.name != "Login" ){
//         router.push({ name: "Login" });
//       }
//       next();
//     break;
//   }

// });

// router.afterEach((to, from,failure) => {
//   store.commit('loader',false);
// })


export default router
