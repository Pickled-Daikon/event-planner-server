export const MongoClientConnect = jest.fn(() => new Promise((resolve) => resolve(true)));
export const MongoClientDb = jest.fn((DB_NAME: string) => null);

export const MongoClient = jest.fn(() => {
   return {
       connect: MongoClientConnect,
       db: MongoClientDb,
   };
});

export class ObjectId {
    id: string;
    constructor(id: string) {
      this.id = id;
    }
}
