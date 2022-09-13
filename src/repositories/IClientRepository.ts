import { ObjectId } from "mongodb";
import Client from "../entities/Client";

export interface IClientRepository {
    findByEmail(email: string): Promise<Client>;
    save(user: Client): Promise<void>;
    delete(id: ObjectId): Promise<Client>;
    listAll(): Promise<Client[]>;
}