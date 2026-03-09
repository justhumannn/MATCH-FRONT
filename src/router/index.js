import { createRouter, createWebHistory } from 'vue-router';
import MainDashboard from '../components/MainDashboard.vue';
import BettingDetail from '../components/BettingDetail.vue';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: MainDashboard
  },
  {
    // 💡 :id 부분은 동적으로 변하는 파라미터입니다. (예: /betting/1, /betting/2)
    path: '/betting/:id',
    name: 'BettingDetail',
    component: BettingDetail
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;