import { MongoClient, Db, Collection, MongoClientOptions, ResumeToken } from 'mongodb'

export default class theDB {
  mongoClient: MongoClient
  db: Db
  plantsCollection: Collection

  constructor(uri: string, options?: MongoClientOptions) {
    this.mongoClient = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true })
    this.mongoClient.connect()
      .then((myClient) => {
        this.mongoClient = myClient
        this.db = myClient.db('plants')
        this.getPlants()
        console.log('database connected')
        this.getPlants
        return this
      })
      .catch((err) => console.log(err))
  }

  getPlants() {
    // create/connect to plants collection
    console.log('creating plant collection')
    this.db.createCollection('plants', function (err, plantCollection) {
      if (err) throw err
      console.debug(`${plantCollection.collectionName} data collection created/connected.`)
      this.plantsCollection = plantCollection
      console.debug(`connected to db and found ${this.plantsCollection.count}`)
    })
  }

}
