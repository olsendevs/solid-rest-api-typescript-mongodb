import { ObjectId } from "mongodb";
import Client  from "../../entities/Client";
import { ApiError, BadRequestError, NotFoundError } from "../../helpers/api-errors";
import { IClientRepository } from "../../repositories/IClientRepository";

export class ListClientUseCase {
    constructor(
        private clientsRepository: IClientRepository,
    ) {}
    
    async execute(): Promise<Client[]> {
        const client = await this.clientsRepository.listAll();
      
        if(!client){
            throw new NotFoundError('Clients not found');
        }
        return client;
    }
}