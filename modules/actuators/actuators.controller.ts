import { BaseController } from "@modules/base.controller";
import { Request, Response } from "express";
import { ActuatorsService } from "./actuators.service";
import { NotFound, Forbidden } from 'http-errors';

export class ActuatorsController extends BaseController {

  public readonly actuatorsService: ActuatorsService = global.services.actuatorsService;

  constructor() {
    super();
  }

  public getActuator = async (req: Request, res: Response) => {
    this.actuatorsService.getActuatorDataPoints(req.params.id, parseInt(req.query.limit)).then(actuator => {
      res.send({ data: actuator });
    }).catch(error => {
      res.send(new NotFound());
    });
  }

  public patchActuator = async (req: Request, res: Response) => {
    this.actuatorsService.updateActuatorState(req.user, req.params.id, req.body.value).then(actuatorState => {
      res.send({ data: actuatorState });
    }).catch(error => {
      res.send(new NotFound());
    });
  }

}