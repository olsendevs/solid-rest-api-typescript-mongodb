import Client  from "../../entities/Client";
import { ApiError, BadRequestError } from "../../helpers/api-errors";
import { IClientRepository } from "../../repositories/IClientRepository";
import { ICreateClientRequestDTO } from "./CreateClientDTO";

export class CreateClientUseCase {
    constructor(
        private clientsRepository: IClientRepository,
    ) {}
    
    async execute(data: ICreateClientRequestDTO): Promise<Client> {
        const userAlreadyExists = await this.clientsRepository.findByEmail(data.email);

        if(userAlreadyExists){
            throw new BadRequestError('Client already exists.');
        }
        const user = new Client(data);

        await this.clientsRepository.save(user);

        return user;
    }
}