import { Test, TestingModule } from '@nestjs/testing';
import { LocaionService } from './locaion.service';

describe('LocaionService', () => {
  let service: LocaionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LocaionService],
    }).compile();

    service = module.get<LocaionService>(LocaionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
