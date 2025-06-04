export default [
    {
        path: '',
        name: "Overview",
        meta: {
            title:     'Overview',
            auth:  true,
            state: 0
        },
        component: () => import('@/pages/Overview.vue')
    },    
    {
        path: '/login',
        name: "Login",
        meta: {
            title: 'Login',
            auth:  false,
            state: '*'
        },
        component: () => import('@/pages/Login.vue')
    },      
    {
        path: '/customers',
        name: "Customers",
        meta: {
            title: 'Customers',
            auth:  true,
            state: 1
        },
        component: () => import('@/pages/Customers.vue')
    },
    {
        path: '/societies',
        name: "Societies",
        meta: {
            title: 'Societies',
            auth:  true,
            state: 1
        },
        component: () => import('@/pages/Societies.vue')
    },   
    {
        path: '/products',
        name: "Products",
        meta: {
            title: 'Products',
            auth:  true,
            state: 1
        },
        component: () => import('@/pages/Products.vue')
    },        
    {
        path: '/company',
        name: "Company",
        meta: {
        title: 'Company',
            auth:  true,
            state: 2
        },
        component: () => import('@/pages/Company.vue')
    },        
    {
        path: '/profile',
        name: "Profile",
        meta: {
            title: 'Profile',
            auth:  true,
            state: 0
        },
        component: () => import('@/pages/Profile.vue')
    },       
    {
        path: '/system',
        name: "System",
        meta: {
            title: 'System',
            auth:  true,
            state: 3
        },
        component: () => import('@/pages/System.vue')
    }                                     
]