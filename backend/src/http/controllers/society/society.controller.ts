import { Body, Controller, DefaultValuePipe, Delete, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard, PermissionsGuard } from '../../guards';
import { Request, Response } from 'express';
import { PermissionModel, RoleModel, RolePermissionModel, SocietyModel, UserModel } from 'src/database/models';
import { CreateSocietyValidation } from 'src/http/validations';
import { cloneDeep, get } from 'lodash';
import { ConfigService } from '@nestjs/config';
import { v4 as uuidv4 } from 'uuid';
import { Permissions } from 'src/support/gates';

@Controller('societies')
@UseGuards(AuthGuard,PermissionsGuard)
export class SocietyController {

    constructor(
        private readonly configService: ConfigService,
        private readonly permissionModel: PermissionModel,
        private readonly rolePermissionModel: RolePermissionModel,
        private readonly societyModel: SocietyModel,
        private readonly roleModel: RoleModel,
        private readonly userModel: UserModel
    ){}

    @Permissions('READ_SOCIETIES')
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

            // Set pagination options
            let options = { 
                offset: (page - 1) * limit,
                limit,
                orderBy: { [order_by]: order} 
            };

            // Fetch societies with pagination, using limit and offset
            let [ societies, count ] = await this.societyModel.findAndCount({},options);

            // Get pages
            let pages = Math.ceil(count / limit);
            
            // Send the fetched societies as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ societies, count, pages });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('CREATE_SOCIETIES')
    @Post('')
    /**
     * Store a newly created society in storage.
     * 
     * @param {CreateSocietyValidation} body - The request body containing the society data.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * 
     * @returns {Promise<void>} - Returns a Promise that resolves when the response is sent.
     */
    async store(
        @Body() body: CreateSocietyValidation,
        @Req()  req:  Request,  
        @Res()  res:  Response
    ): Promise<void> {
        try {

            // Create a new society in the database
            let society: any = await this.societyModel.save(body);

            let permissions: any = this.configService.get<any>('app.modules').map(
                (module) => {
                    return cloneDeep(this.configService.get<any>('app.permissions')).map(
                        (permission) => {
                            return {
                                id:         uuidv4(),
                                module:     module.value,
                                name:       permission.name.replace('{MODULE}', module.name.toUpperCase()),
                                society_id: society.id,
                                created_at: new Date(), 
                                updated_at: new Date()
                            }
                        }
                    )
                }
            ).flat();

            await this.permissionModel.insertMany(permissions);

            let roles: any       = cloneDeep(this.configService.get<any>('app.roles')).map( 
                (role) => ({
                    id:         uuidv4(),
                    society_id: society.id,
                    name:       role.name,
                    is_super:   role.state == 2 ? true : false,
                    state:      role.state,
                    created_at: new Date(), 
                    updated_at: new Date()
                })
            );           
            
            await this.roleModel.insertMany(roles);
            
            let role_permissions = cloneDeep(roles).map(
                (role) => {
                switch(role.name){
                    case 'Admin':
                    return permissions.filter( 
                        permission => permission.module != 'societies' 
                    ).map(
                        (permission) => ({ 
                        id:            uuidv4(), 
                        role_id:       role.id, 
                        permission_id: permission.id, 
                        created_at:    new Date(), 
                        updated_at:    new Date() 
                        })
                    )
                    case 'Super':
                    return permissions.map(
                        (permission) => ({ 
                        id:            uuidv4(),
                        role_id:       role.id, 
                        permission_id: permission.id, 
                        created_at:    new Date(), 
                        updated_at:    new Date() 
                        })
                    );
                }
                }
            ).flat();     
            
            await this.rolePermissionModel.insertMany(role_permissions);
            
            // Send the created society as a JSON response with HTTP status 201 Created
            res.status(HttpStatus.CREATED).json({ society });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('READ_SOCIETIES')
    @Put(':id/switch')
    async switch( 
        @Param('id') society_id: string,
        @Req()       req: Request,  
        @Res()       res: Response
    ) {
        try {
            let auth_user = get(req,'user');
            
            // Fetch society
            let society = await this.societyModel.findOneOrFail({ id: society_id });

            // If society not found, throw an error
            let super_role = await this.roleModel.findOneOrFail({ society, is_super: true },{ populate: ['permissions'] });

            // Assign user society
            this.userModel.assign(auth_user,{ role: super_role, society });

            // Save user
            await this.userModel.getEntityManager().persistAndFlush(auth_user);

            // Update the request user with the new society
            let user: any = await this.userModel.findOneOrFail({ id: auth_user.id });

            // Extract permissions from the role
            let permissions = super_role.permissions.map(permission => permission.name);

            // Send the created society as a JSON response with HTTP status 201 Created
            res.status(HttpStatus.CREATED).json({ user, permissions });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }        
    }    

    @Permissions('DELETE_SOCIETIES')
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
            await this.societyModel.nativeDelete(id);

            // Send the response with HTTP status 200
            return res.status(HttpStatus.OK).json({});
        } catch(error) {
            // Log the error and throw an HTTP exception with the error message and status
            throw new HttpException(error.message, error.status);
        }
    }     
}
