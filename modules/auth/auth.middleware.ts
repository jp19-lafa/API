import { Request, Response, NextFunction } from "express";
import { Database } from "@database";

export class AuthMiddleware {

  public injectUser(req: Request, res: Response, next: NextFunction) {
    if(!req.token || !req.token.sub) return next();
    Database.Models.User.findById(req.token.sub).select('-__v -password').exec((err, user) => {
      if(err || !user) return next();
      
      req.user = user;
      return next();
    });
  }
}