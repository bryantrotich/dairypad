import { Migration } from '@mikro-orm/migrations';

export class Migration20250625160248 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`overtime\` (\`id\` varchar(36) not null, \`date\` datetime not null, \`hours\` int not null, \`hourly_rate\` int not null, \`notes\` text not null, \`society_id\` varchar(36) not null, \`user_id\` varchar(36) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`overtime\` add index \`overtime_society_id_index\`(\`society_id\`);`);
    this.addSql(`alter table \`overtime\` add index \`overtime_user_id_index\`(\`user_id\`);`);

    this.addSql(`create table \`advances\` (\`id\` varchar(36) not null, \`amount\` int not null, \`date\` datetime not null, \`deduct_payroll\` enum('no', 'yes') not null, \`issued_on\` datetime not null, \`reason\` text not null, \`recovered\` enum('no', 'yes') not null, \`society_id\` varchar(36) not null, \`user_id\` varchar(36) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`advances\` add index \`advances_society_id_index\`(\`society_id\`);`);
    this.addSql(`alter table \`advances\` add index \`advances_user_id_index\`(\`user_id\`);`);

    this.addSql(`alter table \`overtime\` add constraint \`overtime_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`overtime\` add constraint \`overtime_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`advances\` add constraint \`advances_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`advances\` add constraint \`advances_user_id_foreign\` foreign key (\`user_id\`) references \`users\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`drop table if exists \`overtime\`;`);

    this.addSql(`drop table if exists \`advances\`;`);
  }

}
