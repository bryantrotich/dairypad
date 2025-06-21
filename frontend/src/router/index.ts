import { createRouter, createWebHistory } from 'vue-router'
import { isEmpty } from 'lodash';
import routes from './routes';
import { AuthMiddelware } from '@/middlewares';

const router = createRouter({
  history: createWebHistory(import.meta.BASE_URL),
  routes 
});

router.beforeEach(AuthMiddelware);

export default router
