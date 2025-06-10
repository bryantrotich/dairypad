import { Test, TestingModule } from '@nestjs/testing';
import { ExpenseTypeController } from './expense-type.controller';

describe('ExpenseTypeController', () => {
  let controller: ExpenseTypeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ExpenseTypeController],
    }).compile();

    controller = module.get<ExpenseTypeController>(ExpenseTypeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
