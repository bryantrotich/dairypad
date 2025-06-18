import type { EntityManager } from '@mikro-orm/core';
import { Seeder } from '@mikro-orm/seeder';

export class SocietySeeder extends Seeder {

  async run(em: EntityManager): Promise<void> {
    try{

      await em.create('SocietyEntity', {
        city: 'Nairobi',
        name: 'CBD Nairobi',
        email: 'info@society.co.ke',
        phone: '254712345678',
      });

      console.log('Society seeder executed successfully');

    }catch (error){  console.log(error); }
    
  }

}
