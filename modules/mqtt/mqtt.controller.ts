import { BaseController } from "@modules/base.controller";
import { Request, Response } from "express";
import { Forbidden } from 'http-errors';
import { NodesService } from "@modules/nodes/nodes.service";
import { INode } from "@models/node.model";
import { ISensor } from "@models/sensor.model";

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

  public UpdateSensor = async (req: Request, res: Response) => {
    let node: INode = await global.services.nodesService.getNodeByMAC(req.body.client);
    if (!node) return res.sendStatus(404);
    
    let sensor: ISensor = (node.sensors as ISensor[]).filter(sensor => sensor.type === req.body.sensor)[0];
    if (!sensor) return res.sendStatus(404);

    res.status(200).send(await global.services.sensorsService.updateSensorDataPoint(sensor.id, parseFloat(req.body.payload)));
  }

}