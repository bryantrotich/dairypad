import { registerAs } from "@nestjs/config"

export default registerAs('app',() => ({
    env: process.env,
    actions: [
        { name: "Create", value: "create" },
        { name: "Read", value: "read" },
        { name: "Fetch", value: "fetch" },
        { name: "Update", value: "update" },
        { name: "Delete", value: "delete" },
    ],
    modules:[
        { name: "Societies", value: "societies" },
        { name: "Overview", value: "overview" },
        { name: "Employees", value: "employees" },
        { name: "Farmers", value: "farmers" },
        { name: "Transporters", value: "transporters" },
        { name: "Deliveries", value: "deliveries" },
        { name: "Expense Types", value: "expense_types" },
        { name: "Expenses", value: "expenses" },
        { name: "Roles", value: "roles" },
        { name: "Permissions", value: "permissions" },
        { name: "Customers", value: "customers" },
        { name: "Products", value: "products" },
    ],
    permissions: [
        { name: "CREATE_{MODULE}", value: "create_{MODULE}" },
        { name: "READ_{MODULE}",   value: "read_{MODULE}"   },
        { name: "FETCH_{MODULE}",  value: "fetch_{MODULE}"   },
        { name: "UPDATE_{MODULE}", value: "update_{MODULE}" },
        { name: "DELETE_{MODULE}", value: "delete_{MODULE}" },
    ],
    roles: [
        { name: "Admin", value: "admin", state: 1 },
        { name: "Super", value: "super", state: 2 },
    ]
}));