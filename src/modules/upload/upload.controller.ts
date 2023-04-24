import { Controller, Get, Param, Post, Req, Res } from '@nestjs/common';
import { ImageUploadService } from './S3.service';
import { ApiBody, ApiConsumes, ApiParam } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';

@Controller('upload')
export class UploadController {
    constructor(
        private readonly imageUploadService: ImageUploadService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly locationService: LocationService
    ) {}

    @ApiConsumes('multipart/form-data')
    @Post('/:folder/:lid?')
    @ApiBody({
    description: 'Image file',
    type: 'object',
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
    },
    })
    @ApiParam({
        name: 'lid',
        required: false,
    })
    async create(
        @Req() request, 
        @Res() response, 
        @Param('folder') folder: string, 
        @Param('lid') lid?:number
        ) {
        const uid = await this.authService.userId(request);
        try {
        const key = await this.imageUploadService.fileupload(request, response, folder);

        if(folder == 'locations'){
            await this.locationService.create({
                id: lid, 
                picture: key
            });
        }
        else if(folder == 'profile_pictures'){
            await this.userService.create({
                id: uid, 
                picture: key
            });
        }

        return response.status(201).json('image successfully uploaded');

        } catch (error) {
        return response
            .status(500)
            .json(`Failed to upload image file: ${error.message}`);
        }
    }

    @Get('/:id')
    async get(@Req() request, @Res() response, @Param('folder') folder: string) {

    }
}
