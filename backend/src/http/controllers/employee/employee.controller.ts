import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Logger, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, PermissionsGuard } from '../../guards';
import { Request, Response } from 'express';
import { RoleModel, UserModel } from 'src/database/models';
import { CreateEmployeeValidation } from 'src/http/validations';
import { get, set } from 'lodash';
import { Permissions } from 'src/support/gates';
import * as bcrypt from 'bcrypt';
import { MailService } from 'src/http/services';
@Controller('employees')
@UseGuards(AuthGuard,PermissionsGuard)
export class EmployeeController {

    private readonly logger = new Logger(EmployeeController.name);
    ;
    constructor(
        private readonly mailService: MailService,
        private readonly roleModel: RoleModel,
        private readonly userModel: UserModel
    ){}

    @Permissions('READ_EMPLOYEES')
    @Get('')
    /**
     * Index method to fetch societies with pagination.
     * 
     * @param {number} page - The current page number for pagination.
     * @param {number} per_page - The number of societies to return per page.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * 
     * @returns {void}
     */
    async index(
        @Query('page', new DefaultValuePipe(Number(1))) page: number,
        @Query('limit', new DefaultValuePipe(Number(5))) limit: number,
        @Query('order', new DefaultValuePipe(String('desc'))) order: string,
        @Query('order_by', new DefaultValuePipe(String('created_at'))) order_by: string,
        @Req() req: Request,  
        @Res() res: Response
    ) {
        try {
            // Fetch auth user
            let user = get(req,'user');

            // Set pagination options
            let options: any = { 
                offset: (page - 1) * limit,
                limit,
                populate: ['role'],
                orderBy: { [order_by]: order} 
            };

            let where: any = { role: {}, society: user.society };

            if( user.role.is_super ){
                set(where.role,'is_super',false);
            }

            if( !user.role.is_super ){
                set(where.role,'state',{ $eq: 0 });
            }            

            // Fetch societies with pagination, using limit and offset
            let [ employees, count ] = await this.userModel.findAndCount(where,options);

            // Get pages
            let pages = Math.ceil(count / limit);
            
            // Send the fetched societies as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ employees, count, pages });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('CREATE_EMPLOYEES')
    @Post('')
    /**
     * Store a newly created society in storage.
     * 
     * @param {CreateCustomerValidation} body - The request body containing the society data.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * 
     * @returns {Promise<void>} - Returns a Promise that resolves when the response is sent.
     */
    async store(
        @Body() body: CreateEmployeeValidation,
        @Req()  req:  Request,  
        @Res()  res:  Response
    ): Promise<void> {
        try {
            // Fetch auth user
            let auth_user = get(req,'user');

            // Generate random string for token
            let randomstring = require("randomstring");
                       
            // Fetch role
            let role: any    = await this.roleModel.findOne({ id: body.role });

            // Assign user society
            set(body,'society',auth_user.society);

            // Assign role
            set(body,'role',role);        

            // Set token
            set(body,'token',randomstring.generate(100));

            // Set password
            set(body,'password',await bcrypt.hash('password', 10));
        
            // Create a new society in the database
            let user = await this.userModel.save(body);

            // Send confirmation email
            await this.mailService.welcome(user);

            // Send the created society as a JSON response with HTTP status 201 Created
            res.status(HttpStatus.CREATED).json({});
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('FETCH_EMPLOYEES')
    @Get('fetch')
    /**
     * Fetch all expense types.
     * 
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * 
     * @returns {Promise<void>} - Returns a Promise that resolves when the response is sent.
     */
    async fetch(
        @Req()  req:  Request,  
        @Res()  res:  Response
    ): Promise<void> {
        try {
            // Fetch auth user
            let user    = get(req,'user');

            // Set the query conditions for fetching roles
            let where: any = { role: { is_super: false, state: { $eq: 0 } }, society: user.society };

            // If the user is a super admin, fetch all roles with state less than 2
            if( user.role.is_super ){
                where.role.state = { $lt: 2 };
            }

            // Fetch all expense types
            let employees = await this.userModel.find(where);

            // Send the fetched expense types as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ employees });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            this.logger.error(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('DELETE_EMPLOYEES')
    @Delete(':id/delete')
    /**
     * Delete a role by its ID.
     * 
     * @param {string} id - The ID of the role to delete.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * 
     * @returns {Promise<void>} - Returns a Promise that resolves when the response is sent.
     */
    async delete(
        @Param('id') id: string,
        @Res() res: Response
    ) {
        try{
            // Delete the role from the database
            await this.userModel.nativeDelete(id);

            // Send the response with HTTP status 200
            return res.status(HttpStatus.OK).json({});
        } catch(error) {
            // Log the error and throw an HTTP exception with the error message and status
            throw new HttpException(error.message, error.status);
        }
    }    

}
