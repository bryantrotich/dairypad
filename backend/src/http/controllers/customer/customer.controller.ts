import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Param, Post, Query, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { CustomerModel } from 'src/database/models';
import { CreateCustomerValidation } from 'src/http/validations';
import { get, set } from 'lodash';

@Controller('customers')
export class CustomerController {

    constructor(
        private readonly customerModel: CustomerModel
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
            let options = { 
                offset: (page - 1) * limit,
                limit,
                orderBy: { [order_by]: order} 
            };

            // Fetch societies with pagination, using limit and offset
            let [ customers, count ] = await this.customerModel.findAndCount({ society: user.society },options);

            // Get pages
            let pages = Math.ceil(count / limit);
            
            // Send the fetched societies as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ customers, count, pages });
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
        @Body() body: CreateCustomerValidation,
        @Req()  req:  Request,  
        @Res()  res:  Response
    ): Promise<void> {
        try {
            // Fetch auth user
            let user = get(req,'user');

            // Assign user society
            set(body,'society',user.society);

            // Create a new society in the database
            let product = await this.customerModel.save(body);

            // Send the created society as a JSON response with HTTP status 201 Created
            res.status(HttpStatus.CREATED).json({ product });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

}
