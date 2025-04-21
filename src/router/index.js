import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(),
    routes:[
        {
            path:'/',
            name: 'Home',
            component: () => import( '@/views/WelcomeForm.vue')
        } ,
        {
            path:'/login',
            name:'Login',
            component: () => import('@/views/LoginForm.vue')
        },
        {
            path:'/register',
            name:'Register',
            component: () => import('@/views/RegisterForm.vue')
        },
        {
            path:'/workspace',
            name:'Workspace',
            component: () => import('@/views/WorkspaceForm.vue')
        },
        {
            path:'/profile',
            name:'Profile',
            component: () => import('@/views/ProfileForm.vue')
        },
        {
            path: '/note',
            name:'Note',
            component: ()=> import('@/views/NoteForm.vue')
        },
        {
            path:'/chats',
            name:'Chats',
            component: ()=> import('@/views/ChatsForm.vue')
        },
        {
            path:'/chat/:otherUsername',
            name:'Chat',
            component: () => import('@/views/ChatForm.vue')
        }
    ]
})

export default router