import { Migration } from '@mikro-orm/migrations';

export class Migration20250622094108 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`societies\` (\`id\` varchar(36) not null, \`email\` varchar(255) null, \`city\` varchar(255) not null, \`name\` varchar(255) not null, \`phone_number\` varchar(255) null, \`country_code\` varchar(255) null default '254', \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);

    this.addSql(`create table \`roles\` (\`id\` varchar(36) not null, \`is_super\` tinyint(1) null default false, \`name\` varchar(255) not null, \`society_id\` varchar(36) not null, \`state\` tinyint null default 0, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`roles\` add index \`roles_society_id_index\`(\`society_id\`);`);

    this.addSql(`create table \`products\` (\`id\` varchar(36) not null, \`description\` longtext not null, \`name\` varchar(255) not null, \`price\` int not null, \`quantity\` int not null, \`society_id\` varchar(36) not null, \`status\` enum('active', 'inactive') not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`products\` add index \`products_society_id_index\`(\`society_id\`);`);

    this.addSql(`create table \`permissions\` (\`id\` varchar(36) not null, \`description\` varchar(255) null, \`module\` varchar(255) not null, \`name\` varchar(255) not null, \`society_id\` varchar(36) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`permissions\` add index \`permissions_society_id_index\`(\`society_id\`);`);

    this.addSql(`create table \`role_permissions\` (\`id\` varchar(36) not null, \`permission_id\` varchar(36) not null, \`role_id\` varchar(36) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`role_permissions\` add index \`role_permissions_permission_id_index\`(\`permission_id\`);`);
    this.addSql(`alter table \`role_permissions\` add index \`role_permissions_role_id_index\`(\`role_id\`);`);

    this.addSql(`create table \`expense_types\` (\`id\` varchar(36) not null, \`description\` varchar(255) not null, \`name\` varchar(255) not null, \`society_id\` varchar(36) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`expense_types\` add index \`expense_types_society_id_index\`(\`society_id\`);`);

    this.addSql(`create table \`expenses\` (\`id\` varchar(36) not null, \`amount\` double not null, \`date\` date not null, \`description\` varchar(255) null, \`name\` varchar(255) not null, \`society_id\` varchar(36) not null, \`transaction_id\` varchar(255) null, \`type_id\` varchar(36) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`expenses\` add index \`expenses_society_id_index\`(\`society_id\`);`);
    this.addSql(`alter table \`expenses\` add index \`expenses_type_id_index\`(\`type_id\`);`);

    this.addSql(`create table \`customers\` (\`id\` varchar(36) not null, \`address\` varchar(255) null, \`billing_cycle\` enum('daily', 'weekly', 'monthly') not null, \`contact_person\` varchar(255) null, \`name\` varchar(255) not null, \`phone_number\` varchar(255) not null, \`postal_code\` varchar(255) null, \`society_id\` varchar(36) not null, \`town\` varchar(255) null, \`type\` enum('account', 'cash') not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`customers\` add index \`customers_society_id_index\`(\`society_id\`);`);

    this.addSql(`create table \`transporters\` (\`id\` varchar(36) not null, \`email\` varchar(255) not null, \`first_name\` varchar(255) not null, \`id_number\` varchar(255) not null, \`last_name\` varchar(255) not null, \`surname\` varchar(255) not null, \`phone_number\` varchar(255) not null, \`society_id\` varchar(36) not null, \`status\` enum('active', 'deceased', 'dormant', 'exited') not null, \`vehicle_registration\` varchar(255) not null, \`vehicle_type\` varchar(255) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`transporters\` add index \`transporters_society_id_index\`(\`society_id\`);`);

    this.addSql(`create table \`users\` (\`id\` varchar(36) not null, \`address\` varchar(255) null, \`first_name\` varchar(255) not null, \`is_super\` tinyint(1) null default false, \`last_name\` varchar(255) not null, \`email\` varchar(255) not null, \`country_code\` varchar(255) null default '254', \`email_verified_at\` datetime null, \`gender\` varchar(255) null default '', \`image\` varchar(255) null, \`password\` varchar(255) not null, \`phone_number\` varchar(255) null, \`role_id\` varchar(36) not null, \`society_id\` varchar(36) null, \`token\` varchar(255) not null, \`created_at\` datetime null, \`updated_at\` datetime null, \`deleted_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`users\` add unique \`users_email_unique\`(\`email\`);`);
    this.addSql(`alter table \`users\` add index \`users_role_id_index\`(\`role_id\`);`);
    this.addSql(`alter table \`users\` add index \`users_society_id_index\`(\`society_id\`);`);

    this.addSql(`alter table \`roles\` add constraint \`roles_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`products\` add constraint \`products_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`permissions\` add constraint \`permissions_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`role_permissions\` add constraint \`role_permissions_permission_id_foreign\` foreign key (\`permission_id\`) references \`permissions\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`role_permissions\` add constraint \`role_permissions_role_id_foreign\` foreign key (\`role_id\`) references \`roles\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`expense_types\` add constraint \`expense_types_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`expenses\` add constraint \`expenses_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`expenses\` add constraint \`expenses_type_id_foreign\` foreign key (\`type_id\`) references \`expense_types\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`customers\` add constraint \`customers_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`transporters\` add constraint \`transporters_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`users\` add constraint \`users_role_id_foreign\` foreign key (\`role_id\`) references \`roles\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`users\` add constraint \`users_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`roles\` drop foreign key \`roles_society_id_foreign\`;`);

    this.addSql(`alter table \`products\` drop foreign key \`products_society_id_foreign\`;`);

    this.addSql(`alter table \`permissions\` drop foreign key \`permissions_society_id_foreign\`;`);

    this.addSql(`alter table \`expense_types\` drop foreign key \`expense_types_society_id_foreign\`;`);

    this.addSql(`alter table \`expenses\` drop foreign key \`expenses_society_id_foreign\`;`);

    this.addSql(`alter table \`customers\` drop foreign key \`customers_society_id_foreign\`;`);

    this.addSql(`alter table \`transporters\` drop foreign key \`transporters_society_id_foreign\`;`);

    this.addSql(`alter table \`users\` drop foreign key \`users_society_id_foreign\`;`);

    this.addSql(`alter table \`role_permissions\` drop foreign key \`role_permissions_role_id_foreign\`;`);

    this.addSql(`alter table \`users\` drop foreign key \`users_role_id_foreign\`;`);

    this.addSql(`alter table \`role_permissions\` drop foreign key \`role_permissions_permission_id_foreign\`;`);

    this.addSql(`alter table \`expenses\` drop foreign key \`expenses_type_id_foreign\`;`);

    this.addSql(`drop table if exists \`societies\`;`);

    this.addSql(`drop table if exists \`roles\`;`);

    this.addSql(`drop table if exists \`products\`;`);

    this.addSql(`drop table if exists \`permissions\`;`);

    this.addSql(`drop table if exists \`role_permissions\`;`);

    this.addSql(`drop table if exists \`expense_types\`;`);

    this.addSql(`drop table if exists \`expenses\`;`);

    this.addSql(`drop table if exists \`customers\`;`);

    this.addSql(`drop table if exists \`transporters\`;`);

    this.addSql(`drop table if exists \`users\`;`);
  }

}
