import { Body, Controller, DefaultValuePipe, Get, HttpException, HttpStatus, Post, Query, Req, Res, UseGuards } from "@nestjs/common";
import { AuthGuard, PermissionsGuard } from "src/http/guards";
import { get, isEmpty, has, set } from 'lodash';
import { Request, Response } from "express";
import { DeliveryModel, FarmerModel, TransporterModel } from "src/database/models";
import { Permissions } from "src/support/gates";
import { CreateDeliveryValidation } from "src/http/validations/delivery/create.validation";

@Controller('deliveries')
@UseGuards(AuthGuard,PermissionsGuard)
export class DeliveryController {

    constructor(
        private readonly deliveryModel: DeliveryModel,
        private readonly farmerModel:   FarmerModel,
        private readonly transporterModel:   TransporterModel
    ){}

    @Permissions('READ_DELIVERIES')
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
            let [ deliveries, count ] = await this.deliveryModel.findAndCount({ society: user.society },{ populate: ['farmer','transporter'], ...options });

            // Get pages
            let pages = Math.ceil(count / limit);
            
            // Send the fetched societies as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ deliveries, count, pages });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('CREATE_DELIVERIES')
    @Post('')
    /**
     * Store a newly created delivery in storage.
     * 
     * This endpoint is used to store a newly created delivery in the database.
     * 
     * @param {CreateDeliveryValidation} body - The request body containing the delivery data.
     * @param {Request} req - The HTTP request object.
     * @param {Response} res - The HTTP response object.
     * 
     * @returns {Promise<void>} - Returns a Promise that resolves when the response is sent.
     */
    async store(
        @Body() body: CreateDeliveryValidation,
        @Req()  req:  Request,  
        @Res()  res:  Response
    ): Promise<void> {
        try {
            // Fetch auth user
            let user = get(req,'user');

            // Fetch selected farmer
            let farmer = await this.farmerModel.findOneOrFail({ id: body.farmer });

            if( has(body,'transporter') && !isEmpty(body.transporter) ){
                // Fetch selected transporter
                let transporter = await this.transporterModel.findOneOrFail({ id: body.transporter });   
                // Assign transporter
                set(body,'transporter',transporter);                
            }

            if( has(body,'transporter') && isEmpty(body.transporter) ){
                delete body.transporter;              
            }

            // Assign user society
            set(body,'society',user.society);

            // Assign farmer
            set(body,'farmer',farmer);    
            
            // Create a new delivery in the database
            await this.deliveryModel.save(body);

            // Send the created delivery as a JSON response with HTTP status 201 Created
            res.status(HttpStatus.CREATED).json({});
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }

    @Permissions('READ_DELIVERIES')
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
            let salary = await this.deliveryModel.find({});

            // Send the fetched expense types as a JSON response with HTTP status 200
            res.status(HttpStatus.OK).json({ salary });
        } catch (error) {
            // Log the error and throw an HTTP exception with the error message and status
            console.log(error);
            throw new HttpException(error.message, error.status);
        }
    }    
}
