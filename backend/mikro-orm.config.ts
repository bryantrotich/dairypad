import { defineConfig } from '@mikro-orm/core';
import { MySqlDriver } from '@mikro-orm/mysql';
import { TsMorphMetadataProvider } from '@mikro-orm/reflection';
import { Migrator } from '@mikro-orm/migrations';
import { SeedManager } from '@mikro-orm/seeder';
import * as dotenv from 'dotenv';

dotenv.config();

export default defineConfig({
    extensions:       [Migrator,SeedManager],
    entities:         ['./src/database/entities/*.entity.ts'],
    entitiesTs:       ['./src/database/entities/*.entity.ts'],
    debug:            JSON.parse(process.env.DB_DEBUG),
    host:             process.env.DB_HOST || 'localhost',
    port:             parseInt(process.env.DB_PORT || '3306', 10),
    dbName:           process.env.DB_DATABASE,
    user:             process.env.DB_USERNAME,
    password:         process.env.DB_PASSWORD,
    driver:           MySqlDriver,
    metadataProvider: TsMorphMetadataProvider,
    allowGlobalContext: true,
    migrations: {
        path: './src/database/migrations',
        pathTs: './src/database/migrations',
        disableForeignKeys: false,
    },
    seeder: {
        path: './dist/src/database/seeders',
        pathTs: './src/database/seeders',
    }
})