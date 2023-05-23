import {
  Controller,
  Get,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ImageUploadService } from './S3.service';
import {
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
  ApiParam,
  ApiProduces,
  ApiProperty,
} from '@nestjs/swagger';
import { AuthService } from '../auth/auth.service';
import { UserService } from '../user/user.service';
import { LocationService } from '../location/location.service';
import { AuthGuard } from '@nestjs/passport';
import { User } from '../../entities/user.entity';

@Controller('upload')
export class UploadController {
  constructor(
    private readonly imageUploadService: ImageUploadService,
    private readonly authService: AuthService,
    private readonly userService: UserService,
    private readonly locationService: LocationService,
  ) {}

  @ApiConsumes('multipart/form-data')
  @Post('/:folder/:id')
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
  async create(
    @Req() request,
    @Res() response,
    @Param('folder') folder: string,
    @Param('id') id: any,
  ) {
    try {
      const key = await this.imageUploadService.fileupload(
        request,
        response,
        folder,
      );

      if (folder == 'locations') {
        await this.locationService.create({
          id: parseInt(id),
          picture: key,
        });
      } else if (folder == 'profile_pictures') {
        await this.userService.create({
          id: parseInt(id),
          picture: key,
        });
      } else {
        return response.status(400).json('Invalid folder');
      }

      return response.status(201).json('image successfully uploaded');
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }

  @Get(':repository/:id?')
  async get(
    @Res() response,
    @Param('repository') repository: string,
    @Param('id') id: number,
  ) {
    let s3Key: string;

    if (repository == 'user') {
      const user: User = await this.userService.findBy({ id });
      s3Key = user.picture;
    } else if (repository == 'location') {
      const location: any = await this.locationService.findBy({ id });
      s3Key = location.picture;
    } else {
      return response.status(400).json('Invalid repository');
    }

    try {
      const image: any = await this.imageUploadService.retrieveImage(s3Key);
      response.set('Content-Type', image.Metadata['contenttype']);
      response.send(image.Body);
    } catch (error) {
      console.error(error);
      response.status(500).json(`Failed to retrieve image: ${error.message}`);
    }
  }
}
