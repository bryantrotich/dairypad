import {
    CanActivate,
    ExecutionContext,
    Global,
    Inject,
    Injectable,
    UnauthorizedException,
  } from '@nestjs/common';
  import { JwtService } from '@nestjs/jwt';
  import { Request } from 'express';
  import { DataSource } from 'typeorm';
  import { UserEntity } from '../../database/entities';
  import { pick, set } from 'lodash';
import { UserModel } from 'src/database/models';
import { ConfigService } from '@nestjs/config';
@Injectable()
export class AuthGuard implements CanActivate {

  private readonly config;
  
  constructor(
    private configService: ConfigService,
    private jwtService: JwtService,
    @Inject(UserModel) 
    private readonly userModel: UserModel    
  ) { 
    this.config = this.configService.get<any>('app.env');
  }

  /**
   * Middleware to check if the user is authenticated
   * @param context Execution context passed by Nest
   * @returns true if the user is authenticated, false otherwise
   */
  async canActivate(context: ExecutionContext): Promise<boolean> {

    const request = context.switchToHttp().getRequest();
    const token = this.extractTokenFromHeader(request);

    if (token == undefined) {
      throw new UnauthorizedException();
    }

    try {
      const { email } = await this.jwtService.verifyAsync(token,{secret: this.config['JWT_SESSION_KEY']});
      const user      =  await this.userModel.findOneOrFail({email});
      // 💡 We're assigning the payload to the request object here
      // so that we can access it in our route handlers
      set(request,'user',user);
    } catch(err) {
      throw new UnauthorizedException();
    }

    return true;
  }

  private extractTokenFromHeader(request: Request): string | undefined {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? token : undefined;
  }
}