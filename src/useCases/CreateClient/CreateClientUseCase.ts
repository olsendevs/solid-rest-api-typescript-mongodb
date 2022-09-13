import Client  from "../../entities/Client";
import { IClientRepository } from "../../repositories/IClientRepository";
import { ICreateClientRequestDTO } from "./CreateClientDTO";

export class CreateClientUseCase {
    constructor(
        private clientsRepository: IClientRepository,
    ) {}
    
    async execute(data: ICreateClientRequestDTO): Promise<Client> {
        const userAlreadyExists = await this.clientsRepository.findByEmail(data.email);

        if(userAlreadyExists){
            throw new Error('Client already exists.');
        }
        const user = new Client(data);

        await this.clientsRepository.save(user);

        // await this.mailProvider.sendMail({
        //     to: {
        //         name: data.name,
        //         email: data.email,
        //     },
        //     from: {
        //         name: 'Equipe do Meu App',
        //         email: '3e2f45216e-af6a27@inbox.mailtrap.io',
        //     },
        //     subject: 'Seja bem-vindo à plataforma',
        //     body: '<p>Você já pode fazer login em nossa plataforma.</p>'
        // });

        return user;
    }
}