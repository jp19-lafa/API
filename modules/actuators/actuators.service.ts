import { BaseService } from "@modules/base.service";
import { Database } from "@database";


export class ActuatorsService extends BaseService {

  constructor() {
    super();
  }


  public async updateActuatorState(actuatorId: string, value: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // TODO Add Actuator Model & MQTT Service
      resolve();
    });
  }
}