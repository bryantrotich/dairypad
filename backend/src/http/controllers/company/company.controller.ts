import { Body, Controller, Get, HttpStatus, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { AuthGuard } from '../../guards';
import { Request, Response } from 'express';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import * as path from 'path';
import { CompanyModel } from 'src/database/models';

@Controller('company')
export class CompanyController {

    constructor(
        private readonly companyModel: CompanyModel
    ){}

    @UseGuards(AuthGuard)
    @Get('')
    getProfile(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req['user']);
    }

    @UseGuards(AuthGuard)
    @Post(':companyId/upload/logo')
    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public',
                    filename: (req, file, cb) => {
                        const uniqueSuffix = Date.now();
                        const ext          = file.originalname.split('.');
                        cb(null, `${uniqueSuffix}.${ext[1]}`);
                    },
                }),
            }
        )
    )
    async uploadLogo(@Param('companyId') companyId: string, @UploadedFile() file: Express.Multer.File, @Req() req: Request,  @Res() res: Response) {
        await this.companyModel.create({ id: companyId, logo: file.filename });
        return res.status(HttpStatus.OK).json({});
    }

    @UseGuards(AuthGuard)
    @Post(':companyId/upload/icon')
    @UseInterceptors(
        FileInterceptor(
            'file',
            {
                storage: diskStorage({
                    destination: './public',
                    filename: (req, file, cb) => {
                        const uniqueSuffix = Date.now();
                        const ext          = file.originalname.split('.');
                        cb(null, `${uniqueSuffix}.${ext[1]}`);
                      },
                }),
            }
        )
    )
    async uploadIcon(@Param('companyId') companyId: string, @UploadedFile() file: Express.Multer.File, @Req() req: Request,  @Res() res: Response) {
        await this.companyModel.create({ id: companyId, icon: file.filename });
        return res.status(HttpStatus.OK).json({file});
    }

    @UseGuards(AuthGuard)
    @Post('logout')
    async logout(@Req() req: Request,  @Res() res: Response) {
        res.status(HttpStatus.OK).json(req);
    }    

}
