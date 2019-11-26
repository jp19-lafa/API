import { BaseService } from "@modules/base.service";
import { Database } from "@database";
import { INode } from "@models/node.model";
import { ISensor } from "@models/sensor.model";
import { ISensorDataPoint } from "@models/sensorDataPoint.model";


export class NodesService extends BaseService {

  constructor() {
    super();
  }

  public async getAllMyNodes(user: any): Promise<INode[]> {
    return new Promise<INode[]>((resolve, reject) => {
      Database.Models.Node.find({ members: user.id })
        .select("-__v -authorizationKey -macAddress")
        .populate({
          path: "members",
          select: "_id firstname lastname"
        })
        .populate({
          path: "sensors",
          select: "-__v",
        })
        .exec((err, nodes) => {
          if (err) return reject(new Error(err.name));
          else if (!nodes) return reject(new Error('NotFound'));
          else return resolve(nodes);
        });
    });
  }

  public async getMyNodeById(user: any, nodeid: string): Promise<INode> {
    return new Promise<INode>((resolve, reject) => {
      Database.Models.Node.findOne({ members: user.id, _id: nodeid })
        .select("-__v -authorizationKey -macAddress")
        .populate({
          path: "members",
          select: "_id firstname lastname"
        })
        .populate({
          path: "sensors",
          select: "-__v",
        })
        .exec((err, nodes) => {
          if (err) return reject(new Error(err.name));
          else if (!nodes) return reject(new Error('NotFound'));
          else return resolve(nodes);
        });
    });
  }

  // TODO Check is user is in Node.user
  public async getSensorReadings(sensorid: string): Promise<ISensorDataPoint[]> {
    return new Promise<ISensorDataPoint[]>((resolve, reject) => {
      Database.Models.Sensor.find({
        parent: sensorid,
      })
        .sort('-timestamp')
        .limit(5)
        .select('-__v -_id')
        .exec((err, nodes) => {
          if (err) return reject(new Error(err.name));
          else if (!nodes) return reject(new Error('NotFound'));
          else return resolve(nodes);
        });
    });
  }
}