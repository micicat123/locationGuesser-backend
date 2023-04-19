import { Test, TestingModule } from '@nestjs/testing';
import { CommonModulesService } from './common-modules.service';

describe('CommonModulesService', () => {
  let service: CommonModulesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonModulesService],
    }).compile();

    service = module.get<CommonModulesService>(CommonModulesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
