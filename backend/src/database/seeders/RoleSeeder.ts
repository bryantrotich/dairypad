import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { v4 as uuidv4 } from 'uuid';
import { cloneDeep } from 'lodash';

export class RoleSeeder extends Seeder {

  private readonly roles = [
    { name: "Admin", value: "admin" },
    { name: "Super", value: "super" },
  ]
  async run(em: EntityManager): Promise<void> {
    try{
      
      let society: any     = await em.findOne('SocietyEntity', { email: 'info@society.co.ke' }); 
      let permissions: any = (await society.permissions.load()).toJSON();

      let roles: any       = cloneDeep(this.roles).map( 
        (role) => ({
          id:         uuidv4(),
          society_id: society.id,
          name:       role.name,
          is_super:   role.name == 'Super' ? true : false,
          created_at: new Date(), 
          updated_at: new Date()
        })
      );

      await em.insertMany('RoleEntity', roles);

      let role_permissions = cloneDeep(roles).map(
        (role) => {
          switch(role.name){
            case 'Admin':
              return permissions.filter( 
                permission => permission.module != 'societies' 
              ).map(
                (permission) => ({ 
                  id:            uuidv4(), 
                  role_id:       role.id, 
                  permission_id: permission.id, 
                  created_at:    new Date(), 
                  updated_at:    new Date() 
                })
              )
            case 'Super':
              return permissions.map(
                (permission) => ({ 
                  id:            uuidv4(),
                  role_id:       role.id, 
                  permission_id: permission.id, 
                  created_at:    new Date(), 
                  updated_at:    new Date() 
                })
              );
          }
        }
      ).flat();

      await em.insertMany('RolePermissionEntity', role_permissions);

      console.log('Role seeder executed successfully');

    }catch (error){  console.log(error); }    
  }

}
