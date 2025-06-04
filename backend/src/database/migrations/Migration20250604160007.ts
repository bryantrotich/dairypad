import { Migration } from '@mikro-orm/migrations';

export class Migration20250604160007 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`products\` (\`id\` varchar(36) not null, \`description\` longtext not null, \`name\` varchar(255) not null, \`price\` int not null, \`quantity\` int not null, \`society_id\` varchar(36) not null, \`status\` enum('active', 'inactive') not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`products\` add index \`products_society_id_index\`(\`society_id\`);`);

    this.addSql(`alter table \`products\` add constraint \`products_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`products\`;`);
  }

}
