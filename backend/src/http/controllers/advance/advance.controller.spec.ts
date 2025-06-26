import { Test, TestingModule } from '@nestjs/testing';
import { AdvanceController } from './advance.controller';

describe('AdvanceController', () => {
  let controller: AdvanceController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdvanceController],
    }).compile();

    controller = module.get<AdvanceController>(AdvanceController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
