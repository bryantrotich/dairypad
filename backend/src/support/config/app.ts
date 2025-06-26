import { registerAs } from "@nestjs/config"

export default registerAs('app',() => ({
    env: process.env,
    actions: [
        { name: "All",    value: "all" },
        { name: "Create", value: "create" },
        { name: "Read",   value: "read" },
        { name: "Fetch",  value: "fetch" },
        { name: "Update", value: "update" },
        { name: "Delete", value: "delete" },
    ],
    modules:[
        { name: "Advances", value: "advances" },
        { name: "Customers", value: "customers" },
        { name: "Deliveries", value: "deliveries" },
        { name: "Employees", value: "employees" },
        { name: "Expenses", value: "expenses" },
        { name: "Expense Types", value: "expense_types" },
        { name: "Farmers", value: "farmers" },
        { name: "Overview", value: "overview" },
        { name: "Overtime", value: "overtime" },
        { name: "Permissions", value: "permissions" },
        { name: "Products", value: "products" },
        { name: "Roles", value: "roles" },
        { name: "Salaries", value: "salaries" },
        { name: "Societies", value: "societies" },
        { name: "Transporters", value: "transporters" },
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