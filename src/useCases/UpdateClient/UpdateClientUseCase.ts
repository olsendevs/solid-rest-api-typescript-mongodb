import Client  from "../../entities/Client";
import { IClientRepository } from "../../repositories/IClientRepository";
import { IUpdateClientRequestDTO } from "./UpdateClientDTO";

export class UpdateClientUseCase {
    constructor(
        private clientsRepository: IClientRepository,
    ) {}
    
    async execute(data: IUpdateClientRequestDTO): Promise<Client> {

        const user = new Client(data, data._id);
        const result = await this.clientsRepository.update(user);

        return result;
    }
}