import { Router } from 'express';

export class BaseController{

  protected router: Router;

  constructor(){

    this.router = Router();

  }

  getRouter(): Router{

    return this.router;

  }

}
