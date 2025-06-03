import { Migration } from '@mikro-orm/migrations';

export class Migration20250603064324 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`societies\` (\`id\` varchar(36) not null, \`email\` varchar(255) null, \`city\` varchar(255) not null, \`name\` varchar(255) not null, \`phone_number\` varchar(255) null, \`country_code\` varchar(255) null default '254', \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`alter table \`users\` add \`society_id\` varchar(36) null;`);
    this.addSql(`alter table \`users\` add constraint \`users_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`users\` add index \`users_society_id_index\`(\`society_id\`);`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`users\` drop foreign key \`users_society_id_foreign\`;`);

    this.addSql(`drop table if exists \`societies\`;`);

    this.addSql(`alter table \`users\` drop index \`users_society_id_index\`;`);
    this.addSql(`alter table \`users\` drop column \`society_id\`;`);
  }

}
