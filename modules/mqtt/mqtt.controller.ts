import { BaseController } from "@modules/base.controller";
import { Request, Response } from "express";
import { Forbidden } from 'http-errors';
import { NodesService } from "@modules/nodes/nodes.service";

export class MqttController extends BaseController {

  protected readonly nodeService: NodesService = global.services.nodesService;

  constructor() {
    super();
  }

  public Authenticate = async (req: Request, res: Response) => {
    this.nodeService.isAllowedToConnect(req.body.client, req.body.key).then(allowed => {
      res.send({ success: allowed });
    }).catch(error => {
      res.send(new Forbidden(error));
    });
  }

  public Status = async (req: Request, res: Response) => {
    this.nodeService.changeStatus(req.body.client, req.body.status).then(status => {
      res.send({ success: true, status });
    }).catch(error => {
      res.send(new Forbidden(error));
    });
  }

  public ResetStatus = async (req: Request, res: Response) => {
    this.nodeService.resetStatus().then(status => {
      res.send({ success: true, status });
    }).catch(error => {
      res.send(new Forbidden(error));
    });
  }

}