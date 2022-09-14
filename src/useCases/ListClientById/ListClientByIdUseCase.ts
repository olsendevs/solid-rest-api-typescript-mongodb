import { ObjectId } from "mongodb";
import Client  from "../../entities/Client";
import { IClientRepository } from "../../repositories/IClientRepository";

export class ListClientByIdUseCase {
    constructor(
        private clientsRepository: IClientRepository,
    ) {}
    
    async execute(id: ObjectId): Promise<Client> {
         return await this.clientsRepository.findById(id);
    }
}