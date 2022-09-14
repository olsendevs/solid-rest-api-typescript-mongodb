import { ObjectId } from "mongodb";
import Client  from "../../entities/Client";
import { IClientRepository } from "../../repositories/IClientRepository";

export class ListClientUseCase {
    constructor(
        private clientsRepository: IClientRepository,
    ) {}
    
    async execute(): Promise<Client[]> {
        const client = await this.clientsRepository.listAll();
        return client;
    }
}