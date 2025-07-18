import { Test, TestingModule } from '@nestjs/testing';
import { FailPostService } from './fail-post.service';

describe('FailPostService', () => {
  let service: FailPostService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [FailPostService],
    }).compile();

    service = module.get<FailPostService>(FailPostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
