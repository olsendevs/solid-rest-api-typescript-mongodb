import { ObjectId } from "mongodb";
import Client  from "../../entities/Client";
import { NotFoundError } from "../../helpers/api-errors";
import { IClientRepository } from "../../repositories/IClientRepository";

export class ListClientByIdUseCase {
    constructor(
        private clientsRepository: IClientRepository,
    ) {}
    
    async execute(id: ObjectId): Promise<Client> {
        const client =  await this.clientsRepository.findById(id);
        if(!client){
            throw new NotFoundError('Not found any client with this ID.');
        }

        return client
    }
}