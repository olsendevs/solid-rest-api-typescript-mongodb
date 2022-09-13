import * as mongoDB from "mongodb";
import * as dotenv from "dotenv";

export const collections: { client?: mongoDB.Collection } = {}

export async function connectToDatabase () {
    dotenv.config();
 
    const client: mongoDB.MongoClient = new mongoDB.MongoClient(process.env.DB_CONN_STRING);
            
    await client.connect();
        
    const db: mongoDB.Db = client.db(process.env.DB_NAME);
   
    const clientCollection: mongoDB.Collection = db.collection(process.env.CLIENT_COLLECTION_NAME);

    await db.command({
        "collMod": process.env.CLIENT_COLLECTION_NAME,
        "validator": {
            $jsonSchema: {
                bsonType: "object",
                required: ["name", "price", "category"],
                additionalProperties: false,
                properties: {
                _id: {},
                name: {
                    bsonType: "string",
                    description: "'name' is required and is a string"
                },
                email: {
                    bsonType: "string",
                    description: "'email' is required and is a string"
                }
                }
            }
         }
    });

 
    collections.client = clientCollection;
       
         console.log(`Successfully connected to database: ${db.databaseName} and collection: ${clientCollection.collectionName}`);
 }
