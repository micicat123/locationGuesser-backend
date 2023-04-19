import { Module } from '@nestjs/common';
import { CommonModulesService } from './common-modules.service';

@Module({
  providers: [CommonModulesService]
})
export class CommonModulesModule {}
