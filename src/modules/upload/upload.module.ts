import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { ImageUploadService } from './S3.service';

@Module({
  providers: [ImageUploadService],
  controllers: [UploadController]
})
export class UploadModule {}
