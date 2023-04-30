import { Controller, Get, Param, Post, Req, Res, UseGuards } from '@nestjs/common';
import { ImageUploadService } from './S3.service';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiParam, ApiProduces, ApiProperty } from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('upload')
export class UploadController {
    constructor(
        private readonly imageUploadService: ImageUploadService,
        private readonly authService: AuthService,
        private readonly userService: UserService,
        private readonly locationService: LocationService
    ) {}

    @ApiBearerAuth()
    @UseGuards(AuthGuard('jwt'))
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
        @Param('lid') lid?:any
        ) {
        
        try {
            const key = await this.imageUploadService.fileupload(request, response, folder);

            if(folder == 'locations'){
                await this.locationService.create({
                    id: parseInt(lid), 
                    picture: key
                });
            }
            else if(folder == 'profile_pictures'){
                const uid = await this.authService.userId(request);
                await this.userService.create({
                    id: uid, 
                    picture: key
                });
            }
            else {
                return response.status(400).json('Invalid folder');
            }

            return response.status(201).json('image successfully uploaded');
        } catch (error) {
            return response
                .status(500)
                .json(`Failed to upload image file: ${error.message}`);
        }
    }

    @Get(':repository/:lid?')
    @ApiParam({
        name: 'lid',
        required: false,
    })
    async get(
        @Req() request, 
        @Res() response, 
        @Param('repository') repository: string,
        @Param('lid') lid?: string,
    ) {
        let s3Key;

        if(repository== 'user'){
            const uid = await this.authService.userId(request);
            const user:any = await this.userService.findBy({id: uid});  
            s3Key = user.picture;
        }
        else if (repository == 'location'){
            const location:any = await this.locationService.findBy({id:lid});
            s3Key = location.picture;
        }
        else {
            return response.status(400).json('Invalid repository');
        }

        try {
            const image:any = await this.imageUploadService.retrieveImage(s3Key);
            response.set('Content-Type', image.Metadata['contenttype']);
            response.send(image.Body);
        } catch (error) {
            console.error(error);
            response.status(500).json(`Failed to retrieve image: ${error.message}`);
        }
    }
}
