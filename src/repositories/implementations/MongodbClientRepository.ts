import { CollectionOptions, ObjectId } from "mongodb";
import Client  from "../../entities/Client";
import { IClientRepository } from "../IClientRepository";
import { collections } from "../../services/database.service";


export class MongodbUserRepository implements IClientRepository{

    async findById(id: ObjectId): Promise<Client> {
        return await collections.client.findOne({ _id: id }) as unknown as Client;
    }

    async update(user: Client): Promise<Client> {
        const result = await collections.client.updateOne({ _id: user._id }, { $set: user });
        return user;
    }

    async findByEmail(email: string): Promise<Client> {
        const query = { email: email };
        const user = (await collections.client.findOne(query)) as unknown as Client;
        return user;
    }

    async save(user: Client): Promise<void> {
        await collections.client.insertOne(user);
    }

    async delete(id: ObjectId): Promise<void> {
        await collections.client.findOneAndDelete({ _id: id });
    }

    async listAll(): Promise<Client[]> {
        return (await collections.client.find({}).toArray()) as unknown as Client[]; 
    }
}