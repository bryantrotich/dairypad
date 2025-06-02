import { ForbiddenException, HttpException, Injectable, Logger, NotFoundException, PreconditionFailedException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';;
import { UserModel } from 'src/database/models';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isNull, omit, toPlainObject } from 'lodash';
import * as bcrypt from 'bcrypt';
import * as moment from 'moment';
@Injectable()
export class AuthService {

    private readonly config;

    private readonly logger = new Logger(AuthService.name);

    constructor(
        private userModel: UserModel,
        private configService: ConfigService,
        private jwtService: JwtService
    ){
        this.config = this.configService.get<any>('app.env');
    }

    /**
     * Find user by email address
     * @param email 
     * @returns 
     */
    async findOneByEmail(email: string){
        try {
        
            return await this.userModel.findOneOrFail({ email });
        
        } catch (error) {

            this.logger.error(error);
            // If user not found, throw NotFoundException
            if (error.constructor.name == 'NotFoundError') {
                throw new NotFoundException();
            }
        }
    }

    /**
     * Sign in user
     *
     * @param {string} email - The user's email address
     * @returns {Promise<Object>} - The signed in user object along with a JWT token
     * @throws {PreconditionFailedException} - If JWT expiry time has not been set or if the application has not been properly configured
     * @throws {HttpException} - If an error occurs during the sign in process
     */
    async signIn(email): Promise<any> {
        try {

            // Check if JWT auth is set up
            if (
                isEmpty(this.config['JWT_EXPIRES_IN']) ||
                isEmpty(this.config['JWT_SESSION_KEY'])
            ) {
                throw new PreconditionFailedException(
                    'The application has not been properly configured.'
                );
            }

            // Check if expiry duration is set
            if (!this.config['JWT_EXPIRES_IN'].includes('s')) {
                throw new PreconditionFailedException(
                    'JWT expiry time has not been set'
                );
            }

            // Find user model
            const user = await this.userModel.findOne({email});

            // Jwt signing
            const token = await this.jwtService.signAsync(toPlainObject(user),{
                expiresIn: this.config['JWT_EXPIRES_IN'],
                secret:    this.config['JWT_SESSION_KEY']
            });

            return {
                token: { 
                    expires_in: parseInt(this.config['JWT_EXPIRES_IN']), 
                    type:       this.config['JWT_TOKEN_TYPE'], 
                    code:       token 
                },
                user
            };
        } catch (error) {
            this.logger.error(error);
            throw new HttpException(error.message, error.status);
        }
    }

    /**
     * Authenticates the user
     * 
     * @param email The user's email address
     * @param password The user's password
     * @returns {Promise<Object>} The signed in user object along with a JWT token
     * @throws {UnauthorizedException} If the user's email or password is incorrect
     * @throws {ForbiddenException} If the user's account is not verified
     * @throws {HttpException} If an error occurs during the login process
     */
    async login(email, password){
        try {

            // Find user by email address
            let user = await this.userModel.findOneOrFail({ email });           

            // Check if user exists and password is correct
            if (!user || !(await bcrypt.compare(password, user.password))) {
                throw new UnauthorizedException();
            }
            
            // Check if user's account is verified
            if(isNull(user.email_verified_at)) {
                throw new ForbiddenException();
            }

            // Sign in user
            return await this.signIn(email);

        } catch (error) {
            // Log and throw error
            this.logger.error(error);

            if( error.constructor.name == 'NotFoundError'){
                throw new NotFoundException();
            }

            if( error.constructor.name == 'UnauthorizedException'){
                throw new UnauthorizedException();
            }
            
            if( error.constructor.name == 'ForbiddenException'){
                throw new ForbiddenException();
            }            
            
        }        
    }

    /**
     * Validate user model 
     * 
     * @param {string} username - The user's email address
     * @param {string} password - The user's password
     * 
     * @returns {Promise<UserEntity>} - The validated user model
     * 
     * @throws {UnauthorizedException} - If the user's email or password is incorrect
     */
    async validateUser(username: string, password: string): Promise<any> {
        // Find user by email address
        let foundUser = await this.userModel.findOne({ email: username });
        
        // Check if user exists and password is correct
        if (!foundUser || !(await bcrypt.compare(password, foundUser.password))) {
          throw new UnauthorizedException();
        }
        
        // Return validated user model
        const { password: _password, ...retUser } = foundUser;
        
        return retUser;
    }
}
