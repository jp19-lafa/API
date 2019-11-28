import { BaseController } from "@modules/base.controller";
import { Request, Response } from "express";
import { MqttService } from "./mqtt.service";

export class ActuatorsController extends BaseController {

  protected readonly mqttService: MqttService;

  constructor() {
    super();
    this.mqttService = new MqttService();
  }

  // public patchActuator = async (req: Request, res: Response) => {
    
  // }

}