import { Body, Controller, DefaultValuePipe, Delete, Get, Global, HttpException, HttpStatus, Logger, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, PermissionsGuard } from '../../guards';
import { Request, Response } from 'express';
import { PermissionModel, RoleModel, RolePermissionModel } from 'src/database/models';
import { CreateRoleValidation, UpdateRoleValidation } from 'src/http/validations';
import { cloneDeep, difference, get, set } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Permissions } from 'src/support/gates';

@UseGuards(AuthGuard,PermissionsGuard)
@Controller('roles')
export class RoleController {
    private readonly logger = new Logger(RoleController.name);

    constructor(
        private readonly permissionModel: PermissionModel,
        private readonly roleModel: RoleModel,
        private readonly rolePermissionModel: RolePermissionModel,
        private readonly configService: ConfigService
    ){}

    @Permissions('READ_ROLES')
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

    @Permissions('CREATE_ROLES')
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

    @Permissions('READ_ROLES')
    @Put(':id/show')
    /**
     * Fetch a role by its ID.
     * 
     * @param {string} id - The ID of the role to fetch.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * 
     * @returns {Promise<void>} - Returns a Promise that resolves when the response is sent.
     */
    async show(
        @Param('id') id: string,
        @Req() req: Request,  
        @Res() res: Response
    ) {
        try{
            // Fetch the role from the database
            let role = await this.roleModel.findOneOrFail({id},{ populate:['permissions'] });

            // Send the response with HTTP status 200
            return res.status(HttpStatus.OK).json({role});
        } catch(error) {
            // Log the error and throw an HTTP exception with the error message and status
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('UPDATE_ROLES')
    @Put(':id/update')
    /**
     * Fetch a role by its ID.
     * 
     * @param {string} id - The ID of the role to fetch.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * 
     * @returns {Promise<void>} - Returns a Promise that resolves when the response is sent.
     */
    async update(
        @Param('id') id: string,
        @Body() body:    UpdateRoleValidation,
        @Req() req:      Request,  
        @Res() res:      Response
    ) {
        try{
            // Fetch role
            let role =  await this.roleModel.findOneOrFail({id},{ populate: ['permissions'] });

            let checkfordeleted = difference(role.permissions.map(permission => permission.id),body.permissions);
            let checkforadded   = difference(body.permissions,role.permissions.map(permission => permission.id));

            // Update role
            await this.roleModel.nativeUpdate({id},{ name: body.name });
            
            // Delete permissions
            await Promise.all(
                cloneDeep(checkfordeleted).map( 
                    async permission => {
                        let fetched_permission = await this.permissionModel.findOneOrFail({ id: permission });
                        let role_permission    = await this.rolePermissionModel.findOneOrFail({ role, permission: fetched_permission });
                        return await this.rolePermissionModel.nativeDelete({ id: role_permission.id });
                    }
                )
            );

            // Assign permissions
            await Promise.all(
                cloneDeep(checkforadded).map( 
                    async permission => {
                        let fetched_permission = await this.permissionModel.findOneOrFail({ id: permission });
                        return await this.rolePermissionModel.save({ role, permission: fetched_permission });
                    }
                )
            );            

            // Send the response with HTTP status 200
            return res.status(HttpStatus.OK).json({});
        } catch(error) {
            console.log(error);
            // Log the error and throw an HTTP exception with the error message and status
            throw new HttpException(error.message, error.status);
        }
    }    

    @Permissions('DELETE_ROLES')
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

    @Permissions('READ_ROLES')
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

            // Fetch all expense types
            let roles = await this.roleModel.find({ state: { $eq: 0 }, society: user.society });

            // Send the fetched expense types as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ roles });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            this.logger.error(error);
            throw new HttpException(error.message, error.status);
        }
    }       

}
