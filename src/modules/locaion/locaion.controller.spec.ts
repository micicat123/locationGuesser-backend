import { Test, TestingModule } from '@nestjs/testing';
import { LocaionController } from './locaion.controller';

describe('LocaionController', () => {
  let controller: LocaionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [LocaionController],
    }).compile();

    controller = module.get<LocaionController>(LocaionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
