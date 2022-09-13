import { CollectionOptions, ObjectId } from "mongodb";
import Client  from "../../entities/Client";
import { IClientRepository } from "../IClientRepository";
import { collections } from "../../services/database.service";


export class MongodbUserRepository implements IClientRepository{

    async findByEmail(email: string): Promise<Client> {
        const query = { email: email };
        const user = (await collections.client.findOne(query)) as unknown as Client;
        return user;
    }

    async save(user: Client): Promise<void> {
        console.log(user);
        await collections.client.insertOne(user);
    }

    async delete(id: ObjectId): Promise<Client> {

        const user = await collections.client.find(x => x.id === id) as unknown as Client;
        await collections.client.deleteOne(user);
        return user;
    }

    async listAll(): Promise<Client[]> {
        return (await collections.client.find({}).toArray()) as unknown as Client[]; 
    }
}