import { BaseController } from "@modules/base.controller";
import { Request, Response } from "express";
import { ActuatorsService } from "./actuators.service";
import { NotFound, Forbidden } from 'http-errors';

export class ActuatorsController extends BaseController {

  public readonly actuatorsService: ActuatorsService;

  constructor() {
    super();
    this.actuatorsService = new ActuatorsService();
  }

  public patchActuator = async (req: Request, res: Response) => {
    this.actuatorsService.updateActuatorState(req.params.id, req.body.value).then(sensorState => {
      res.send({ data: sensorState });
    }).catch(error => {
      res.send(new NotFound());
    });
  }

}