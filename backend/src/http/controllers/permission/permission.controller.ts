import { Body, Controller, DefaultValuePipe, Delete, Get, Global, HttpException, HttpStatus, Logger, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, PermissionsGuard } from '../../guards';
import { Request, Response } from 'express';
import { PermissionModel, RolePermissionModel } from 'src/database/models';
import { CreateCustomerValidation, CreatePermissionValidation, CreateRoleValidation } from 'src/http/validations';
import { cloneDeep, get, set } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Permissions } from 'src/support/gates';

@UseGuards(AuthGuard,PermissionsGuard)
@Controller('permissions')
export class PermissionController {

    private readonly logger = new Logger(PermissionController.name);

    /**
     * The constructor for the PermissionController class.
     * 
     * @param {PermissionModel} permissionModel - The PermissionModel instance for performing database operations related to permissions.
     * @param {ConfigService} configService - The ConfigService instance for accessing the application configuration.
     */
    constructor(
        private readonly permissionModel: PermissionModel,
        private readonly configService: ConfigService
    ){}

    @Permissions('READ_PERMISSIONS')
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
            let options = { 
                offset: (page - 1) * limit,
                limit,
                orderBy: { [order_by]: order} 
            };

            // Fetch societies with pagination, using limit and offset
            let [ permissions, count ] = await this.permissionModel.findAndCount({ society: user.society },options);

            let modules                = this.configService.get<any>('app.modules');
            let actions                = this.configService.get<any>('app.actions');

            // Get pages
            let pages = Math.ceil(count / limit);
            
            // Send the fetched societies as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ actions, modules, permissions, count, pages });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            this.logger.error(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('CREATE_PERMISSIONS')
    @Post('')
    /**
     * Store a newly created society in storage.
     * 
     * @param {CreatePermissionValidation} body - The request body containing the society data.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * 
     * @returns {Promise<void>} - Returns a Promise that resolves when the response is sent.
     */
    async store(
        @Body() body: CreatePermissionValidation,
        @Req()  req:  Request,  
        @Res()  res:  Response
    ): Promise<void> {
        try {
            // Fetch auth user
            let user = get(req,'user');

            // Assign user society
            set(body,'society',user.society);

            // 
            if( body.action === 'all' ) {
                let actions = this.configService.get<any>('app.actions').map((action: any) => action.value).filter((action: string) => action !== 'all');

                actions     = await Promise.all(
                    actions.map(
                        async (action: string) => await this.permissionModel.create({
                            id:          uuidv4(),
                            name:        `${action}_${body.module.split(' ').join('_')}`.toUpperCase(),
                            society:     user.society,
                            module:      body.module,
                            description: body.description,
                            created_at:  new Date(), 
                            updated_at:  new Date()
                        })
                    )
                );

                // Create a new society in the database
                await this.permissionModel.insertMany(actions);                  
            } 

            if( body.action != 'all' ) {
                // Set permission name based on action and module
                set(body,'name',`${body.action}_${body.module}`.toUpperCase());
                // Create a new society in the database
                await this.permissionModel.save(body);                
            }             

            // Send the created society as a JSON response with HTTP status 201 Created
            res.status(HttpStatus.CREATED).json({});
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            this.logger.error(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('READ_PERMISSIONS')
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
            let permissions = await this.permissionModel.find({ module: { $ne: 'societies'}, society: user.society });

            // Send the fetched expense types as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ permissions });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            this.logger.error(error);
            throw new HttpException(error.message, error.status);
        }
    }   
    

    @Permissions('DELETE_PERMISSIONS')
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
            await this.permissionModel.nativeDelete(id);

            // Send the response with HTTP status 200
            return res.status(HttpStatus.OK).json({});
        } catch(error) {
            // Log the error and throw an HTTP exception with the error message and status
            throw new HttpException(error.message, error.status);
        }
    }    

}
