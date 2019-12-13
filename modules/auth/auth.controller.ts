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
      res.status(500).send({ error: error });
    });

    // FIXME user ? user : null is not the right way
    let tokenSet = await this.authService.generateTokenSet(user ? user : null).catch((error: Error) => {
      res.status(500).send({ error: error });
    });

    res.status(200).send(tokenSet);
  }

  public refresh = async (req: Request, res: Response) => {
    
  }
  public register = async (req: Request, res: Response) => {}

}