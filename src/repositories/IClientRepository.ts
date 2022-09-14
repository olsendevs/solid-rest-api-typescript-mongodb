import { ObjectId } from "mongodb";
import Client from "../entities/Client";

export interface IClientRepository {
    findByEmail(email: string): Promise<Client>;
    findById(id: ObjectId): Promise<Client>;
    update(user: Client): Promise<Client>;
    save(user: Client): Promise<void>;
    delete(id: ObjectId): Promise<void>;
    listAll(): Promise<Client[]>;
}