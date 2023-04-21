import { Controller, Post, Req, Res } from '@nestjs/common';
import { ImageUploadService } from './S3.service';

@Controller('upload')
export class UploadController {
    constructor(private readonly imageUploadService: ImageUploadService) {}

    @Post()
    async create(@Req() request, @Res() response) {
    try {
      await this.imageUploadService.fileupload(request, response);
    } catch (error) {
      return response
        .status(500)
        .json(`Failed to upload image file: ${error.message}`);
    }
  }
}
