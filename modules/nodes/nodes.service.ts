import { BaseService } from "@modules/base.service";
import { Database } from "@database";
import { INode } from "@models/node.model";
import { IUser } from "@models/user.model";
import { v4 } from 'uuid';

export class NodesService extends BaseService {

  constructor() {
    super();
  }

  /**
   * Get all nodes belonging to a specific user
   * @param {IUser} user The requesting user
   * @returns {Promise<INode[]>} Array of nodes
   */
  public async getAllMyNodes(user: IUser): Promise<INode[]> {
    return new Promise<INode[]>((resolve, reject) => {
      Database.Models.Node.find({ members: user.id })
        .select("-__v -authorizationKey -pairingKey -macAddress")
        .populate({
          path: "members",
          select: "_id firstname lastname"
        })
        .populate({
          path: "sensors",
          select: "-__v",
        })
        .populate({
          path: "actuators",
          select: "-__v",
        })
        .exec((err, nodes) => {
          if (err) return reject(new Error(err.name));
          else if (!nodes) return reject(new Error('NotFound'));
          else return resolve(nodes);
        });
    });
  }

  /**
   * Get a specific node by id
   * @param {IUser} user The requesting user
   * @param {string} nodeid The specific node identifier
   * @returns {Promise<INode>} The specific node
   */
  public async getMyNodeById(user: IUser, nodeid: string): Promise<INode> {
    return new Promise<INode>((resolve, reject) => {
      Database.Models.Node.findOne({ members: user.id, _id: nodeid })
        .select("-__v -authorizationKey -pairingKey -macAddress")
        .populate({
          path: "members",
          select: "_id firstname lastname"
        })
        .populate({
          path: "sensors",
          select: "-__v",
        })
        .populate({
          path: "actuators",
          select: "-__v",
        })
        .exec((err, nodes) => {
          if (err) return reject(new Error(err.name));
          else if (!nodes) return reject(new Error('NotFound'));
          else return resolve(nodes);
        });
    });
  }

  /**
   * Get a specific node by mac address
   * @param {string} macAddress The node's mac address
   * @returns {Promise<INode>} The specific node
   */
  public async getNodeByMAC(macAddress: string): Promise<INode> {
    return new Promise<INode>((resolve, reject) => {
      Database.Models.Node.findOne({ macAddress: macAddress })
        .select("-__v -authorizationKey -pairingKey -macAddress")
        .populate({
          path: "members",
          select: "_id firstname lastname"
        })
        .populate({
          path: "sensors",
          select: "-__v",
        })
        .populate({
          path: "actuators",
          select: "-__v",
        })
        .exec((err, nodes) => {
          if (err) return reject(new Error(err.name));
          else if (!nodes) return reject(new Error('NotFound'));
          else return resolve(nodes);
        });
    });
  }

  public async isAllowedToConnect(macAddress: string, authorizationKey: string): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      // FIXME Enforce some kind of security
      if (macAddress.includes('core-server')) return resolve(true);
      Database.Models.Node.findOne({
        macAddress,
        authorizationKey,
      }).select('_id').exec((err, node) => {
        if (err || !node) return reject('Not allowed to connect!');
        return resolve(true);
      });
    });
  }

  public async changeStatus(macAddress: string, status: boolean): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      Database.Models.Node.findOneAndUpdate({
        macAddress
      }, {
        status
      }, {
        new: true
      }).exec((err, node) => {
        if (err || !node) return reject('Invalid Node!');
        return resolve(node.status);
      });
    });
  }

  public async resetStatus(): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      Database.Models.Node.updateMany({ status: true }, { $set: { status: false } }, { multi: true }, (err, success) => {
        if (err) return reject();
        return resolve();
      })
    });
  }

  public async createNode(macAddress: string): Promise<INode> {
    return new Promise<INode>((resolve, reject) => {
      this.buildNode(macAddress).then(node => {
        resolve(node);
      }).catch(error => {
        reject(error);
      });
    });
  }

  public async pairNode(sub: string, macAddress: string, pairingKey: string): Promise<INode> {
    return new Promise<INode>((resolve, reject) => {
      Database.Models.Node.findOneAndUpdate({ macAddress, pairingKey }, { $push: { members: sub } }, { new: true }).select('-__v -authorizationKey -pairingKey -macAddress').exec((err, node) => {
        if (err || !node) return reject();
        return resolve(node);
      })
    });
  }

  public async addMember(nodeId: string, user: string): Promise<INode> {
    // NOTE This doesn't check if the user exists
    return new Promise<INode>((resolve, reject) => {
      Database.Models.Node.findByIdAndUpdate(nodeId, { $push: { members: user } }, { new: true }).select('-__v -authorizationKey -pairingKey -macAddress').exec((err, node) => {
        if (err || !node) return reject();
        return resolve(node);
      })
    });
  }

  protected async buildNode(macAddress: string) {
    const sensorsTypes = ['airtemp', 'watertemp', 'lightstr', 'airhumidity', 'waterph'];
    const actuatorTypes = ['lightint', 'flowpump', 'foodpump'];
    return new Promise<INode>(async (resolve, reject) => {
      if(!new RegExp('^([0-9A-F]{2}[:]){5}([0-9A-F]{2})$').test(macAddress)) return reject('Invalid MAC');

      let sensorPromises = [];
      sensorsTypes.forEach(sensor => {
        let sensorShema = new Database.Models.Sensor({
          type: sensor
        });
        sensorPromises.push(sensorShema.save());
      });

      let actuatorPromises = [];
      actuatorTypes.forEach(actuator => {
        let actuatorShema = new Database.Models.Actuator({
          type: actuator
        });
        actuatorPromises.push(actuatorShema.save());
      });

      let sensorObjects = await Promise.all(sensorPromises);
      let actuatorObjects = await Promise.all(actuatorPromises);

      const node = new Database.Models.Node({
        label: `node-${v4()}`,
        macAddress: macAddress,
        authorizationKey: v4(),
        pairingKey: v4(),
        sensors: sensorObjects,
        actuators: actuatorObjects,
      });
      node.save().then(user => { resolve(node) }).catch(error => { reject(error) });

    })
  }
}