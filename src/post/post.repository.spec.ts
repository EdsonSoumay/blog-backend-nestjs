import { Test, TestingModule } from '@nestjs/testing';
import { PostRepository } from './post.repository';

describe('PostRepository', () => {
  let service: PostRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PostRepository],
    }).compile();

    service = module.get<PostRepository>(PostRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
