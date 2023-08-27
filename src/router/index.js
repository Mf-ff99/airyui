import { createRouter, createWebHistory } from 'vue-router'
import Main from '../views/HomeView.vue'
import ProfileView from '../views/ProfileView.vue'
import { getAuth, onAuthStateChanged } from "firebase/auth";


const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: Main
    },
    {
      path: '/about',
      name: 'about',
      // route level code-splitting
      // this generates a separate chunk (About.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/AboutView.vue')
    },
    { path: "/login", component: () => import("../views/LoginView.vue") },
    { path: "/register", component: () => import("../views/RegisterView.vue") },
    {
      path: "/dashboard",
      component: () => import("../views/DashboardView.vue"),
      meta: { requiresAuth: true },
    },
    {
      path: "/profile/:id",
      name: "profile", 
      component: ProfileView,
      meta: { requiresAuth: true },
    },
    {
      path: "/local",
      name: "local", 
      component: () => import("../views/LocalView.vue"),
      meta: { requiresAuth: true },
    },
  ]
})

const getCurrentUser = () => {
  return new Promise((resolve, reject) => {
    const removeListener = onAuthStateChanged(
      getAuth(),
      (user) => {
        removeListener()
        resolve(user)
      },
      reject,
    )
  })
}

router.beforeEach( async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (getCurrentUser()) {
      next()
  } else {
    alert("You are not logged in")
    next("/")
    }
  } else {
    next()
  }
})

export default router
