import { Test, TestingModule } from '@nestjs/testing';
import { FailpostsController } from './failposts.controller';

describe('FailpostsController', () => {
  let controller: FailpostsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FailpostsController],
    }).compile();

    controller = module.get<FailpostsController>(FailpostsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
