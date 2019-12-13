import { Database } from '@database';
import { IUser } from '@models/user.model';
import { INode } from '@models/node.model';
import { v4 as uuidv4 } from 'uuid';

export class DatabaseSeed {

  constructor() {
  }

  public async seed() {
    if (!await Database.Models.User.exists({ email: 'admin@farmlab.team' })) {
      console.log('Creating database seed');
      const user = await this.seedUser();
      console.log('Created user:', user);
      const node = await this.seedNode(user.id, 'Dev Node Alfa', 'AA:AA:AA:AA:AA:AA');
    }
    if (!await Database.Models.Node.exists({ macAddress: 'B4:D5:BD:9B:5B:4F' })) {
      Database.Models.User.findOne({ email: 'admin@farmlab.team' }).exec(async (err, user) => {
        const tomsNode = await this.seedNode(user._id, 'Tom\'s Node', 'B4:D5:BD:9B:5B:4F');
        console.log('Created node:', tomsNode);
      })
    }
  }

  seedUser() {
    return new Promise<IUser>((resolve, reject) => {
      const user = new Database.Models.User({
        firstname: 'FarmLab',
        lastname: 'Administrator',
        email: 'admin@farmlab.team',
        password: '$2b$12$y7L14XYnseL2F6AUL3AE3.c8l5SXwT5zEKSFYj.hwJMD2MWSYYi/i'
      });
      user.save().then(user => { resolve(user) }).catch(error => { reject(error) });
    });
  }

  async seedNode(userid: string, label: string, mac: string) {
    const sensorsTypes = ['airtemp', 'watertemp', 'lightstr', 'airhumidity', 'waterph'];
    const actuatorTypes = ['lightint', 'flowpump', 'foodpump'];
    return new Promise<INode>(async (resolve, reject) => {
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
        label:  label,
        macAddress: mac,
        authorizationKey: uuidv4(),
        members: userid,
        sensors: sensorObjects,
        actuators: actuatorObjects,
      });
      node.save().then(user => { resolve(user) }).catch(error => { reject(error) });

    })
  }


}