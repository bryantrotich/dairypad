import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import { v4 as uuidv4 } from 'uuid';

export class RoleSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    try{
      let company: any = await em.findOne('CompanyEntity', { email: 'info@hostgram.co.ke' }); 

      await em.insertMany('RoleEntity', [ 
        { id: uuidv4(), company_id: company.id, name: 'admin',  state: 1, created_at: new Date(), updated_at: new Date() },
        { id: uuidv4(), company_id: company.id, name: 'client', state: 3, created_at: new Date(), updated_at: new Date() },
        { id: uuidv4(), company_id: company.id, name: 'staff',  state: 2, created_at: new Date(), updated_at: new Date() },
        { id: uuidv4(), company_id: company.id, name: 'super',  state: 0, created_at: new Date(), updated_at: new Date() }
      ])

      console.log('Role seeder executed successfully');

    }catch (error){  console.log(error); }    
  }

}
