import { Body, Controller, Get, HttpException, HttpStatus, InternalServerErrorException, Logger, NotFoundException, Param, Post, Put, Req, Res, UnauthorizedException, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { AuthService, MailService } from 'src/http/services';
import { LoginValidation, RegisterValidation, ResetAuthValidation, UpdateAuthValidation } from 'src/support/validation';
import { RoleModel, SocietyModel, UserModel } from 'src/database/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { get, has, isEmpty, isNull, pick, omit, set } from 'lodash';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { ControllerException } from 'src/http/exceptions/controller.exception';
import { Express } from 'express'
import { NotFoundInterceptor } from 'src/http/interceptors';
import moment from 'moment';
import { NotFoundError } from '@mikro-orm/core';
import { SetPasswordValidation } from 'src/http/validations';

@Controller('auth')
@UseInterceptors(NotFoundInterceptor)
export class AuthController {

    private readonly logger = new Logger(AuthController.name);

    constructor(
        private authService: AuthService,
        private configService: ConfigService,
        private mailService: MailService,
        private roleModel: RoleModel,
        private societyModel: SocietyModel,
        private userModel: UserModel
    ){}

    @Post('login')
    /**
     * Handle login request
     *
     * @param {LoginValidation} body - The request body containing email and password
     * @param {Request} req - The request object
     * @param {Response} res - The response object
     * @return {Promise<void>} - Returns a Promise that resolves when the response is sent
     */
    async login(
        @Body() body: LoginValidation,
        @Req()  req:  Request, 
        @Res()  res:  Response
    ){
        try{

            // Destructure email and password from request body
            let { email, password } = body;

            // Authenticate user and retrieve token
            let token = await this.authService.login(email,password);

            // Send response with token
            res.status(HttpStatus.OK).json({ ...token });

        } catch(error){

            // Log and throw error
            throw new HttpException(error.message, error.status);

        }
    }

    @Post('signup')
    /**
     * Handle signup request
     *
     * @param {RegisterValidation} registerUser - The request body containing user details
     * @param {Response} res - The response object
     * @return {Promise<void>} - Returns a Promise that resolves when the response is sent
     */
    async signup(
        @Body() registerUser: RegisterValidation, 
        @Res()  res:          Response
    ){
        try{
            // Generate random string for token
            let randomstring = require("randomstring");
            
            // Get company and role IDs
            let [ { id: companyId } ] = await this.societyModel.find('*');
            let { id: roleId }        = await this.roleModel.findOneOrFail({ name: 'client'});

            // Hash password and generate token
            registerUser.password      = await bcrypt.hashSync(registerUser.password, parseInt(this.configService.get('app.SALT_LENGTH')));
            registerUser['token']      = randomstring.generate(100);
            registerUser['company_id'] = companyId;
            registerUser['role_id']    = roleId;
            
            // Remove confirm password field
            delete registerUser.confirm_password;

            // Save user and send confirmation email
            let user = await this.userModel.create(registerUser);
            
            await this.mailService.sendUserConfirmation(user);

            // Send response with user details
            res.status(HttpStatus.OK).json({user});

        } catch(error) {
            // Log and throw error
            throw new ControllerException(error);            
        }   
    }

    @Put('verify/:token')
    async verify(
        @Param('token') token: string, 
        @Res() res: Response
    ){
        try{
            let { id }       = await this.userModel.findOneOrFail({ token });

            let randomstring = require("randomstring");
            let update_data  = { email_verified_at: moment().format('YYYY-MM-DD HH:mm:ss'), token: randomstring.generate(100) }
            
            await this.userModel.nativeUpdate({ id }, update_data);

            return res.status(HttpStatus.OK).json({ token: update_data.token });

        } catch(error) {

            if( error instanceof NotFoundError){
                throw new NotFoundException();
            }

            throw new HttpException(error.message, error.status); 
        }
    }

    @Put('user/:token')
    async fetchToken(
        @Param('token') token: string, 
        @Res()          res:   Response
    ){
        try{
            // Find user by token
            await this.userModel.findOneOrFail({ token });

            // Return user profile
            return res.status(HttpStatus.OK).json({});

        } catch(error) {
            console.log(error);
            if( error instanceof NotFoundError ){
                throw new NotFoundException();
            }

            throw new HttpException(error.message, error.status); 
        }
    }

    @UseGuards(AuthGuard)
    @Get('user')
    /**
     * Fetches the user profile of the authenticated user.
     *
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    async getProfile(@Req() req: Request,  @Res() res: Response) {
        try {
            // Fetch the user profile of the authenticated user from the database.
            let user = await this.userModel.findOneOrFail({ id: get(req,'user').id });

            // Return the user profile as a JSON response with a 200 status code.
            res.status(HttpStatus.OK).json({ user });

        } catch(error) {
            // Log any errors that occur.
            this.logger.error(error);
            // If the user is not found, throw a NotFoundException.
            throw new HttpException(error.message, error.status);
        }
    } 

    /**
     * Updates the authenticated user's profile.
     *
     * @param {any} body - The request body containing the updated user data.
     * @param {Request} req - The request object.
     * @param {Response} res - The response object.
     * @returns {Promise<void>} - A promise that resolves when the operation is complete.
     */
    @UseGuards(AuthGuard)
    @Post('user')
    async updateUser(
        @Body() body: UpdateAuthValidation, 
        @Req()  req: Request,  
        @Res()  res: Response
    ) {
        // Get the authenticated user from the request.
        let authUser = get(req,'user');
        try {
            // Update the user's data in the database.
            await this.userModel.create({id: authUser.id, ...body});

            // Fetch the user's data in the database
            let user = await this.userModel.findOneOrFail({ id: get(req,'user').id });

            // Return the updated user data as a JSON response with a 200 status code.
            res.status(HttpStatus.OK).json({ user: omit(user,['company']) });
        } catch (error) {
            // If the user is not found, throw a NotFoundException.
            throw new HttpException(error.message, error.status);  
        }
    } 

    @UseGuards(AuthGuard)
    @Post('upload/image')
    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public/images',
                    filename: (req, file, cb) => {
                        let uniqueSuffix = Date.now();
                        let ext          = file.mimetype.split('/');
                        cb(null, `${uniqueSuffix}.${ext[1]}`);
                    },
                }),
            }
        )
    )
    uploadImage(@UploadedFile() file: Express.Multer.File, @Req() req: Request,  @Res() res: Response) {
        try {
            // Return the uploaded file as a JSON response with a status code of 200
            return res.status(HttpStatus.OK).json({ location:`/images/${file.filename}`});
        } catch(error) {
            // Log any errors that occur
            this.logger.error(error);
        }
    }

    @Post('reset')
    async reset(
        @Body() body: ResetAuthValidation,
        @Req()  req:  Request, 
        @Res()  res:  Response
    ) {
        
        try {
            // Generate random string for token
            let randomstring = require("randomstring");

            await this.userModel.nativeUpdate({ email: body.email },{ token: randomstring.generate(100) });
            
            let user = await this.userModel.findOneOrFail({ email: body.email });

            if( !isNull(user) ){
                await this.mailService.resetPassword(user);
            }

            res.status(HttpStatus.OK).json({});
        
        } catch(error){
            // Log any errors that occur.
            this.logger.error(error);
            // If the user is not found, throw a NotFoundException.            
            throw new HttpException(error.message, error.status);
        }
    } 

    @Post('set/:code/password')
    async setPassword(
        @Param('code') code: string,
        @Body()  body: SetPasswordValidation,
        @Req()   req:  Request, 
        @Res()   res:  Response
    ) {
        
        try {
            // Generate random string for token
            let randomstring = require("randomstring");

            // Hash password
            let password     = await bcrypt.hashSync(body.password, parseInt(this.configService.get('app.env.SALT_LENGTH')));

            // Update token and password
            await this.userModel.nativeUpdate({ token: code },{ password, token: randomstring.generate(100) });
            
            res.status(HttpStatus.OK).json({});
        
        } catch(error){
            throw new InternalServerErrorException();
        }
    } 

    @UseGuards(AuthGuard)
    @Post('society')
    async updateCompany(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        let { company } = get(req,'user');
        try{
            let updatedCompany = await this.societyModel.nativeUpdate(company.id,body);
            return res.status(HttpStatus.OK).json({updatedCompany});
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    } 
}
