import { Migration } from '@mikro-orm/migrations';

export class Migration20250626104434 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`create table \`farmers\` (\`id\` varchar(36) not null, \`email\` varchar(255) null, \`first_name\` varchar(255) not null, \`id_number\` varchar(255) not null, \`last_name\` varchar(255) not null, \`phone_number\` varchar(255) not null, \`surname\` varchar(255) not null, \`status\` enum('active', 'deceased', 'dormant', 'exited') not null, \`society_id\` varchar(36) not null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`farmers\` add index \`farmers_society_id_index\`(\`society_id\`);`);

    this.addSql(`create table \`deliveries\` (\`id\` varchar(36) not null, \`date\` datetime not null, \`farmer_id\` varchar(36) not null, \`quantity\` int not null, \`shift\` enum('evening', 'morning') not null, \`self_transported\` enum('no', 'yes') not null, \`society_id\` varchar(36) not null, \`transport_id\` varchar(36) null, \`created_at\` datetime null, \`updated_at\` datetime null, primary key (\`id\`)) default character set utf8mb4 engine = InnoDB;`);
    this.addSql(`alter table \`deliveries\` add index \`deliveries_farmer_id_index\`(\`farmer_id\`);`);
    this.addSql(`alter table \`deliveries\` add index \`deliveries_society_id_index\`(\`society_id\`);`);
    this.addSql(`alter table \`deliveries\` add index \`deliveries_transport_id_index\`(\`transport_id\`);`);

    this.addSql(`alter table \`farmers\` add constraint \`farmers_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);

    this.addSql(`alter table \`deliveries\` add constraint \`deliveries_farmer_id_foreign\` foreign key (\`farmer_id\`) references \`farmers\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`deliveries\` add constraint \`deliveries_society_id_foreign\` foreign key (\`society_id\`) references \`societies\` (\`id\`) on update cascade on delete cascade;`);
    this.addSql(`alter table \`deliveries\` add constraint \`deliveries_transport_id_foreign\` foreign key (\`transport_id\`) references \`transporters\` (\`id\`) on update cascade on delete set null;`);
  }

  override async down(): Promise<void> {
    this.addSql(`alter table \`deliveries\` drop foreign key \`deliveries_farmer_id_foreign\`;`);

    this.addSql(`drop table if exists \`farmers\`;`);

    this.addSql(`drop table if exists \`deliveries\`;`);
  }

}
