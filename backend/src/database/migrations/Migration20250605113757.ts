import { Migration } from '@mikro-orm/migrations';

export class Migration20250605113757 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`transporters\` (\`id\` varchar(36) not null, \`email\` varchar(255) not null, \`first_name\` varchar(255) not null, \`id_number\` varchar(255) not null, \`last_name\` varchar(255) not null, \`surname\` varchar(255) not null, \`phone_number\` varchar(255) not null, \`society_id\` varchar(36) not null, \`status\` enum('active', 'deceased', 'dormant', 'exited') not null, \`vehicle_registration\` varchar(255) not null, \`vehicle_type\` varchar(255) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`transporters\` add index \`transporters_society_id_index\`(\`society_id\`);`);

    this.addSql(`alter table \`transporters\` add constraint \`transporters_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`transporters\`;`);
  }

}
