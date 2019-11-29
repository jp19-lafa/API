import { BaseService } from '@modules/base.service';
import { Database } from '@database';
import { IActuatorDataPoint } from '@models/actuatorDataPoint.model';


export class ActuatorsService extends BaseService {

  constructor() {
    super();
  }

  /**
   * Get actuator datapoints of a specific actuator
   * @param {string} actuatorid The specific actuator identifier
   * @param {number} limit Amount of datapoints to be returned
   * @returns {Promise<IActuatorDataPoint[]>} Array of Actuator Datapoints
   */
  public async getActuatorDataPoints(actuatorid: string, limit: number = 5): Promise<IActuatorDataPoint[]> {
    // TODO Check if user is in Node.user
    return new Promise<IActuatorDataPoint[]>((resolve, reject) => {
        Database.Models.ActuatorDataPoint.find({
          parent: actuatorid,
        })
        .sort('-timestamp')
        .limit(limit)
        .select('-__v -_id')
        .exec((err, readings) => {
          if (err) return reject(new Error(err.name));
          else if (!readings) return reject(new Error('NotFound'));
          else return resolve(readings);
        });
    });
  }

  public async updateActuatorState(actuatorId: string, value: number): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      // TODO Add Actuator Model & MQTT Service
      resolve();
    });
  }
}