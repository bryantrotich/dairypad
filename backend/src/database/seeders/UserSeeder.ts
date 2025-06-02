import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';

export class UserSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    try{
      // Find the company by email
      let company: any = await em.findOne('CompanyEntity', { email: 'info@hostgram.co.ke' }); 

      // Fetch role
      let role: any = await em.findOne('RoleEntity', { state: 0 }); 
      
      // Generate random string for token
      let randomstring = require("randomstring");

      let user = await em.create('UserEntity', {
        company,
        first_name:       'Test',
        last_name:        'Person',
        email:            'info@hostgram.co.ke',
        phone:            '254712345678',
        email_verified_at: new Date(),
        password:          await bcrypt.hash('password', 10),
        role,
        token:             randomstring.generate(100),
      });

      console.log('User seeder executed successfully');

    }catch (error){  console.log(error); }    
  }

}
