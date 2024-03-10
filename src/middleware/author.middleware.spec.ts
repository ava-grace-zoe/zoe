import { AuthorMiddleware } from './author.middleware';

describe('AuthorMiddleware', () => {
  it('should be defined', () => {
    expect(new AuthorMiddleware()).toBeDefined();
  });
});
