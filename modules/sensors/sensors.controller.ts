import { BaseController } from "@modules/base.controller";
import { Request, Response } from "express";
import { SensorsService } from "./sensors.service";
import { NotFound, Forbidden } from 'http-errors';

export class SensorsController extends BaseController {

  public readonly sensorsService: SensorsService;

  constructor() {
    super();
    this.sensorsService = new SensorsService();
  }

  public getSensorDataPoints = async (req: Request, res: Response) => {
    this.sensorsService.getSensorDataPoints(req.params.id, req.query.limit).then(readings => {
      res.send({ data: readings });
    }).catch(error => {
      res.send(new NotFound());
    });
  }

}