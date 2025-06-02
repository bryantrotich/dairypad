import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class CompanySeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    try{

      await em.create('CompanyEntity', {
        name: 'Test Company',
        email: 'info@hostgram.co.ke',
        phone: '254712345678',
      });

      console.log('Company seeder executed successfully');

    }catch (error){  console.log(error); }
    
  }

}
