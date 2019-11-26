import { Database } from "@database";
import { IUser } from "@models/user.model";
import { INode } from "@models/node.model";
import { v4 } from "uuid";

export class DatabaseSeed {

  constructor() {
  }

  public async seed() {
    if(await Database.Models.User.exists({ email: 'admin@farmlab.team' })) return;
    console.log('Creating database seed');
    const user = await this.seedUser();
    console.log('Created user:', user);
    const node = await this.seedNode(user.id);
    console.log('Created node:', node);
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

  seedNode(userid: string) {
    const sensorsTypes = ['airtemp', 'watertemp', 'lightstr', 'airhumidity', 'waterph'];
    return new Promise<INode>((resolve, reject) => {
      let sensorsPromises = [];
      sensorsTypes.forEach(sensor => {
        let sensorShema = new Database.Models.Sensor({
          type: sensor
        });
        sensorsPromises.push(sensorShema.save());
      });

      Promise.all(sensorsPromises).then(sensorObjects => {
        const node = new Database.Models.Node({
          label: "Dev Node Alfa",
          macAddress: "AA:AA:AA:AA:AA:AA",
          authorizationKey: v4(),
          members: userid,
          sensors: sensorObjects,
        });
        node.save().then(user => { resolve(user) }).catch(error => { reject(error) });
      });

    })
  }


}