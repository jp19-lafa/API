import { BaseService } from '@modules/base.service';
import { Database } from '@database';
import { ISensorDataPoint } from '@models/sensorDataPoint.model';


export class SensorsService extends BaseService {

  constructor() {
    super();
  }

  /**
   * Get sensor datapoints of a specific sensor
   * @param {string} sensorid The specific sensor identifier
   * @param {number} limit Amount of datapoints to be returned
   * @returns {Promise<ISensorDataPoint[]>} Array of Sensor Datapoints
   */
  public async getSensorDataPoints(sensorid: string, limit: number = 5): Promise<ISensorDataPoint[]> {
    // TODO Check if user is in Node.user
    return new Promise<ISensorDataPoint[]>((resolve, reject) => {
        Database.Models.SensorDataPoint.find({
          parent: sensorid,
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
}