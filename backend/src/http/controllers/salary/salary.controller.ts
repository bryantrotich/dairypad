import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard, PermissionsGuard } from "src/http/guards";
import { get, set } from 'lodash';
import { Request, Response } from "express";
import { ExpenseModel, ExpenseTypeModel, SalaryModel, UserModel } from "src/database/models";
import { CreateExpenseValidation, CreateSalaryValidation } from "src/http/validations";
import { Permissions } from "src/support/gates";

@Controller('salaries')
@UseGuards(AuthGuard,PermissionsGuard)
export class SalaryController {

    constructor(
        private readonly salaryModel: SalaryModel,
        private readonly userModel:   UserModel
    ){}

    @Permissions('READ_SALARIES')
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
            let [ salaries, count ] = await this.salaryModel.findAndCount({ society: user.society },{ populate: ['user'], ...options });

            // Get pages
            let pages = Math.ceil(count / limit);
            
            // Send the fetched societies as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ salaries, count, pages });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('CREATE_SALARIES')
    @Post('')
    /**
     * Store a newly created society in storage.
     * 
     * @param {CreateExpenseValidation} body - The request body containing the society data.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * 
     * @returns {Promise<void>} - Returns a Promise that resolves when the response is sent.
     */
    async store(
        @Body() body: CreateSalaryValidation,
        @Req()  req:  Request,  
        @Res()  res:  Response
    ): Promise<void> {
        try {
            // Fetch auth user
            let user = get(req,'user');

            // Fetch selected expense type
            let employee = await this.userModel.findOneOrFail({ id: body.employee });

            // Assign user society
            set(body,'society',user.society);

            // Assign expense type
            set(body,'user',employee);            

            // Create a new society in the database
            await this.salaryModel.save(body);

            // Send the created society as a JSON response with HTTP status 201 Created
            res.status(HttpStatus.CREATED).json({});
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('READ_SALARIES')
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
            // Fetch all expense types
            let salary = await this.salaryModel.find({});

            // Send the fetched expense types as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ salary });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }    
}
