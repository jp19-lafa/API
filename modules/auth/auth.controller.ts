import { BaseController } from "@modules/base.controller";
import { Request, Response } from "express";
import { AuthService } from "./auth.service";
import { IUser } from "@models/user.model";

export class AuthController extends BaseController {

  public readonly authService: AuthService;

  constructor() {
    super();
    this.authService = new AuthService();
  }

  // FIXME Cannot set headers after they are sent to the client (bad creds)
  public login = async (req: Request, res: Response) => {
    let user = await this.authService.authenticateByCredentials({
      email: req.body.email,
      password: req.body.password
    }).catch((error: Error) => {
      res.status(401).send({ error: error });
    });

    let tokenSet = await this.authService.generateTokenSet(user as IUser).catch((error: Error) => {
      res.status(500).send({ error: error });
    });

    res.status(200).send(tokenSet);
  }

  public refresh = async (req: Request, res: Response) => {
    let user = await this.authService.authenticateUserByRefreshToken(req.body.refresh).catch((error: Error) => {
      res.status(401).send({ error: error });
    });

    let tokenSet = await this.authService.generateTokenSet(user as IUser).catch((error: Error) => {
      res.status(500).send({ error: error });
    });

    res.status(200).send(tokenSet);
  }

  public register = async (req: Request, res: Response) => {
    let user = await this.authService.registerUser(req.body.firstname, req.body.lastname, req.body.email, req.body.password).catch(error => {
      return res.status(500).send({ error: error });
    });

    let tokenSet = await this.authService.generateTokenSet(user as IUser).catch((error: Error) => {
      return res.status(500).send({ error: error });
    });
    
    res.status(200).send(tokenSet);
  }

}