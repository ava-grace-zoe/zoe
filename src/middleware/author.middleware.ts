import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { TOKEN } from 'src/config';
/* cspell: disable-next-line */

@Injectable()
export class AuthorMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    if (req.headers.token === TOKEN) {
      next();
      return;
    }
    res.status(401).send('Unauthorized');
  }
}
