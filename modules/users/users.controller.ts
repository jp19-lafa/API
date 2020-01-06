import { BaseController } from "@modules/base.controller";
import { Request, Response } from "express";
import { UsersService } from "./users.service";
import { Forbidden } from 'http-errors';
import { UserRole } from "@models/user.model";

export class UsersController extends BaseController {

  public readonly usersService: UsersService = global.services.usersService;

  constructor() {
    super();
  }

  public getAllUsers = async (req: Request, res: Response) => {
    if (req.user.role !== UserRole.admin) return res.status(403).send(new Forbidden());
    this.usersService.getAllUsers().then(users => {
      res.send(users);
    }).catch(error => {
      res.status(500).send({ error });
    })
  }

  public getCurrentUser = async (req: Request, res: Response) => {
    // TODO: User is already present in req.user, making this call unnecessary
    this.usersService.getCurrentUser(req.user._id).then(user => {
      res.send(user);
    }).catch(error => {
      res.status(500).send({ error });
    })
  }

}