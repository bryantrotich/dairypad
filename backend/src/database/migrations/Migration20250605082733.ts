import { Migration } from '@mikro-orm/migrations';

export class Migration20250605082733 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`customers\` (\`id\` varchar(36) not null, \`address\` varchar(255) null, \`billing_cycle\` enum('daily', 'weekly', 'monthly') not null, \`contact_person\` varchar(255) null, \`name\` varchar(255) not null, \`phone_number\` varchar(255) not null, \`postal_code\` varchar(255) null, \`society_id\` varchar(36) not null, \`town\` varchar(255) null, \`type\` enum('account', 'cash') not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`customers\` add index \`customers_society_id_index\`(\`society_id\`);`);

    this.addSql(`alter table \`customers\` add constraint \`customers_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`customers\`;`);
  }

}
