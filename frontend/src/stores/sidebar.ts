import { defineStore } from 'pinia'

export const useSidebarStore = defineStore('sidebar', () => {
    return {
        links:  [
            {
                title: 'Analytics',
                children: [
                    {
                        label: 'Overview',
                        icon: 'cil-speedometer',
                        to:   { name: 'Overview' },
                        active: true,
                        permissions: ['READ_OVERVIEW']
                    },                
                ]
            },
            {
                title: 'Platform',
                children: [
                    {
                        label: 'Customers',
                        icon: 'cil-user',
                        to:   { name: 'Customers' },
                        active: false,
                        permissions: ['READ_CUSTOMERS']
                    },
                    {
                        label: 'Deliveries',
                        icon: 'cil-library',
                        to:   { name: 'Deliveries' },
                        active: false,
                        permissions: ['READ_DELIVERIES']
                    },                    
                    {
                        label: 'Expenses',
                        icon: 'cil-dollar',
                        to:   { name: 'Expenses' },
                        active: false,
                        permissions: ['READ_EXPENSES', 'READ_EXPENSE_TYPES', 'FETCH_EXPENSE_TYPES']
                    },                    
                    {
                        label: 'Farmers',
                        icon: 'cil-people',
                        to:   { name: 'Farmers' },
                        active: false,
                        permissions: ['READ_FARMERS']
                    },          
                    {
                        label:    'HR',    
                        icon:     'cil-list',
                        visible:  ['Employees', 'Alowances', 'Deductions', 'Advances', 'Overtime', 'Salaries'],                     
                        children: [
                            {
                                label: 'Alowances',
                                icon: 'cil-user',
                                to:   { name: 'Alowances' },
                                active: false,
                                permissions: ['READ_ALLOWANCES']
                            },  
                            {
                                label: 'Deductions',
                                icon: 'cil-user',
                                to:   { name: 'Deductions' },
                                active: false,
                                permissions: ['READ_DEDUCTIONS']
                            },                              
                            {
                                label: 'Employees',
                                icon: 'cil-user',
                                to:   { name: 'Employees' },
                                active: false,
                                permissions: ['READ_EMPLOYEES']
                            },
                            {
                                label: 'Loans & Advances',
                                icon: 'cil-user',
                                to:   { name: 'Advances' },
                                active: false,
                                permissions: ['READ_ADVANCES','FETCH_EMPLOYEES']
                            },
                            {
                                label: 'Overtime',
                                icon: 'cil-user',
                                to:   { name: 'Overtime' },
                                active: false,
                                permissions: ['READ_OVERTIME','FETCH_EMPLOYEES']
                            },         
                            {
                                label: 'Salaries',
                                icon: 'cil-user',
                                to:   { name: 'Salaries' },
                                active: false,
                                permissions: ['READ_SALARIES']
                            },                       
                        ]
                    },                              
                    {
                        label: 'Products',
                        icon: 'cil-basket',
                        to:   { name: 'Products' },
                        active: false,
                        permissions: ['READ_PRODUCTS']
                    },
                    {
                        label: 'Societies',
                        icon: 'cil-building',
                        to:   { name: 'Societies' },
                        active: false,
                        permissions: ['READ_SOCIETIES']
                    },
                    {
                        label: 'Transporters',
                        icon: 'cil-truck',
                        to:   { name: 'Transporters' },
                        active: false,
                        permissions: ['READ_TRANSPORTERS']
                    },                
                ]
            },
            {
                title: 'Management',
                children: [
                    {
                        label:    'Account',
                        category: "Management",     
                        icon:     'cil-cog',    
                        visible:   ['Profile', 'System'],   
                        children: [
                            {
                                label: 'Profile',
                                icon: 'cil-user',
                                to:   { name: 'Profile' },
                                active: false,
                                permissions: []
                            },
                            {
                                label: 'System',
                                icon: 'cil-cog',
                                to:   { name: 'System' },
                                active: false,
                                permissions: ['READ_SYSTEM']
                            },
                        ]
                    },                    
                    {
                        label: 'Roles & Permissions',
                        icon: 'cil-shield-alt',
                        to:   { name: 'RolesPermissions' },
                        category: "Management",            
                        active: false,
                        permissions: ['READ_ROLES','READ_PERMISSIONS']
                    },             
                ]
            }
        ]

    }
});
