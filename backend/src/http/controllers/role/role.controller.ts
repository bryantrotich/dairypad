import { Body, Controller, DefaultValuePipe, Delete, Get, Global, HttpException, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { RoleModel, RolePermissionModel } from 'src/database/models';
import { CreateCustomerValidation, CreateRoleValidation } from 'src/http/validations';
import { cloneDeep, get, omit, set } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';

@Global()
@Controller('roles')
export class RoleController {

    constructor(
        private readonly roleModel: RoleModel,
        private readonly rolePermissionModel: RolePermissionModel,
        private readonly configService: ConfigService
    ){}

    @UseGuards(AuthGuard)
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
                populate: ['permissions'],
                orderBy: { [order_by]: order} 
            };

            // Fetch societies with pagination, using limit and offset
            let [ roles, count ] = await this.roleModel.findAndCount({ is_super: false, society: user.society },options);

            // Refactor roles
            // roles                = roles.map( role => ({ ...omit(role,['permissions']), permissions_count: role.permissions.length }) );

            // Get modules
            let modules          = this.configService.get('app.modules')

            // Get pages
            let pages = Math.ceil(count / limit);
            
            // Send the fetched societies as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ modules, roles, count, pages });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @UseGuards(AuthGuard)
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
        @Body() body: CreateRoleValidation,
        @Req()  req:  Request,  
        @Res()  res:  Response
    ): Promise<void> {
        try {
            // Fetch auth user
            let user = get(req,'user');

            // Assign user society
            set(body,'society',user.society);

            // Create a new society in the database
            let role: any        = await this.roleModel.save({ name: body.name, society: user.society });

            // Assign permissions
            body.permissions = cloneDeep(body.permissions).map( permission => ({ id: uuidv4(), role_id: role.id, permission_id: permission }) );

            // Assign role to user
            await this.rolePermissionModel.insertMany(body.permissions)

            // Send the created society as a JSON response with HTTP status 201 Created
            res.status(HttpStatus.CREATED).json({});

        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }


    @UseGuards(AuthGuard)
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
        @Req() req: Request,  
        @Res() res: Response
    ) {
        try{
            // Delete the role from the database
            await this.roleModel.nativeDelete(id);

            // Send the response with HTTP status 200
            return res.status(HttpStatus.OK).json({});
        } catch(error) {
            // Log the error and throw an HTTP exception with the error message and status
            throw new HttpException(error.message, error.status);
        }
    }
}
