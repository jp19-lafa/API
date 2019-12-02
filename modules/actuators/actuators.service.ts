import { BaseService } from '@modules/base.service';
import { Database } from '@database';
import { IActuatorDataPoint } from '@models/actuatorDataPoint.model';
import { Mqtt } from '@mqtt';
import { IUser } from '@models/user.model';
import { INode } from '@models/node.model';
import { IActuator } from '@models/actuator.model';
import { Message } from 'mosca';


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
        parent: actuatorid
      })
        .sort('-timestamp')
        .limit(limit)
        .select('-__v -_id -parent')
        .exec((err, readings) => {
          if (err) return reject(new Error(err.name));
          else if (!readings) return reject(new Error('NotFound'));
          else return resolve(readings);
        });
    });
  }

  /**
   * Update the state of an actuator
   * @param {IUser} user The user requesting the update
   * @param {string} actuatorId The id of the actuator to update
   * @param {number} value The value to update the actuator to
   * @returns {Promise<IActuator>} The actuator /w updated state
   */
  public async updateActuatorState(user: IUser, actuatorId: string, value: number): Promise<IActuator> {
    // TODO Better error handling
    return new Promise<IActuator>(async (resolve, reject) => {

      // TODO Enforce user check
      let node: INode = await this.getParentNodeByActuatorId(user, actuatorId);

      let actuator: IActuator = await this.updateActuatorValueById(actuatorId, value);

      let message: Message = {
        topic: `${node.macAddress}/actuator/${actuator.type}`,
        payload: value,
        qos: 2,
        retain: false
      };

      Mqtt.Server.publish(message, () => {
        resolve(actuator);
      });
    });
  }

  private async getParentNodeByActuatorId(user: IUser, actuatorId: string): Promise<INode>{
    return new Promise<INode>((resolve, reject) => {
      Database.Models.Node.findOne({ actuators: actuatorId, members: user.id }).exec((err, node) => {
        if (err || !node) return reject(new Error('ServerError'));
        resolve(node);
      });
    });
  }

  private async updateActuatorValueById(actuatorId: string, value: number): Promise<IActuator> {
    return new Promise<IActuator>((resolve, reject) => {
      new Database.Models.ActuatorDataPoint({
        value: value,
        parent: actuatorId
      }).save().then(fulfilled => {
        Database.Models.Actuator.findById(actuatorId).select('-__v').exec((err, actuator) => {
          if (err || !actuator) return reject(new Error('ServerError'));
          actuator.value = value;
          actuator.timestamp = new Date(Date.now());
          actuator.save().then(actuator => {
            resolve(actuator);
          });
        });
      });
    });
  }
}