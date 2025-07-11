import { Module, MiddlewareConsumer, NestModule } from '@nestjs/common';
import { ApiMiddleware, RedirectIfAuthMiddleware } from './http/middlewares';
import { JwtStrategy, LocalStrategy } from './http/guards';
import { AdvanceController, AuthController, CustomerController, DeliveryController, EmployeeController, ExpenseController, ExpenseTypeController, FarmerController, OvertimeController, PermissionController, ProductController, RoleController, SalaryController, SocietyController, SystemController, TransporterController } from './http/controllers';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { AppConfig } from './support/config';
import { AuthService } from './http/services';
import { MailModule, UserModule, RoleModule, SocietyModule, ProductModule, CustomerModule, TransporterModule, ExpenseTypeModule, ExpenseModule, PermissionModule, AdvanceModule, OvertimeModule, DeliveryModule, FarmerModule } from './modules';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path'
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { MySqlDriver } from '@mikro-orm/mysql';
import { SalaryModule } from './modules/salary.module';
@Module({
  imports: [
    ConfigModule.forRoot({
      envFilePath: ['.env.development','.env.production', '.env'],
      load:[ AppConfig ],
      isGlobal: true
    }), 
    CacheModule.register(),
    ExpenseModule,
    ExpenseTypeModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'public'),
      exclude: ['/api/(.*)']
    }),
    MikroOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => ({
        driver:      MySqlDriver,
        host:        configService.get<string>('app.env.DB_HOST'),
        port:        parseInt(configService.get<string>('app.env.DB_PORT')),
        dbName:      configService.get<string>('app.env.DB_DATABASE'),
        user:        configService.get<string>('app.env.DB_USERNAME'),
        password:    configService.get<string>('app.env.DB_PASSWORD'),
        entities:    ['./dist/src/database/entities/*.entity.js'],
        entitiesTs:  ['./src/database/entities/*.entity.ts'],
        synchronize: configService.get<string>('app.env.DB_SYNC') == 'on' ? true : false,
      }),
      inject:[ConfigService]
    }),
    PassportModule,
    JwtModule.registerAsync({
      imports:    [ConfigModule],
      useFactory: async( configService: ConfigService) => ({
        secret: configService.get<string>('app.env.JWT_SESSION_KEY'),
        signOptions: { 
          expiresIn: configService.get<string>('app.env.JWT_SESSION_EXPIRES') 
        },
      }),
      inject: [ConfigService]
    }),
    MailModule,   
    AdvanceModule,
    CustomerModule,
    DeliveryModule,
    FarmerModule,
    OvertimeModule,
    PermissionModule,
    ProductModule,
    RoleModule,
    SalaryModule,
    SocietyModule,
    TransporterModule,
    UserModule
  ],
  controllers: [
    AdvanceController,
    AuthController, 
    CustomerController, 
    DeliveryController,
    EmployeeController,
    ExpenseController, 
    ExpenseTypeController,
    FarmerController, 
    OvertimeController,
    PermissionController,
    ProductController, 
    RoleController,
    SalaryController, 
    SocietyController, 
    SystemController, 
    TransporterController
  ],
  providers:   [AuthService,JwtStrategy,LocalStrategy],
})  

export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(ApiMiddleware)
            .forRoutes("path");
    consumer.apply(RedirectIfAuthMiddleware)
            .exclude('auth/logout')
            .forRoutes(AuthController)            
  }
}

