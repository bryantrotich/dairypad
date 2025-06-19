import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';
import * as bcrypt from 'bcrypt';

export class UserSeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    try{
      let society: any = await em.findOne('SocietyEntity', { email: 'info@society.co.ke' }, { populate: ['email','roles'], populateWhere: { roles: { name: 'super' } }  }); 

      // Generate random string for token
      let randomstring = require("randomstring");

      await em.create('UserEntity', {
        first_name:       'Test',
        last_name:        'Person',
        email:            'info@hostgram.co.ke',
        is_super:          true,
        phone:            '254712345678',
        email_verified_at: new Date(),
        password:          await bcrypt.hash('password', 10),
        role:              society.roles[0],
        society,
        token:             randomstring.generate(100),
      });

      console.log('User seeder executed successfully');

    }catch (error){  console.log(error); }    
  }

}
