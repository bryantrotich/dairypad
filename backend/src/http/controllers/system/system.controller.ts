import { Body, Controller, Get, HttpStatus, Post, Req, Res, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { AuthService, MailService } from 'src/http/services';
import { RegisterValidation } from 'src/support/validation';
import { CompanyModel, RoleModel, UserModel } from 'src/database/models';
import * as bcrypt from 'bcrypt';
import { ConfigService } from '@nestjs/config';
import { isEmpty, isNull } from 'lodash';
import { sep } from 'path';
@Controller('system')
export class SystemController {

    private readonly file_path = `${process.cwd()}${sep}configurations.json`;

    private jsonPlugin = require('json-reader-writer');

    constructor(

    ){}

    @UseGuards(AuthGuard)
    @Get('')
    getConfigurations(@Req() req: Request,  @Res() res: Response) {
        try{
            return res.status(HttpStatus.OK).json({ configurations: this.jsonPlugin.readJSON(this.file_path) });
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @UseGuards(AuthGuard)
    @Post('configurations')
    updateConfigurations(@Body() body: any, @Req() req: Request,  @Res() res: Response) {
        try{
            this.jsonPlugin.writeJson(this.file_path, body)
            return res.status(HttpStatus.OK).json({ configurations: this.jsonPlugin.readJSON(this.file_path) });
        } catch(err) {
            return res.status(HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req);
    }    

}
