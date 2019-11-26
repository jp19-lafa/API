import { BaseService } from "@modules/base.service";
import { Database } from "@database";
import { ISensorDataPoint } from "@models/sensorDataPoint.model";


export class SensorsService extends BaseService {

  constructor() {
    super();
  }

  // TODO Check is user is in Node.user
  public async getSensorReadings(sensorid: string, limit: number = 5): Promise<ISensorDataPoint[]> {
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