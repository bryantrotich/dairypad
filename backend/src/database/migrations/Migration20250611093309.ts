import { Migration } from '@mikro-orm/migrations';

export class Migration20250611093309 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`expense_types\` (\`id\` varchar(36) not null, \`description\` varchar(255) not null, \`name\` varchar(255) not null, \`society_id\` varchar(36) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`expense_types\` add index \`expense_types_society_id_index\`(\`society_id\`);`);

    this.addSql(`create table \`expenses\` (\`id\` varchar(36) not null, \`amount\` double not null, \`date\` date not null, \`description\` varchar(255) null, \`name\` varchar(255) not null, \`society_id\` varchar(36) not null, \`transaction_id\` varchar(255) null, \`type_id\` varchar(36) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`expenses\` add index \`expenses_society_id_index\`(\`society_id\`);`);
    this.addSql(`alter table \`expenses\` add index \`expenses_type_id_index\`(\`type_id\`);`);

    this.addSql(`alter table \`expense_types\` add constraint \`expense_types_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`expenses\` add constraint \`expenses_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`expenses\` add constraint \`expenses_type_id_foreign\` foreign key (\`type_id\`) references \`expense_types\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`expenses\` drop foreign key \`expenses_type_id_foreign\`;`);

    this.addSql(`drop table if exists \`expense_types\`;`);

    this.addSql(`drop table if exists \`expenses\`;`);
  }

}
