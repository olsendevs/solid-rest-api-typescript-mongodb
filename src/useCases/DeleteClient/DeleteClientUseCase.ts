import { ObjectId } from "mongodb";
import Client  from "../../entities/Client";
import { IClientRepository } from "../../repositories/IClientRepository";

export class DeleteClientUseCase {
    constructor(
        private clientsRepository: IClientRepository,
    ) {}
    
    async execute(id: ObjectId): Promise<void> {
        const user = await this.clientsRepository.delete(id);
    }
}