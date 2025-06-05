import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Param, Post, Put, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { SocietyModel, UserModel } from 'src/database/models';
import { CreateSocietyValidation } from 'src/http/validations';
import { get } from 'lodash';

@Controller('societies')
export class SocietyController {

    constructor(
        private readonly societyModel: SocietyModel,
        private readonly userModel: UserModel
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

    @UseGuards(AuthGuard)
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
            let society = await this.societyModel.save(body);

            // Send the created society as a JSON response with HTTP status 201 Created
            res.status(HttpStatus.CREATED).json({ society });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @UseGuards(AuthGuard)
    @Put(':id/switch')
    async switch( 
        @Param('id') society_id: string,
        @Req()       req: Request,  
        @Res()       res: Response
    ) {
        try {
            let user = get(req,'user');
            
            // Fetch society
            let society = await this.societyModel.findOne({ id: society_id });

            // Assign user society
            this.userModel.assign(user,{ society });

            // Save user
            await this.userModel.getEntityManager().persistAndFlush(user);

            // Send the created society as a JSON response with HTTP status 201 Created
            res.status(HttpStatus.CREATED).json({ user });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }        
    }     
}
