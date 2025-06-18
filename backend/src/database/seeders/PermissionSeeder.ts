import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';

export class PermissionSeeder extends Seeder {
    
    private readonly modules = [
        { name: "Societies", value: "societies" },
        { name: "Users", value: "users" },
        { name: "Employees", value: "employees" },
        { name: "Farmers", value: "farmers" },
        { name: "Transporters", value: "transporters" },
        { name: "Deliveries", value: "deliveries" },
        { name: "Expense Types", value: "expense_types" },
        { name: "Expenses", value: "expenses" },
        { name: "Roles", value: "roles" },
        { name: "Permissions", value: "permissions" },
        { name: "Customers", value: "customers" },
        { name: "Sales", value: "sales" },
        { name: "Products", value: "products" },
    ];

    private readonly permissions = [
        { name: "CREATE_{MODULE}", value: "create_{MODULE}" },
        { name: "READ_{MODULE}",   value: "read_{MODULE}"   },
        { name: "UPDATE_{MODULE}", value: "update_{MODULE}" },
        { name: "DELETE_{MODULE}", value: "delete_{MODULE}" },
    ];
    constructor(private readonly configService: ConfigService) {super();}

    async run(em: EntityManager): Promise<void> {
        try{

            let society: any     = await em.findOne('SocietyEntity', { email: 'info@society.co.ke' }); 
            let permissions: any = this.modules.map(
                (module) => {
                    return cloneDeep(this.permissions).map(
                        (permission) => {
                            return {
                                id:         uuidv4(),
                                module:     module.value,
                                name:       permission.name.replace('{MODULE}', module.name.toUpperCase()),
                                society_id: society.id,
                                created_at: new Date(), 
                                updated_at: new Date()
                            }
                        }
                    )
                }
            ).flat();

            await em.insertMany('PermissionEntity', permissions);

            console.log('Permissions seeder executed successfully');

        }catch (error){  console.log(error); }    
    }

}
