import { NodeWithChildren } from 'domhandler'
import { MongoClient, Db, Collection, MongoClientOptions, ResumeToken } from 'mongodb'

export default class theDB {
  mongoClient: MongoClient
  db: Db
  plantsCollection: Collection



  constructor(uri: string, options?: MongoClientOptions) {
    this.mongoClient = new MongoClient(uri)
    this.mongoClient.connect()
      .then((myClient) => {
        this.mongoClient = myClient
        this.db = myClient.db('plants')
        this.plantsCollection = this.db.collection("plants")
        console.log('database connected')
        this.addOne()
        this.getPlants()
        return 
      })
      .catch((err) => console.log(err))
  }

  addOne() {
    this.plantsCollection.insertOne(
        { name: "two",
        created: new Date() }
    )
    .then( (res) => { 
      console.log(`documents inserted: ${res.insertedId}`) 
    })
    .catch ((err) => { console.error(`Something went wrong: ${err}`) })
  }

  getPlants() {
    // create/connect to plants collection
    console.log('creating plant collection')
    this.plantsCollection.estimatedDocumentCount()
      .then( result => console.log(`counted ${result} plants`) )
      .catch(err => console.error(`Fatal error occurred: ${err}`));
    // this.db.createCollection('plants', function (err, plantCollection) {
    //   if (err) throw err
    //   console.debug(`${plantCollection.collectionName} data collection created/connected.`)
    //   this.plantsCollection = plantCollection
    // })
    console.debug(`connected to db and found ${this.plantsCollection.estimatedDocumentCount()}`)
  }

}
