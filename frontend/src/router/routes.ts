export default [
    {
        path: '',
        name: "Overview",
        meta: {
            title:     'Overview',
            auth:  true,
            permissions: ['READ_OVERVIEW']
        },
        component: () => import('@/pages/Overview.vue')
    },    
    {
        path: '/login',
        name: "Login",
        meta: {
            title: 'Login',
            auth:  false,
            permission: []
        },
        component: () => import('@/pages/Login.vue')
    },      
    {
        path: '/customers',
        name: "Customers",
        meta: {
            title: 'Customers',
            auth:  true,
            permissions: ['READ_CUSTOMERS']            
        },
        component: () => import('@/pages/Customers.vue')
    },
    {
        path: '/hr',
        children: [
            {
                path: 'employees',
                name: "Employees",
                meta: {
                    title: 'Employees',
                    auth:  true,
                    permissions: ['READ_EMPLOYEES']
                },
                component: () => import('@/pages/Employees.vue')
            },             
        ]
    },     
    {
        path: '/expenses',
        name: "Expenses",
        meta: {
            title: 'Expenses',
            auth:  true,
            permissions: ['READ_EXPENSES']
        },
        component: () => import('@/pages/Expenses.vue')
    },     
    {
        path: '/societies',
        name: "Societies",
        meta: {
            title: 'Societies',
            auth:  true,
            permissions: ['READ_SOCIETIES']
        },
        component: () => import('@/pages/Societies.vue')
    },        
    {
        path: '/transporters',
        name: "Transporters",
        meta: {
            title: 'Transporters',
            auth:  true,
            permissions: ['READ_TRANSPORTERS']
        },
        component: () => import('@/pages/Transporters.vue')
    },       
    {
        path: '/products',
        name: "Products",
        meta: {
            title: 'Products',
            auth:  true,
            permissions: ['READ_PRODUCTS']
        },
        component: () => import('@/pages/Products.vue')
    },  
    {
        path: '/roles-permissions',
        name: "RolesPermissions",
        meta: {
            title: 'Roles & Permissions',
            auth:  true,
            permissions: ['READ_ROLES','READ_PERMISSIONS']
        },
        component: () => import('@/pages/RolesPermissions.vue')
    },                  
    {
        path: '/profile',
        name: "Profile",
        meta: {
            title: 'Profile',
            auth:  true,
            permissions: []
        },
        component: () => import('@/pages/Profile.vue')
    },       
    {
        path: '/customers',
        name: "Customers",
        meta: {
            title: 'Customers',
            auth:  true,
            permissions: ['READ_CUSTOMERS']
        },
        component: () => import('@/pages/Customers.vue')
    }, 
    {
        path: '/verify',
        children: [
            {
                path: 'email/:token',
                name: "Verify Email",
                meta: {
                    title: 'Verify Email',
                    auth:  false,
                    permissions: []
                },
                component: () => import('@/pages/VerifyEmail.vue')
            },            
        ]
    },                                       
]