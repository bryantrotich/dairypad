import { Migration } from '@mikro-orm/migrations';

export class Migration20250529195352 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`companies\` (\`id\` varchar(36) not null, \`address\` varchar(255) null, \`name\` varchar(255) not null, \`email\` varchar(255) not null, \`logo\` varchar(255) null, \`icon\` varchar(255) null, \`phone_number\` varchar(255) null, \`country_code\` varchar(255) null default '254', \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`companies\` add unique \`companies_email_unique\`(\`email\`);`);

    this.addSql(`create table \`roles\` (\`id\` varchar(36) not null, \`company_id\` varchar(36) null, \`name\` varchar(255) not null, \`state\` int not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`roles\` add index \`roles_company_id_index\`(\`company_id\`);`);
    this.addSql(`alter table \`roles\` add unique \`roles_name_unique\`(\`name\`);`);

    this.addSql(`create table \`users\` (\`id\` varchar(36) not null, \`address\` varchar(255) null, \`company_id\` varchar(36) not null, \`first_name\` varchar(255) not null, \`last_name\` varchar(255) not null, \`email\` varchar(255) not null, \`country_code\` varchar(255) null default '254', \`email_verified_at\` datetime null, \`gender\` varchar(255) null default '', \`image\` varchar(255) null, \`password\` varchar(255) not null, \`phone_number\` varchar(255) null, \`role_id\` varchar(36) not null, \`token\` varchar(255) not null, \`created_at\` datetime null, \`updated_at\` datetime null, \`deleted_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`users\` add index \`users_company_id_index\`(\`company_id\`);`);
    this.addSql(`alter table \`users\` add unique \`users_email_unique\`(\`email\`);`);
    this.addSql(`alter table \`users\` add index \`users_role_id_index\`(\`role_id\`);`);

    this.addSql(`alter table \`roles\` add constraint \`roles_company_id_foreign\` foreign key (\`company_id\`) references \`companies\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`users\` add constraint \`users_company_id_foreign\` foreign key (\`company_id\`) references \`companies\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`users\` add constraint \`users_role_id_foreign\` foreign key (\`role_id\`) references \`roles\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`roles\` drop foreign key \`roles_company_id_foreign\`;`);

    this.addSql(`alter table \`users\` drop foreign key \`users_company_id_foreign\`;`);

    this.addSql(`alter table \`users\` drop foreign key \`users_role_id_foreign\`;`);

    this.addSql(`drop table if exists \`companies\`;`);

    this.addSql(`drop table if exists \`roles\`;`);

    this.addSql(`drop table if exists \`users\`;`);
  }

}
