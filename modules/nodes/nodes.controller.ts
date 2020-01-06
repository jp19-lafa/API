import { BaseController } from "@modules/base.controller";
import { Request, Response } from "express";
import { NodesService } from "./nodes.service";
import { NotFound, Forbidden } from 'http-errors';

export class NodesController extends BaseController {

  public readonly nodesService: NodesService = global.services.nodesService;

  constructor() {
    super();
  }

  public getMyNodes = async (req: Request, res: Response) => {
    this.nodesService.getAllMyNodes(req.user).then(nodes => {
      res.send(nodes);
    }).catch(error => {
      res.send(new NotFound());
    });
  }

  public getPublicNodes = async (req: Request, res: Response) => {
    res.send(new Forbidden());
  }

  public getMyNode = async (req: Request, res: Response) => {
    this.nodesService.getMyNodeById(req.user, req.params.id).then(node => {
      res.send(node);
    }).catch(error => {
      res.send(new NotFound());
    });
  }

  public createNode = async (req: Request, res: Response) => {
    this.nodesService.createNode(req.user, req.body.label, req.body.macAddress).then(node => {
      res.send(node);
    }).catch(error => {
      res.send(new Forbidden());
    });
  }

}