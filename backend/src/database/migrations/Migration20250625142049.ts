import { Migration } from '@mikro-orm/migrations';

export class Migration20250625142049 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`salaries\` (\`id\` varchar(36) not null, \`active\` tinyint(1) not null, \`amount\` int not null, \`start_date\` datetime not null, \`society_id\` varchar(36) not null, \`user_id\` varchar(36) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`salaries\` add index \`salaries_society_id_index\`(\`society_id\`);`);
    this.addSql(`alter table \`salaries\` add index \`salaries_user_id_index\`(\`user_id\`);`);

    this.addSql(`alter table \`salaries\` add constraint \`salaries_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`salaries\` add constraint \`salaries_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`salaries\`;`);
  }

}
