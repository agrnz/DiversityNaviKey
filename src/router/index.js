import { createRouter, createWebHistory } from 'vue-router'
import NavikeyHome from '../views/NavikeyHome.vue'
import NaviKeyResultsList from '../components/NaviKeyResultsList'
import NaviKeyResultDetails from '../components/NaviKeyResultDetails'

const routes = [
  {
    path: '/',
    name: 'navikey-home',
    component: NavikeyHome
  },
  {
    path: '/navikey-resultlist',
    name: 'navikey-resultlist',
    component: NaviKeyResultsList
  },
  {
    path: '/navikey-resultdetails',
    name: 'navikey-resultdetails',
    component: NaviKeyResultDetails
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutDivNaviKey.vue')
  },
  {
    path: '/navikey-settings',
    name: 'navikey-settings',
    component: () => import(/* webpackChunkName: "about" */ '../views/DivNaviKeySettings.vue')
  },
  {
    path: '/impressum',
    name: 'impressum',
    component: () => import(/* webpackChunkName: "about" */ '../views/ImpressumDivNaviKey.vue')
  },
  {
    path: '/tutorial/gettingstarted',
    name: 'tutorial_gettingstarted',
    component: () => import(/* webpackChunkName: "about" */ '../views/tutorial/GettingStarted.vue')
  },
  {
    path: '/tutorial/navigation',
    name: 'tutorial_navigation',
    component: () => import(/* webpackChunkName: "about" */ '../views/tutorial/MainNavigation.vue')
  },
  {
    path: '/tutorial/settings',
    name: 'tutorial_settings',
    component: () => import(/* webpackChunkName: "about" */ '../views/tutorial/TutorialSettings.vue')
  },
  {
    path: '/tutorial/query',
    name: 'tutorial_query',
    component: () => import(/* webpackChunkName: "about" */ '../views/tutorial/TutorialQuery.vue')
  },
  {
    path: '/tutorial/results',
    name: 'tutorial_results',
    component: () => import(/* webpackChunkName: "about" */ '../views/tutorial/TutorialResults.vue')
  },
  {
    path: '/tutorial/installation',
    name: 'tutorial_installation',
    component: () => import(/* webpackChunkName: "about" */ '../views/tutorial/InstallationAsApp.vue')
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
